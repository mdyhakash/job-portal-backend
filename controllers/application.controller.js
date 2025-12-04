import Job from "../models/job.model.js";
import Application from "../models/applications.model.js";


export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id: jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }
    //check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    // check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();
    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      newApplication,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .populate({
        path: "job",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      })
      .sort({ createdAt: -1 });

    if (!applications) {
      return res.status(404).json({
        message: "No applications found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Applied jobs fetched successfully",
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//admin will see who applied to their job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        options: { sort: { createdAt: -1 } },
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Applicants fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update status of application
export const updateState = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }
    const application = await Application.findOne({_id: applicationId});
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }
    //update the status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "Application status updated successfully",
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
