import express from "express";
import UserXYZ from "./model/userModel";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors({ origin: "*" }));

dotenv.config({ path: "./server/config.env" });
const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(
  "FLWPUBK-69142722eff64353e419fcf4af2cc702-X",
  "FLWSECK-cf5d6634b999c40a5af45c42e17310c9-X"
);

const cid = process.env.TWILIO_ACCOUNT_ID;
const auth = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(cid, auth);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/api/register", async (req, res) => {
  let { name, phone, projectName, email } = req.body;
  if (!name || !phone || !projectName || !email) {
    res.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  } else {
    phone = phone.length > 10 ? phone : "+25" + phone;
    try {
      const newUser = await UserXYZ.create({
        name,
        phone,
        projectName,
        email,
      });

      const message = `Dear ${newUser.name},\nYour request has been submitted successfully, below is the link to pay your upfront amount of 100 RWF https://you-pay.netlify.app/pay using MTN momo`;
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_CONTACT,
        to: newUser.phone,
      });

      res.status(201).json({
        status: "sucess",
        data: phone,
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
  }
});

app.post("/api/pay", async (req, res) => {
  let { phone, amount } = req.body;
  if (!phone || !amount) {
    res.status(200).json({
      status: "fail",
      message: "No data provided",
    });
  } else {
    const searchPhone = phone.length > 10 ? phone : "+25" + phone;
    phone = phone.length > 10 ? phone.slice(3) : phone;
    try {
      const user = await UserXYZ.findOne({ phone: searchPhone });

      if (!user) {
        res.status(200).json({
          status: "fail",
          message: "Unsubscribed user, Please register first",
        });
      } else {
        const payload = {
          tx_ref: "MC-" + Date.now(), //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
          order_id: "USS_URG_" + Date.now(), //Unique ref for the mobilemoney transaction to be provided by the merchant
          amount: "100",
          currency: "RWF",
          email: "olufemi@flw.com",
          phone_number: phone,
          fullname: "Irankunda Fabrice",
          redirect_url: "https://you-pay.netlify.app/",
        };

        const response = await flw.MobileMoney.rwanda(payload);
        res.status(200).json({
          ...response,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: "Try again later",
      });
    }
  }
});

export default app;
