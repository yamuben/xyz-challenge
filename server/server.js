import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./index";

dotenv.config({ path: "./server/config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected successfully!"));

const port = process.env.PORT || 9090;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
