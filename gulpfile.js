const { src, dest, parallel } = require("gulp");
const svgSprite = require("gulp-svg-sprite");

// Basic configuration example
const svgspriteConfig = {
  mode: {
    symbol: true,
  },
};

function buildSvg() {
  return src("**/*.svg", {
    cwd: "wordpress/wp-content/themes/Jegwell-front/src/assets",
  })
    .pipe(svgSprite(svgspriteConfig))
    .pipe(
      dest("wordpress/wp-content/themes/Jegwell-front/src/assets/svg-sprite")
    );
}

exports.default = parallel(buildSvg);
