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
					video_duration: videoDuration,
				},
			});

			res.status(200).json({
				success: true,
				data: {
					...newMaterial,
					duration_in_minutes: durationInMinutes,
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
			// Function to get video duration for each material
			const getMaterialsVideoDuration = async (materials) => {
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

				// Convert video duration to minutes
				const convertDurationToMinutes = (duration) => {
					const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

					const hours = (match[1] ? parseInt(match[1], 10) : 0) * 60;
					const minutes = match[2] ? parseInt(match[2], 10) : 0;
					const seconds = (match[3] ? parseInt(match[3], 10) : 0) / 60;

					const totalMinutes = hours + minutes + seconds;
					return totalMinutes;
				};

				const materialsWithDuration = await Promise.all(
					materials.map(async (material) => {
						if (material.url_video) {
							const videoDuration = await getVideoDuration(material.url_video);

							// Update the database with video duration
							await courseMaterials.update({
								where: { id: material.id },
								data: {
									video_duration: videoDuration,
									duration_in_minutes: videoDuration ? convertDurationToMinutes(videoDuration) : null,
								},
							});

							return {
								...material,
								video_duration: videoDuration,
								duration_in_minutes: videoDuration ? convertDurationToMinutes(videoDuration) : null,
							};
						} else {
							return material;
						}
					})
				);

				return materialsWithDuration;
			};

			// Retrieve materials from the database
			const materials = await courseMaterials.findMany();

			// Usage in listCourseMaterials function
			const materialsWithVideoDuration = await getMaterialsVideoDuration(materials);

			res.json({
				status: true,
				data: materialsWithVideoDuration,
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
			const material = await courseMaterials.findUnique({
				where: {
					id: materialsId,
				},
			});

			if (!material) {
				return res.status(404).json({
					success: false,
					message: "Course Material not found",
				});
			}

			// Function to get video duration
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

			// Convert video duration to minutes
			const convertDurationToMinutes = (duration) => {
				const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

				const hours = (match[1] ? parseInt(match[1], 10) : 0) * 60;
				const minutes = match[2] ? parseInt(match[2], 10) : 0;
				const seconds = (match[3] ? parseInt(match[3], 10) : 0) / 60;

				const totalMinutes = hours + minutes + seconds;
				return totalMinutes;
			};

			// Get video duration for the material
			const videoDuration = material.url_video ? await getVideoDuration(material.url_video) : null;

			// Include video duration in the material data
			const materialWithVideoDuration = {
				...material,
				video_duration: videoDuration,
				duration_in_minutes: videoDuration ? convertDurationToMinutes(videoDuration) : null,
			};

			res.json({
				success: true,
				data: materialWithVideoDuration,
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

			// Function to get video duration
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

			// Convert video duration to minutes
			const convertDurationToMinutes = (duration) => {
				const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

				const hours = (match[1] ? parseInt(match[1], 10) : 0) * 60;
				const minutes = match[2] ? parseInt(match[2], 10) : 0;
				const seconds = (match[3] ? parseInt(match[3], 10) : 0) / 60;

				const totalMinutes = hours + minutes + seconds;
				return totalMinutes;
			};

			// Get video duration for the updated material
			const videoDuration = url_video ? await getVideoDuration(url_video) : null;

			const updateData = {
				title,
				content,
				url_video,
				video_duration: videoDuration, // Update video duration in the database
			};

			const updateCourseMaterials = await courseMaterials.update({
				where: {
					id: materialsId,
				},
				data: updateData,
			});

			res.json({
				success: true,
				data: updateCourseMaterials,
				duration_in_minutes: videoDuration ? convertDurationToMinutes(videoDuration) : null,
			});
		} catch (error) {
			console.error("Error updating Course Material: ", error);
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
