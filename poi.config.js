const path = require("path");
const webpack = require("webpack");

const API_ENDPOINT = "https://app.cwbookreport.com/api"
const PROXY_TARGET = process.env.API || API_ENDPOINT

try {
    const chalk = require("chalk");
    console.log(chalk.blue.bold(`Proxy /api to ${PROXY_TARGET}`))
} catch (importError) {
    console.log("Proxy /api to " + PROXY_TARGET)
}

module.exports = {
    port: 8000,
    entry: "./src/javascript/index.js",
    dist: "dist",
    html: false,
    filename: {
        js: "js/[name].js",
        css: "css/[name].css",
        images: "images/[name].[ext]",
        fonts: "fonts/[name].[ext]",
        chunk: "js/[id].chunk.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        proxy: {
            "/api": {
                target: PROXY_TARGET,
                pathRewrite: {"^/api" : ""},
                changeOrigin: true
            }
        }
    },
    webpack(config) {
        // SourceMaps config
        config.output.sourceMapFilename = "[file].map"
        // Import in js
        config.resolve.modules = ["node_modules", "src/javascript", "src/stylus"];
        config.plugins.push(new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery'
        }))

        return config
    },
    babel: {
        cacheDirectory: true,
        babelrc: true
    }
};