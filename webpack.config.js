const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, "out"),
		filename: "main.js"
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: "src/main.css"
			}
		]),
		new HtmlWebpackPlugin({
			title: "BoidsWallpaper",
			template: "src/template.html"
		})
	]
};
