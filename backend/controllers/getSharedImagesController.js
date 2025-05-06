const shared = require('../models/shared');
const UserModel = require('../models/User');
const axios = require('axios');
const { decryptData } = require('../utils/decryption'); // Assuming decryptData is a utility function

// Pinata Gateway URL
const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/";

// This function retrieves the IPFS data using the Pinata gateway URL
async function returnIpfsResponse(ipfsHash) {
  try {
    const res = await axios.get(`${PINATA_GATEWAY_URL}${ipfsHash}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching IPFS data:", error);
    throw new Error("Failed to retrieve data from IPFS");
  }
}

async function getSharedImagesController(req, res) {
    if (!req.address) {
        return res.status(400).json({
            success: false,
            message: 'Receiver address is required'
        });
    }

    try {
        receiverAddress=req.address

        const sharedImagesHashes = await shared.find({ receiverAddress }).sort({ timestamp: -1 });
        if (sharedImagesHashes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No images found for the receiver address'
            });
        }

        const decryptedImageArr = [];

        for (const imageHashObj of sharedImagesHashes) {
            const ipfsHash = imageHashObj.imageHash; // Corrected to match the actual field name
            const img = await returnIpfsResponse(ipfsHash); // Fetch image data from IPFS

            if (!img.encryptedData || !img.iv) {
                throw new Error('Missing encryptedData or iv in IPFS response');
            }

            // Convert both senderAddress in imageHashObj and query receiverAddress to lowercase
            const senderAddressLower = imageHashObj.senderAddress.toLowerCase();

            const user = await UserModel.findOne({ userAddress: senderAddressLower }); // Change here

            if (!user) {
                console.warn(`User not found for sender address: ${senderAddressLower}`);
                continue; // Skip this image if no user is found
            }

            const encryptedDataBuffer = Buffer.from(img.encryptedData, 'base64');
            const ivBuffer = Buffer.from(img.iv, 'base64');

            const decryptedImgData = decryptData(encryptedDataBuffer, ivBuffer, user.encryptionKey);

            // Push the image details to the response
            decryptedImageArr.push({
                imageHash: imageHashObj.imageHash,
                imageName: imageHashObj.imageName,
                senderAddress: imageHashObj.senderAddress,
                senderName: user.name, // Assuming the user model has a `name` field
                imageData: decryptedImgData.toString('base64'),
                timestamp: imageHashObj.timestamp
            });
        }

        res.status(200).json({
            message: "Images Retrieved Successfully",
            images: decryptedImageArr
        });

    } catch (error) {
        console.error("Error in getSharedImagesController:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports = { getSharedImagesController };
