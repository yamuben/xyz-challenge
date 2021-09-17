import express from "express";
import UserXYZ from "./model/userModel";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./server/config.env" });
const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(
  "FLWPUBK-69142722eff64353e419fcf4af2cc702-X",
  "FLWSECK-cf5d6634b999c40a5af45c42e17310c9-X"
);

const cid = process.env.TWILIO_ACCOUNT_ID;
const auth = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(cid, auth);

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.json());
app.post("/api/register", async (req, res) => {
  const { name, phone, projectName, email } = req.body;
  if (!name || !phone || !projectName || !email) {
    res.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  } else {
    try {
      const newUser = await UserXYZ.create({
        name,
        phone,
        projectName,
        email,
      });

      const message = `Dear ${newUser.name},\nYour request has been submitted successfully,
         below is the link to pay your upfront amount of 10,000 RWF 
         https://192.185.10.10:3000/pay
         with the next form using MTN,`;
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_CONTACT,
        to: newUser.phone,
      });

      console.log(newUser);

      res.status(201).json({
        status: "sucess",
        data: newUser,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
  }
});

app.post("/api/pay", async (req, res) => {
  const { phone, amount } = req.body;
  if (!phone || !amount) {
    res.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  } else {
    try {
      // const user = await UserXYZ.findOne({ phone });
      const payload = {
        tx_ref: "MC-" + Date.now(), //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
        order_id: "USS_URG_" + Date.now(), //Unique ref for the mobilemoney transaction to be provided by the merchant
        amount: "10000",
        currency: "RWF",
        email: "olufemi@flw.com",
        phone_number: phone,
        fullname: "Irankunda Fabrice",
      };

      const response = await flw.MobileMoney.rwanda(payload);
      console.log(response);
      res.status(200).json({
        ...response,
      });
    } catch (err) {}
  }
});

export default app;
