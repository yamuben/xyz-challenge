import express from "express";
import UserXYZ from "./model/userModel";
import cors from "cors";

const client = require("twilio")(
  "ACfc6fa30781599ced396020b52e7496c4",
  "2c41c5ceb364fe71aa6d7d002b889f4b"
);

const app = express();

app.use(express.json());
app.use(cors());
app.post("/api/register", async (req, res) => {
  console.log(req.body);
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
      const url = "http:localhost:5050/pay";
      const message = `Dear ${newUser.name},\nYour request has been submitted successfully,
         below is the link to pay your upfront amount of 10,000 RWF 
         https://192.185.10.10:3000/pay
         with the next form using MTN,`;
      // await client.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_CONTACT,
      //   to: newUser.phone,
      // });

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

app.post("/pay", async (req, res) => {
  const { phone, amount } = req.body;

  if (!phone || !amount) {
    res.status(400).json({
      status: "fail",
      message: "No data provided",
    });
  } else {
  }
});

export default app;
