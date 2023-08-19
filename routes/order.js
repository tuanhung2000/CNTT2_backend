const express = require("express");
const router = express.Router();
const {
    requestOrder,
    editOrder,
    deleteOrder,
    responseOrder,
    getAllOrder,
    getOwnedOrder
} = require("../controllers/order");

router.get("/all-orders", getAllOrder);

router.get("/", getOwnedOrder);

router.post("/requestOrder", requestOrder);

router.patch("/responseOrder", responseOrder);

router.patch("/updateOrder", editOrder);

router.delete("/deleteOrder", deleteOrder);

module.exports = router;
