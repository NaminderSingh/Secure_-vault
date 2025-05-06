const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');
const { PINATA_APIKEY, PINATA_SECRETKEY } = require('../config/serverConfig');
const { generateEncryptionKey } = require('../utils/generateKey');
const { encryptFile } = require('../utils/encryption');
const userModel = require('../models/User');

async function uploadImageController(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const address = req.address;

    const userAddress = address.toLowerCase();

    // Find user in DB
    const user = await userModel.findOne({ userAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate encryption key if missing
    if (!user.encryptionKey) {
      const encryptionKey = generateEncryptionKey(32);
      user.encryptionKey = encryptionKey;
      console.log("created encrytpion key")
      await user.save();
    }

    // Encrypt uploaded file buffer
    const { encryptedData, iv } = encryptFile(req.file.buffer, user.encryptionKey);
// Bundle both encrypted data and IV into an object
const dataToUpload = {
  encryptedData: encryptedData.toString('base64'), // Convert to base64 for easy storage
  iv: iv.toString('base64') // Convert IV to base64 for easy storage
};

// Convert object to JSON string
const jsonData = JSON.stringify(dataToUpload);

// Now upload the jsonData to IPFS
const stream = Readable.from(jsonData);
const formData = new FormData();
formData.append('file', stream, {
  filename: 'encrypted-file.json', // Use .json extension to signify it's JSON
  contentType: 'application/json'
});

const response = await axios.post(
  'https://api.pinata.cloud/pinning/pinFileToIPFS',
  formData,
  {
    headers: {
      pinata_api_key: "cf8304865daf5304ec3d",
      pinata_secret_api_key: "fbe8c3418bbc3daac6ab44b84f4b2573a8d914f30ab99f75507fe73e251fc78c",
      ...formData.getHeaders()
    }
  }
);


    console.log('📦 Uploaded to IPFS:');

    res.status(200).json({
      message: 'File uploaded to IPFS successfully!',
      ipfsHash: response.data.IpfsHash
    });

  } catch (err) {
    console.error('🔥 Error in uploadImageController:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { uploadImageController };
