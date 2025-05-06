const shared = require('../models/shared');

async function numberOfImagesController(req, res) {
    try {
        const receiverAddress = req.address?.toLowerCase();

        if (!receiverAddress) {
            return res.status(400).json({
                success: false,
                message: 'Receiver address is required'
            });
        }

        // Count the number of shared images for this receiver
        const imageCount = await shared.countDocuments({ senderAddress:receiverAddress });

        return res.status(200).json({
            success: true,
            message: "Image count retrieved successfully",
            count: imageCount
        });

    } catch (error) {
        console.error("Error in numberOfImagesController:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports = { numberOfImagesController };
