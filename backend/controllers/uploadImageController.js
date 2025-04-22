const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');
const { PINATA_APIKEY, PINATA_SECRETKEY } = require('../config/serverConfig');
const { generateEncryptionKey } = require('../utils/generateKey');
const { encryptFile } = require('../utils/encryption');
const userModel = require('../models/User');

async function uploadImageController(req, res) {
  try {
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
      pinata_api_key: "660d78a084031c916392",
      pinata_secret_api_key: "32c5671d540a3e18f4b4fbf6d5c26558d0ebd82a7cf9846d7c39d13ad5a03e5e",
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
