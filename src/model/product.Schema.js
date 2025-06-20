const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const productSchema = mongoose.Schema({
  // step 1
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  productType: {
    type: String,
  },
  tax: {
    type: String,
  },
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  venderId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  ],
  hsnCode: {
    type: Number,
  },
  productApperence: {
    type: String,
  },
  
  shortDescription: {
    type: String,
  },

  // step 2
  stockQuantity: {
    type: Number,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  price: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  offerPrice: {
    type: Number,
  },
  numberOfPieces: {
    type: Number,
  },

  currency: {
    type: String,
  },
  description: {
    type: String,
  },

  // step 3
  productHeroImage: {
    type: String,
  },

  productGallery: {
    type: [String],
  },
  productVideo: {
    type: String,
  },

  // step 4 attributes
  productOtherDetails: [
    {
      key: { type: String },
      value: [{ type: String }],
    },
  ],
  productVariants: [
    {
      variantKey: { type: String },
      variantValue: { type: String },
      variantPrice: { type: Number },
      variantDiscountedPrice: { type: Number },
      variantImage: { type: String },
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: String,
  },
});

productSchema.plugin(timestamps);
module.exports = mongoose.model("Product", productSchema);
