module.exports = {
    outputDir: '../server/public',
    devServer: {
        proxy: 'http://localhost:3000'
    }
}