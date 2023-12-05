const { categories } = require("../models"),
	utils = require("../utils");
require("dotenv").config();

module.exports = {
	// Add category
	createCategory: async (req, res) => {
		try {
			const data = await categories.create({
				data: {
					title: req.body.title,
				},
			});

			res.status(200).json({
				success: true,
				message: "Created!",
				categories: data,
			});
      
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Display list category
	listCategories: async (req, res) => {
		try {
			const listCategory = await categories.findMany();

			res.json({
				success: true,
				data: listCategory,
			});
		} catch (error) {
			console.error("Error retrieving Category:", error);
			res.status(500).json({
			  success: false,
			  error: "Internal Server Error",
			});
		}
	},

	// Display list category id
	listCategoriesId: async (req, res) => {
		try {
		  const listCategoryId = parseInt(req.params.id);
		  const listCategory = await categories.findUnique({
			where: {
			  id: listCategoryId,
			},
			include: {
				courses: true,
			},
		  });
	
		  if (!listCategory) {
			return res.status(404).json({
			  success: false,
			  message: "Category not found",
			});
		  }
	
		  res.json({
			success: true,
			data: listCategory,
		  });
		} catch (error) {
		  console.error("Error retrieving Category: ", error);
		  res.status(500).json({
			success: false,
			error: "Internal Server Error",
		  });
		}
	  },

	// Edit category by id
    updateCategory: async (req, res) => {
		try {
		  const categoryId = parseInt(req.params.id);
		  const updateCategory = await categories.update({
			where: {
			  id: categoryId,
			},
			data: {
				title: req.body.title,
			},
		  });
	
		  res.json({
			success: true,
			data: updateCategory,
		  });
		} catch (error) {
		  console.log(error);
		  res.status(500).json({
			success: false,
			error: "Internal Server Error",
		  });
		}
	  },
  
	// Delete Category
	deleteCategory: async (req, res) => {
		try {
		  const categoryId = parseInt(req.params.id);
		  await categories.delete({
			where: {
			  id: categoryId,
			},
		  });
	
		  res.json({
			success: true,
			message: "Category deleted successfully",
		  });
		} catch (error) {
		  console.log(error);
		  res.status(500).json({
			success: false,
			error: "Internal Server Error",
		  });
		}
	  },
};
