import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
      maxlength: [50, "Name must contain atmost only 50 characters!."],
      trim: true,
    },
    projectName: {
      type: String,
      required: [true, "Please tell us your name!"],
      maxlength: [
        1000,
        "Description must contain atmost only 1000 characters!.",
      ],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Please provide your phone number"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserXYZ = mongoose.model("UserXYZ", userSchema);

export default UserXYZ;
