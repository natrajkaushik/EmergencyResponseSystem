var path = require("path");

var Config = {
	DATABASE_URL: "mongodb://localhost/ems",
	MODELS_PATH: "/models",

	ROOT_PATH: path.normalize(__dirname + "/.."),
	PORT: 7800
};

module.exports = Config;