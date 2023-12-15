const { paymentMethods } = require("../models");
const { ImageKit } = require("../utils");

module.exports = {
    createPaymentMethod: async (req, res) => {
      try {
        const fileToString = req.file.buffer.toString('base64');
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, ''); 
        const fileName = `logo_${formattedDate}`;

        const uploadFile = await ImageKit.upload({
            fileName: fileName,
            file: fileToString,
        });

        const newPayment = await paymentMethods.create({
          data: {
            name: req.body.name,
            logo: uploadFile.url
          }
        });

        res.json({
          success: true,
          data: newPayment
        })

      } catch (error) {
        console.error("Error retrieving payment method : ", error)
        res.status(500).json({
          success: false,
          error: "Internal Server Error"
        });
      }
    },

    getPaymentMethods: async (req, res) => {
        try {
            const readPayments= await paymentMethods.findMany();

            res.json({
                success: true,
                data: readPayments
            });
        } catch (error) {
            console.error("Error retrieving payment method : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    },

    getPaymentMethodId: async (req, res) => {
        try {
            const paymentMethodId = parseInt(req.params.id)
            const readPayment = await paymentMethods.findUnique({
                where: {
                    id: paymentMethodId
                },
                include: {
                    orders: true
                }
            });

            if (!readPayment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment method not found"
                });
            }

            res.json({
                success: true,
                data: readPayment
            });
        } catch (error) {
            console.error("Error retrieving payment method : ", error)
            res.status(500).json({
                success: false,
                error: "Internal Server Error"
            });
        }
    },

    updatePaymentMethodId: async (req, res) => {
      try {
        const paymentMethodId = parseInt(req.params.id);
    
        const readPaymentMethod = await paymentMethods.findUnique({
          where: {
            id: paymentMethodId,
          },
        });
    
        if (!readPaymentMethod) {
          return res.status(404).json({
            success: false,
            error: "Payment method not found",
          });
        }
    
        let updatedData = {};
    
        if (req.body.name) {
          updatedData.name = req.body.name;
        }
    
        if (req.file) {
          const fileToString = req.file.buffer.toString('base64');
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, ''); 
          const fileName = `logo_${formattedDate}`;

          const uploadFile = await ImageKit.upload({
              fileName: fileName,
              file: fileToString,
          });
    
          updatedData.logo = uploadFile.url;
        }
    
        if (Object.keys(updatedData).length === 0) {
          return res.json({
            success: true,
            message: "No changes provided for update.",
          });
        }
    
        const updatePaymentMethod = await paymentMethods.update({
          where: {
            id: paymentMethodId,
          },
          data: updatedData,
        });
    
        return res.json({
          success: true,
          data: updatePaymentMethod,
        });
      } catch (error) {
        console.error("Error updating payment method: ", error);
        res.status(500).json({
          success: false,
          error: "Internal Server Error",
        });
      }
    },    
      
    deletePaymentMethodId: async (req, res) => {
        try {
          const paymentMethodId = parseInt(req.params.id);
          const readPaymentMethod = await paymentMethods.findUnique({
            where: {
              id: paymentMethodId,
            },
          });
      
          if (!readPaymentMethod) {
            return res.status(404).json({
              success: false,
              error: "Payment method not found",
            });
          }
  
          await paymentMethods.delete({
            where: {
              id: paymentMethodId,
            },
          });
      
          res.json({
            success: true,
            message: "Payment method deleted successfully",
          });
        } catch (error) {
          console.error("Error deleting payment method : ", error);
          res.status(500).json({
            success: false,
            error: "Internal Server Error",
          });
        }
    }  
};