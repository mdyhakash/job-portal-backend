import express from "express";

import { getAllCategories } from "../controllers/jobcategory.controller.js";
const router = express.Router();

router.route("/getCategories").get(getAllCategories);

export default router;
