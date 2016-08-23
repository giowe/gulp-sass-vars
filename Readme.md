# gulp-sass-vars

<div>
	<a href="https://www.npmjs.com/package/slush-aws-lambda"><img src='http://img.shields.io/npm/v/gulp-sass-vars.svg?style=flat'></a>
	<a href="https://www.npmjs.com/package/slush-aws-lambda"><img src='https://img.shields.io/npm/dm/gulp-sass-vars.svg?style=flat-square'></a>
	<a href="https://david-dm.org/giowe/gulp-sass-vars"><img src='https://david-dm.org/giowe/gulp-sass-vars.svg'></a>
	<a href="https://www.youtube.com/watch?v=Sagg08DrO5U"><img src='http://img.shields.io/badge/gandalf-approved-61C6FF.svg'></a>
</div>

Inject variables in sass files from a js object.

## Usage

```
npm install gulp-sass-vars
```

```js

var insert = require('gulp-sass-vars');

gulp.task('sass', function() {
  var variables = {
    stringTest: "hello",
    string2Test: "https://github.com/giowe/gulp-sass-vars",
    integerTest: 123,
  };

  return gulp.src([
    'src/styles/main.scss'
  ])
    .pipe(sassVars(variables))
    .pipe(sass())
    .pipe(gulp.dest('dist'))
});
```

This script will prepend the following code to your main.scss file:

```
$stringTest: hello;
$string2Test: "https://github.com/giowe/gulp-sass-vars";
$integerTest: 123;
```

So you can use all those variables inside your sass file.
Quotes will be added when needed via regex.