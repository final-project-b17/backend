const { Chapter } = require("../models");

module.exports = {
    createChapter: async (req, res) => {
        try {
            const { title, course_id, content } = req.body;

            const newChapter = await Chapter.create({
                data : {
                    title, 
                    course_id,
                    content
                }
            });

            res.json({
                success: true,
                data: newChapter
            });
        } catch (error) {
            console.error("Error creating chapter : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    },
  
    getChapters: async (req, res) => {
        try {
            const chapters = await Chapter.findMany();

            res.json({
                success: true,
                data: chapters
            });
        } catch (error) {
            console.error("Error retrieving chapters : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
},

    getChapterId: async (req, res) => {
        try {
            const chapterId = parseInt(req.params.id);
            const chapter = await Chapter.findUnique({
                where: {
                    id: chapterId,
                },
                include: {
                    Course: true,
                    materials: true,
                    userProgress: true,
                },
            });

            if (!chapter) {
                return res.status(404).json({
                    success: false,
                    message: "Chapter not found",
                });
            }

            res.json({
                success: true,
                data: chapter,
            });
        } catch (error) {
            console.error("Error retrieving chapter : ", error);
            res.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    },

    updateChapterId: async (req, res) => {
        try {
            const chapterId = parseInt(req.params.id)
            const { title, content } = req.body
            const updateChapter = await Chapter.update({
                where: {
                    id: chapterId
                },
                data: {
                    title, 
                    content
                }
            });

            res.json({
                success: true,
                data: updateChapter
            });
        } catch (error) {
            console.error("Error updating chapter : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    },

    deleteChapterId: async (req, res) => {
        try {
            const chapterId = parseInt(req.params.id)
            await Chapter.delete({
                where: {
                    id: chapterId
                }
            });

            res.json({
                success: true,
                message: "Chapter deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting chapter : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    }
};