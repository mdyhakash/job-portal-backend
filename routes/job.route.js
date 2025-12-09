import express from "express";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
} from "../controllers/job.controller.js";
import isAuthenticated from "./../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getAdminJobs").get(isAuthenticated, getAdminJobs);
router.route("/:id").get(isAuthenticated, getJobById);

export default router;
