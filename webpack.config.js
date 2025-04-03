module.exports = {
    entry: './js/main.js',
    output: {
        path: `${__dirname}/js/webpack`,
        filename: 'bundle.js'
    },
    // mode: 'development'
    mode: 'production'
}