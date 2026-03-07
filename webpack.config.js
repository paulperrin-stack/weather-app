const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",

    entry: "./src/index.js",

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },

    devServer: {
        static: "./dist",
        port: 3000,
        open: true,
        hot: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", // uses your HTML as the base
        }),
        new webpack.DefinePlugin({
            "process.env.WEATHER_API_KEY": JSON.stringify(process.env.WEATHER_API_KEY)
        })
    ],

    module: {
        rules: [
            // CSS support
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            // Image support (no extra loader needed in Webpack 5)
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            // Fonts support
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
        ],
    },
};