const express = require("express");
const { verifyToken } = require("../middleware/Verify.js");
const router = express.Router();
const {
  getItems,
  addItems,
  checkout,
  checkSesh,
  transaction,
  deleteItems,
  allPurchases,
} = require("../controller/cart.js");

router.get("/getItems/:id", getItems);
router.post("/addItems", addItems);
router.delete("/deleteItems/:cartId", verifyToken, deleteItems);
router.get("/checkout", verifyToken, checkout);
router.get("/purchases", verifyToken, allPurchases);
router.post("/success/:sesh", transaction);
router.get("/check/:sesh", verifyToken, checkSesh);

module.exports = router;
