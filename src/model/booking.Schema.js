const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");
const bookingSchema = mongoose.Schema({
  totalAmount: {
    type: String,
  },
  status: {
    type: String,
    default: "orderPlaced",
    enum: ["orderPlaced",  "orderPacked", "outForDelivery", "completed", "cancelled"],
  },
  signature: {
    type: String,
  },
  modeOfPayment: {
    type: String,
    enum: ["COD", "Online"],
  },
  paymentId: {
    type: String,
  },
  product: [
    {
      productId: { type: String, ref: "Product" },
      quantity: { type: Number },
      totalPrice: { type: Number },
      
    },
  ],
   comboProduct: [
    {
      comboProductId: { type: String, ref: "ComboProduct" },
      quantity: { type: Number },
      totalPrice: { type: Number },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    landmark: { type: String },
    area: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
  },
});

bookingSchema.plugin(timestamps);
module.exports = mongoose.model("Booking", bookingSchema);
