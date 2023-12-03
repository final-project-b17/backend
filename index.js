const express = require("express"),
	cors = require("cors"),
	app = express(),
	port = process.env.PORT || 3000,
	router = require("./routers"),
	swaggerUi = require("swagger-ui-express"),
	documentation = require("./documentation/api.json"),
	bodyParser = require("body-parser");

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(documentation));
app.use("/api/v1", router);

app.get("*", (req, res) => {
	return res.status(404).json({
		error: "Endpoint is not registered!",
	});
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
