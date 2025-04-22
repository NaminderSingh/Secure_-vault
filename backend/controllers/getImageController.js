const UserModel = require('../models/User');
const { decryptData } = require('../utils/decryption');
const axios = require('axios');

const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

// Helper function to retrieve data from IPFS
async function returnIpfsResponse(ipfsHash) {
  const res = await axios.get(`${PINATA_GATEWAY_URL}${ipfsHash}`);
  return res.data;
}

async function getImageController(req, res, next) {


  try {
    const address = req.address;
    const userAddress = address.toLowerCase();
    const user = await UserModel.findOne({ userAddress });

    if (!user) throw new Error("User does not exist");

    const ipfsHashArray = req.body;
    const decryptedImageArr = [];

    if (ipfsHashArray.length > 0) {
      // Fetch encrypted data and IV from IPFS
      const encryptedDataArr = await Promise.all(
        ipfsHashArray.map(async (ipfsHash) => {
          const res = await returnIpfsResponse(ipfsHash); // Log the response to verify the structure
          return res; // Assuming res contains both encryptedData and iv
        })
      );

      for (const img of encryptedDataArr) {
        // Check if encryptedData and iv exist in the response
        if (!img.encryptedData || !img.iv) {
          throw new Error('Missing encryptedData or iv in IPFS response');
        }

        // Convert base64-encoded strings to Buffers
        const encryptedDataBuffer = Buffer.from(img.encryptedData, 'base64');
        const ivBuffer = Buffer.from(img.iv, 'base64');

        // Decrypt the image using the user's encryption key
        const decryptedImgData = decryptData(encryptedDataBuffer, ivBuffer, user.encryptionKey);

        // Convert decrypted data to base64 for easy use in frontend
        decryptedImageArr.push(decryptedImgData.toString('base64'));
      }
    }

    res.status(200).json({ message: "Image Sent", decryptedImageArr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = { getImageController };
