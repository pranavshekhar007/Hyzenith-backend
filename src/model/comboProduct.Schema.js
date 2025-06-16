const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const comboProductSchema = new mongoose.Schema({
 
  name: {
    type: String,
  },
  productList: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
    },
  ],
  gtin: {
    type: Number,
  },
 
  stockQuantity: {
    type: String,
  },
  price: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  comboPrice: {
    type: Number,
  },
  description: {
    type: String,
  },
  productHeroImage: {
    type: String,
  },
  productGallery: {
    type: [String],
  }, 
  status: {
    type: Boolean,
    default: true,
  },
});

comboProductSchema.plugin(timestamps);
module.exports = mongoose.model("ComboProduct", comboProductSchema);
