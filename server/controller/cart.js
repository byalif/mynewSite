const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { verifyToken } = require("../middleware/Verify");
const { Track, Tags, Likes, Cart, Transactions } = require("../models");
const jwt = require("jsonwebtoken");

const sendMail = async (email, sesh) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.GOOGLE_SECRET}`,
      },
    });

    const mailOptions = {
      from: `BEATSBYALIF <${process.env.EMAIL}>`,
      to: email,
      subject: `Transaction #${sesh}`,
      html: `<html>
                        <h1>Thank you for your purchase!</h1>
                        <p>The tracks you have purchased are available on the purchased tab when you sign in!</p>
                        <p>If you have any questions, email me at beatsbyalif@gmail.com</p>
                        <p>Best, alif</p>
                  </html>`,
      text: `The tracks you have purchased are available on the purchased tab when you sign in!`,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

exports.getItems = async (req, res) => {
  const { id } = req.params;
  const Items = await Cart.findAll(
    { where: { UserId: id } },
    { include: [Likes] }
  );
  res.json(Items);
};

exports.addItems = async (req, res) => {
  const { title, img, TrackId, UserId, type, price, MP3, WAV, trackouts } =
    req.body;
  const exists = await Cart.findOne({
    where: { TrackId: TrackId, UserId: UserId },
  });
  if (exists != null) {
    await Cart.update(
      { type: type, price: price },
      { where: { TrackId, UserId } }
    );
    res.json({ Status: "CART_UPDATED" });
    return;
  } else {
    Cart.create({
      title,
      img,
      TrackId,
      UserId,
      type,
      price,
      MP3,
      WAV,
      trackouts,
    });
    res.json({ Status: "Added_to_Cart" });
  }
};

exports.checkout = async (req, res) => {
  const { id, username, email } = req.user;
  const allItems = await Cart.findAll({ where: { UserId: id } });
  const sesh = new Date().getTime();
  await Transactions.create({ session: sesh });

  const storeItems = allItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.title} (${item.type})`,
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: storeItems,
      success_url: `${process.env.CLIENT_URL}/cart/success/${sesh}`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    res.json({ storeItems, url: session.url });
  } catch (error) {
    res.json({ storeItems });
    console.log(error);
  }
};

exports.transaction = async (req, res) => {
  const { sesh } = req.params;
  const { id } = req.user;
  const allItems = await Cart.findAll({ where: { UserId: id } });
  res.json(sesh, allItems);
};

exports.checkSesh = async (req, res) => {
  const { id, email } = req.user;
  const { sesh } = req.params;
  const exists = await Transactions.findOne({ where: { session: sesh } });
  if (!exists) {
    res.json({ status: "INVALID" });
    return;
  }

  await Transactions.destroy({ where: { session: sesh } });

  const cart = await Cart.findAll({ where: { UserId: id } });
  const promises = [];

  cart.forEach((x) => {
    let wav = null;
    let mp3 = null;
    let trackouts = null;
    if (x.price === 25) {
      mp3 = x.MP3;
    } else if (x.price === 45) {
      mp3 = x.MP3;
      wav = x.WAV;
    } else {
      mp3 = x.MP3;
      wav = x.WAV;
      trackouts = x.trackouts;
    }
    promises.push(
      Transactions.create({
        session: sesh,
        title: x.title,
        img: x.img,
        TrackId: x.TrackId,
        UserId: x.UserId,
        type: x.type,
        price: x.price,
        MP3: mp3,
        WAV: wav,
        trackouts: trackouts,
      })
    );
  });

  Promise.all(promises).then(async () => {
    await Cart.destroy({ where: { UserId: id } });
    sendMail(email, sesh)
      .then((sent) => {
        console.log(sent);
        res.json({ status: "SUCCESS" });
      })
      .catch((x) => {
        console.log(x);
      });
    res.json({ status: "VALID" });
  });
};

exports.allPurchases = async (req, res) => {
  const { id } = req.user;
  const purchases = await Transactions.findAll({ where: { UserId: id } });
  res.json(purchases);
};

exports.deleteItems = async (req, res) => {
  const { cartId } = req.params;
  const { id } = req.user;
  await Cart.destroy({ where: { UserId: id, id: cartId } });
  res.json({ status: "DELETED" });
};
