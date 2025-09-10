module.exports = {
  entry: './js/main.js',
  output: {
    path: `${__dirname}/js/webpack`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      // CSS Loader für Swiper & andere CSS-Dateien
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // Hier könnten noch andere Loader stehen (z. B. Babel für JS)
    ],
  },
  mode: 'development', // Oder 'development' für lokale Entwicklung
};
