const axios = require("axios");
const { courseMaterials } = require("../models");

require("dotenv").config();

module.exports = {
	// Add new courses materials
	createCourseMaterials: async (req, res) => {
		try {
			const { chapter_id, course_id, title, content, url_video } = req.body;

			// Function to get video duration from YouTube API
			const getVideoDuration = async (videoUrl) => {
				const videoIdMatch = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
				const videoId = videoIdMatch ? videoIdMatch[1] : null;

				if (!videoId) {
					console.error("Error: Invalid YouTube video URL");
					return null;
				}

				const apiKey = process.env.YOUTUBE_API_KEY;
				const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;

				try {
					const response = await axios.get(apiUrl);

					if (response.data.items && response.data.items[0] && response.data.items[0].contentDetails) {
						const duration = response.data.items[0].contentDetails.duration;
						return duration;
					} else {
						console.error("Error: Invalid response format from YouTube API");
						return null;
					}
				} catch (error) {
					console.error("Error getting video duration from YouTube API:", error);
					return null;
				}
			};

			// Usage in createCourseMaterials function
			const videoDuration = await getVideoDuration(url_video);

			// Function to convert YouTube video duration to minutes
			const convertDurationToMinutes = (duration) => {
				const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

				const hours = (match[1] ? parseInt(match[1], 10) : 0) * 60;
				const minutes = match[2] ? parseInt(match[2], 10) : 0;
				const seconds = (match[3] ? parseInt(match[3], 10) : 0) / 60;

				const totalMinutes = hours + minutes + seconds;
				return totalMinutes;
			};

			// Convert video duration to minutes
			const durationInMinutes = videoDuration ? convertDurationToMinutes(videoDuration) : null;

			// Create new material with video duration
			const newMaterial = await courseMaterials.create({
				data: {
					chapter_id,
					course_id,
					title,
					content,
					url_video,
					video_duration: videoDuration, // Add video duration to the database
				},
			});

			res.status(200).json({
				success: true,
				data: {
					...newMaterial,
					duration_in_minutes: durationInMinutes, // Add duration in minutes to the response
				},
			});
		} catch (error) {
			console.error("Error creating Course Material: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Display all courses materials
	listCourseMaterials: async (req, res) => {
		try {
			const materials = await courseMaterials.findMany();

			res.json({
				status: true,
				data: materials,
			});
		} catch (error) {
			console.error("Error retrieving Course Material:", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// List courses by id-courses
	listCourseMaterialsId: async (req, res) => {
		try {
			const materialsId = parseInt(req.params.id);
			const materials = await courseMaterials.findUnique({
				where: {
					id: materialsId,
				},
				include: {
					chapters: true,
					courses: true,
					userProgress: true,
				},
			});

			if (!materials) {
				return res.status(404).json({
					success: false,
					message: "Course Material not found",
				});
			}

			res.json({
				success: true,
				data: materials,
			});
		} catch (error) {
			console.error("Error retrieving Course Material: ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Update materials by id
	updateCourseMaterialsId: async (req, res) => {
		try {
			const materialsId = parseInt(req.params.id);
			const { title, content, url_video } = req.body;
			const updateCourseMaterials = await courseMaterials.update({
				where: {
					id: materialsId,
				},
				data: {
					title,
					content,
					url_video,
				},
			});

			res.json({
				success: true,
				data: updateCourseMaterials,
			});
		} catch (error) {
			console.error("Error updating Course Material : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Delete material by id
	deleteCourseMaterialsId: async (req, res) => {
		try {
			const materialsId = parseInt(req.params.id);
			await courseMaterials.delete({
				where: {
					id: materialsId,
				},
			});

			res.json({
				success: true,
				message: "Course Materials deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting Course Materials : ", error);
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},
};
