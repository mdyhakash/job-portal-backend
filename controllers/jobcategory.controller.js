import JobCategory from "../models/jobcategory.model.js";


export const getAllCategories = async (req, res) => {
  const categories = await JobCategory.find().sort({ name: 1 });
  res.status(200).json({
    message: "Categories fetched successfully",
    success: true,
    categories,
  });
};
