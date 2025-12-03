import mongoose from "mongoose";

const applicationsSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "under review", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationsSchema);

export default Application;
