const express = require("express");
const { sendResponse } = require("../utils/common");
require("dotenv").config();
const Booking = require("../model/booking.Schema");
const bookingController = express.Router();
require("dotenv").config();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const auth = require("../utils/auth");
const fs = require("fs");
const path = require("path");

bookingController.post("/create", async (req, res) => {
  try {
    const {
      userId,
      totalAmount,
      product,
      modeOfPayment,
      paymentId,
      signature,
      address,
      comboProduct,
    } = req.body;

    // Validate required fields
    if (!userId) {
      return sendResponse(res, 400, "Failed", {
        message: "userId is required in the request body",
        statusCode: 400,
      });
    }

    const bookingData = {
      totalAmount,
      signature,
      modeOfPayment,
      paymentId,
      product,
      userId,
      address,
      comboProduct,
    };

    const bookingCreated = await Booking.create(bookingData);

    sendResponse(res, 200, "Success", {
      message: "Booking created successfully!",
      data: bookingCreated,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
      statusCode: 500,
    });
  }
});

bookingController.post("/list", async (req, res) => {
  try {
    const {
      searchKey = "",
      status,
      pageNo = 1,
      pageCount = 10,
      sortByField,
      sortByOrder,
    } = req.body;

    const query = {};
    if (status) query.status = status;
    if (searchKey) query.status = { $regex: searchKey, $options: "i" };

    // Construct sorting object
    const sortField = sortByField || "createdAt";
    const sortOrder = sortByOrder === "asc" ? 1 : -1;
    const sortOption = { [sortField]: sortOrder };

    // Fetch the booking list
    const bookingList = await Booking.find(query)
      .populate("userId", "firstName lastName")
      // .populate("addressId")
      .sort(sortOption)
      .limit(parseInt(pageCount))
      .skip(parseInt(pageNo - 1) * parseInt(pageCount))
      .populate({
        path: "product.productId",
        select: "name description productHeroImage",
      })
      .populate({
        path: "comboProduct.comboProductId",
        select: "name description productHeroImage",
      });

    const totalCount = await Booking.countDocuments(query);

    const statusCounts = await Booking.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Map status counts
    const statusCountMap = {
      orderPlaced: 0,
      orderPacked: 0,
      outForDelivery: 0,
      completed: 0,
      cancelled: 0,
    };

    statusCounts.forEach(({ _id, count }) => {
      statusCountMap[_id] = count;
    });

    // 📌 Date calculations
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // 📌 Counts based on createdAt date
    const todaysOrder = await Booking.countDocuments({
      ...query,
      createdAt: { $gte: todayStart },
    });

    const thisWeekOrder = await Booking.countDocuments({
      ...query,
      createdAt: { $gte: weekStart },
    });

    const thisMonthOrder = await Booking.countDocuments({
      ...query,
      createdAt: { $gte: monthStart },
    });

    sendResponse(res, 200, "Success", {
      message: "Booking list retrieved successfully!",
      data: bookingList,
      documentCount: {
        totalCount,
        ...statusCountMap,
        todaysOrder,
        thisWeekOrder,
        thisMonthOrder,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});

bookingController.get("/my-booking/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const booking = await Booking.find({ userId: userId })
      .populate("product.productId")
      .populate("userId");

    if (booking.length > 0) {
      return sendResponse(res, 200, "Success", {
        message: "Booking details fetched successfully",
        data: booking,
        statusCode: 200,
      });
    } else {
      return sendResponse(res, 404, "Failed", {
        message: "No bookings found for this user",
        statusCode: 404,
      });
    }
  } catch (error) {
    return sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error.",
      statusCode: 500,
    });
  }
});

bookingController.get("/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({ _id: id })
      .populate("userId", "firstName lastName email phone")
      .populate("product.productId");

    if (booking) {
      return sendResponse(res, 200, "Success", {
        message: "Booking details fetched successfully",
        data: booking,
        statusCode: 200,
      });
    } else {
      return sendResponse(res, 404, "Failed", {
        message: "No bookings found",
        statusCode: 404,
      });
    }
  } catch (error) {
    return sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error.",
      statusCode: 500,
    });
  }
});



module.exports = bookingController;
