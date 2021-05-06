const gulp = require("gulp")
const sass = require("gulp-sass")
const sassVars = require("../index")

gulp.task("sass", function() {
  const variables = {
    theme: null,
    url: "https://github.com/giowe/gulp-sass-vars",
    font: {
      family: ["'Open Sans'", "sans-serif"],
      size: "1.6em",
      color: "rgb(0,0,0)",
      "line-height": 1.5
    },
    sizes: ["xs", "sm", "lg"],
    responsive: true,
    display: "flex",
    color: "red"
  }

  return gulp.src("./style.scss")
    .pipe(sassVars(variables, { verbose: true }))
    .pipe(sass())
    .pipe(gulp.dest("dist"))
})
