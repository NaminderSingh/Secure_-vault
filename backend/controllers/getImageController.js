const UserModel = require('../models/User');
const File = require('../models/shared'); // File model for shared images
const { decryptData } = require('../utils/decryption');
const axios = require('axios');

const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";
// const PINATA_GATEWAY_URL = "https://ipfs.io/ipfs/";

// Helper function to retrieve data from IPFS
async function returnIpfsResponse(ipfsHash) {
  try {
    console.log(`Fetching from IPFS: ${PINATA_GATEWAY_URL}${ipfsHash}`);
    const res = await axios.get(`${PINATA_GATEWAY_URL}${ipfsHash}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching from IPFS for hash ${ipfsHash}:`, error.message);
    throw error;
  }
}

// Controller to get images (personal images, images shared by you, and images shared with you)
async function getImageController(req, res, next) {
  try {
    const address = req.address;
    const userAddress = address.toLowerCase();
    const user = await UserModel.findOne({ userAddress });

    if (!user) throw new Error("User does not exist");

    const ipfsHashArray = req.body; // IPFS hashes from the request body
    const decryptedImageArr = [];

    // Handle personal images (uploaded by the user)
    if (ipfsHashArray.length > 0) {
      const encryptedDataArr = await Promise.all(
        ipfsHashArray.map(async (ipfsHash) => {
          const res = await returnIpfsResponse(ipfsHash);
          return res;
        })
      );

      for (const img of encryptedDataArr) {
        if (!img.encryptedData || !img.iv) {
          throw new Error('Missing encryptedData or iv in IPFS response');
        }

        const encryptedDataBuffer = Buffer.from(img.encryptedData, 'base64');
        const ivBuffer = Buffer.from(img.iv, 'base64');
        const decryptedImgData = decryptData(encryptedDataBuffer, ivBuffer, user.encryptionKey);
        decryptedImageArr.push(decryptedImgData.toString('base64'));
      }
    }

    res.status(200).json({ message: "Images Retrieved Successfully", decryptedImageArr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}




module.exports = { getImageController };
