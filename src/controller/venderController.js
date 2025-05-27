const express = require("express");
const { sendResponse, generateOTP } = require("../utils/common");
require("dotenv").config();
const Vender = require("../model/vender.Schema");
const Product = require("../model/product.Schema");
const Booking = require("../model/booking.Schema");
const venderController = express.Router();
const axios = require("axios");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const { sendNotification } = require("../utils/sendNotification");
const auth = require("../utils/auth");

venderController.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await Vender.findOne({ phone, password });
    if (user) {
      return sendResponse(res, 200, "Success", {
        message: "Vender logged in successfully",
        data: user,
        statusCode: 200,
      });
    } else {
      return sendResponse(res, 422, "Failed", {
        message: "Invalid Credentials",
        statusCode: 422,
      });
    }
  } catch (error) {
    return sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error.",
      statusCode: 500,
    });
  }
});



venderController.get("/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const vender = await Vender.findOne({ _id: id });
    if (vender) {
      return sendResponse(res, 200, "Success", {
        message: "Vender details fetched  successfully",
        data: vender,
        statusCode: 200,
      });
    } else {
      return sendResponse(res, 404, "Failed", {
        message: "Vender not found",
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

venderController.put(
  "/update",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const id = req.body.id;
      const venderData = await Vender.findById(id);
      if (!venderData) {
        return sendResponse(res, 404, "Failed", {
          message: "Vender not found",
        });
      }

      let updateData = { ...req.body };

      if (req.file || req.files) {
      
        if (req.files["profilePic"]) {
          const image = await cloudinary.uploader.upload(
            req.files["profilePic"][0].path
          );
          updateData = { ...updateData, profilePic: image.url };
        }
      }

      const updatedUserData = await Vender.findByIdAndUpdate(id, updateData, {
        new: true,
      });
     
      sendResponse(res, 200, "Success", {
        message: "Vendor updated successfully!",
        data: updatedUserData,
        statusCode: 200,
      });
    } catch (error) {
      console.error(error);
      sendResponse(res, 500, "Failed", {
        message: error.message || "Internal server error.",
      });
    }
  }
);

venderController.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const vender = await Vender.findById(id);
    if (!vender) {
      return sendResponse(res, 404, "Failed", {
        message: "Vender not found",
        statusCode:400
      });
    }
    await Vender.findByIdAndDelete(id);
    sendResponse(res, 200, "Success", {
      message: "Vender deleted successfully!",
      statusCode:200
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed", {
      message: error.message || "Internal server error",
    });
  }
});



venderController.post("/list", async (req, res) => {
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
    if (searchKey) {
      query.$or = [
        { firstName: { $regex: searchKey, $options: "i" } },
        { lastName: { $regex: searchKey, $options: "i" } },
        { email: { $regex: searchKey, $options: "i" } },
      ];
    }

    // Construct sorting object
    const sortField = sortByField || "createdAt";
    const sortOrder = sortByOrder === "asc" ? 1 : -1;
    const sortOption = { [sortField]: sortOrder };

    // Fetch the category list
    const venderList = await Vender.find(query)
      .sort(sortOption)
      .limit(parseInt(pageCount))
      .skip(parseInt(pageNo - 1) * parseInt(pageCount))
      
    const totalCount = await Vender.countDocuments({});
    const activeCount = await Vender.countDocuments({ status: true });
    sendResponse(res, 200, "Success", {
      message: "Vender list retrieved successfully!",
      data: venderList,
      documentCount: {
        totalCount,
        activeCount,
        inactiveCount: totalCount - activeCount,
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

venderController.post("/create", async (req, res) => {
  try {
    const VendorData = await Vender.create(req.body);
    sendResponse(res, 200, "Success", {
      message: "Vendor created successfully!",
      data: VendorData,
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


module.exports = venderController;
