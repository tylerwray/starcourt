const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  css: ["./style.css"],
  whitelist: ["html", "body", "__next"]
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ]
};
