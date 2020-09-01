const fileinclude = require('gulp-file-include');

let project_folder = "dist"; //Папкп передается заказчику
let source_folder = "#src"; //Исходники
let path={
  bild:{
    html: project_folder+"/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src:{
    html: [source_folder+"/*.html" , "!" + source_folder +"/_*.html" ],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch:{
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/"
}

let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require("browser-sync").create(),
  fileinclude1 = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass");


function browserSync(params){
  browsersync.init({
    server:{
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify:false      
  })
}



function html(){
  return src(path.src.html)
  .pipe(fileinclude1())
  .pipe(dest(path.bild.html))
  .pipe(browsersync.stream())
}

function watchFiles(param){
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
}

function clean(params){
  return del(path.clean);
}

function css(){
  return src(path.src.css)
  .pipe(
    scss({
      outputStyle:"expanded"
    })
  )
  .pipe(
    autoprefixer({
      overrideBrowserslist:["last 5 versions"],
      cascade: true
    })
  )
  .pipe(dest(path.bild.css))
  .pipe(browsersync.stream())
}

let bild = gulp.series(clean, gulp.parallel(css, html));
let watch = gulp.parallel(bild, watchFiles, browserSync);


exports.css = css;
exports.html = html;
exports.bild = bild;
exports.watch = watch;
exports.default = watch;