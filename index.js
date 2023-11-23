require("dotenv").config();

const express = require("express"),
	cors = require("cors"),
	app = express(),
	port = process.env.PORT || 3000,
	router = require("./routers"),
	bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
