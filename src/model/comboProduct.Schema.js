const mongoose = require('mongoose');
const timestamps = require("mongoose-timestamp");

const comboProductSchema = new mongoose.Schema(
  {
    // Step 1
    name: {
      type: String,
    },
    productId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    gtin: {
      type: Number,
    },
    productType: {
      type: String,
    },
    shortDescription: {
      type: String,
    },

    // step 2
    stockQuantity: {
      type: String,
    },
    pricing: {
      actualPrice: {
        type: Number,
      },
      offerPrice: {
        type: Number,
      },
      
    },
    weight: {
      itemWeight: {
        type: Number,
      },
      packageWeight: {
        type: Number,
      },
    },
    longDescription: {
      type: String,
    },
    productHeroImage: {
      type: String,
    },
    productGallery: {
      type: [String],
    },
    productVideo: {
      type: String,
    },
    status: {
      type: Boolean,
      default:true
    },
  },
);

comboProductSchema.plugin(timestamps);
module.exports = mongoose.model('ComboProduct', comboProductSchema);
