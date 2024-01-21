const { Users, Followers } = require("../models");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { verifyToken } = require("../middleware/Verify");

const sendMail = async (email, token) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.GOOGLE_SECRET}`,
      },
    });

    const mailOptions = {
      from: `BEATSBYALIF <${process.env.EMAIL}`,
      to: email,
      subject: "Complete your registration",
      html: `<html>
                        <h1>Verify your email address</h1>
                        <p>Please use the following link to complete your registration:</p>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                        <p>Link expires in 10 minutes</p>
                  </html>`,
      text: `To complete registration, click  this link ${process.env.CLIENT_URL}/auth/activate/${token}`,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  const found = await Users.findOne({ where: { email: email } });
  const foundUser = await Users.findOne({ where: { username: username } });
  if (found != null) {
    res.json([{ path: "email", status: "email already exists" }]);
    return;
  }
  if (foundUser != null) {
    res.json([{ path: "username", status: "username already exists" }]);
    return;
  }

  try {
    const token = jwt.sign(
      { username, password, email },
      `${process.env.SECRET_TOKEN}`,
      {
        expiresIn: "10m",
      }
    );
    sendMail(email, token)
      .then((sent) => {
        console.log(sent);
        res.json({
          token: token,
          status: "VALID",
          message: `Click the link sent to ${email} to verify your account.`,
        });
      })
      .catch((x) => {
        console.log(x);
      });
  } catch (error) {
    res.json({
      error,
      status: "ERROR",
    });
  }
};

exports.createAccount = async (req, res) => {
  const { token } = req.params;

  jwt.verify(token, `${process.env.SECRET_TOKEN}`, async (err, check) => {
    if (err) {
      res.json({ status: "TOKEN_EXPIRED" });
      return;
    }
    const user = await Users.findOne({ where: { email: check.email } });
    if (user) {
      res.json({ status: "TOKEN_EXPIRED" });
      return;
    } else {
      bcrypt.hash(check.password, 10).then((hash) => {
        try {
          Users.create({
            username: check.username,
            hashed_password: hash,
            email: check.email,
          });
          res.json({ status: "VALID" });
        } catch (error) {
          res.json({ status: "FAILED" });
        }
      });
    }
  });
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ where: { email: check.email } });
  if (user == null) {
    res.json({ status: "NOT_FOUND" });
    return;
  }
};

exports.followers = async (req, res) => {
  const old = await Followers.findAll({});

  res.json(old);
};

exports.newFollower = async (req, res) => {
  const { username, id } = req.user;
  console.log("hi");
  const find = await Followers.findOne({ where: { UserId: id } });
  if (find) {
    await Followers.destroy({ where: { UserId: id } });
    res.json({ status: "UNFOLLOWED" });
    return;
  }

  const newFollower = await Followers.create({
    UserId: id,
    username: username,
  });
  res.json({ status: "FOLLOWED" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const person = await Users.findOne({ where: { email: email } });
  if (person == null) {
    res.json({ status: "ERROR", message: "Email account not found" });
    return;
  }
  const { hashed_password, id, role, username } = person;
  const match = await bcrypt.compare(password, hashed_password);
  if (!match) {
    res.json({
      status: "ERROR",
      message: "Invalid password/email credentials",
    });
    return;
  } else {
    jwt.sign(
      { id: id, username: username, role: role, email, hashed_password },
      `${process.env.SECRET_TOKEN}`,
      { expiresIn: "1d" },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.json({
            user: { id, role, username, email },
            token: data,
            status: "VALID",
            message: "Logging in..",
          });
        }
      }
    );
  }
};

exports.authenticate = async (req, res) => {
  res.json(req.user);
};
