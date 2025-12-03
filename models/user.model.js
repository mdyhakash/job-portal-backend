import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["applicant", "recruiter"],
      required: true,
    },

    profile: {
      bio: { type: String },

      photo: {
        type: String, // URL of photo
        default: "",
      },

      skills: {
        type: [String], // array of strings
      },

      resume: {
        type: String, // URL of resume
      },

      resumeOriginalName: {
        type: String,
      },

      experience: {
        type: Number,
      },

      education: {
        type: String,
      },

      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
