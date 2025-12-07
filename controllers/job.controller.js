import e from "express";
import Job from "../models/job.model.js";
import JobCategory from "../models/jobcategory.model.js";
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salary,
      jobType,
      experience,
      position,
      companyId,
      category,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !location ||
      !salary ||
      !jobType ||
      !experience ||
      !position ||
      !companyId ||
      !category
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    let jobCategory = await JobCategory.findOne({ name: category });
    if (!jobCategory) {
      jobCategory = await JobCategory.create({ name: category });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      location,
      salaryRange: salary,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
      category: jobCategory._id,
    });
    const jobpopulate = await job.populate([
      { path: "company" },
      { path: "category" },
    ]);
    return res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job: jobpopulate,
    });
  } catch (error) {
    res.status(500).json({ error: `${error.message}` });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        { jobType: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .populate("category")
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "No jobs found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//applicant
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate("company")
      .populate("category");
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Job fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .populate("category")
      .populate("created_by");

    if (!jobs) {
      return res.status(404).json({
        message: "No jobs found for this admin",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Jobs fetched successfully",
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
