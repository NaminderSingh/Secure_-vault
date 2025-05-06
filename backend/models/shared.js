const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  senderAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  imageHash: { type: String, required: true },
  imageName: { type: String, required: true },
  encryptionKey: { type: String }, // Store the encryption key
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
