const {  comments } = require("../models/index");

module.exports = {
    createComment: async (req, res) => {
        try {
            const { user_id, course_id, content } = req.body;

            const newComment = await comments.create({
                data : {
                    user_id, 
                    course_id,
                    content
                }
            });

            res.json({
                success: true,
                data: newComment
            });
        } catch (error) {
            console.error("Error creating comment : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    },

  getComments: async (req, res) => {
    try {
      const commentList = await comments.findMany();

      res.json({
        success: true,
        data: commentList,
      });
    } catch (error) {
      console.error("Error retrieving comments : ", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  },

  getCommentById: async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await comments.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
            users: true, 
            courses: true,
        },
      });
      res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      console.error("Error retrieving comment : ", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  },

  updateComment: async (req, res) => {
    const { id } = req.params;
    try {
      
      const { content } = req.body;
      const updatedComment = await comments.update({
        where: {
          id: parseInt(id),
        },
        data: {
          content: content,
        },
      });
      res.json({
        success: true,
        data: updatedComment,
      });
    } catch (error) {
      console.error("Error updating comment : ", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params;
    try {
      
      await comments.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment : ", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  },
};