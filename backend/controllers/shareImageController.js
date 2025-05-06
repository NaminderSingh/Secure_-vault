
// const share = require("../models/shared")
// async function shareImageController(req, res) {

// console.log("sonebody called me ")

// };
// module.exports = { shareImageController };

const shared = require('../models/shared');
const userModel = require('../models/User');

async function shareImageController(req, res) {
  console.log("somebody called me");

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Extract data from request body
    const { senderAddress, receiverAddress, imageHash, name } = req.body;
    const address=receiverAddress.toLowerCase()
    // Validate required fields
    if (!senderAddress || !address || !imageHash || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    userAddress=senderAddress.toLowerCase()
    const user = await userModel.findOne({ userAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     if (!user.encryptionKey) {
          console.log("searching for users encryption key for sharing image")
          await user.save();
        }
        console.log(address, senderAddress)
    // Create a new File document
    const newshared = new shared({
      senderAddress,
      receiverAddress:address,
      imageHash,
      imageName: name, // Map 'name' to 'imageName' in the schema
      encryptionKey:user.encryptionKey,
      timestamp: new Date()
      // Note: encryptionKey is optional in the schema
    });

    // Save to database
    await newshared.save();

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Image shared successfully'
    });

  } catch (error) {
    console.error('Error in shareImage controller:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
}

module.exports = { shareImageController };