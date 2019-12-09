// https://github.com/angular/angular-cli/issues/11360
const fs = require('fs');
const minify = require('html-minifier').minify;

const filePath = 'dist/c2c-volunteer-client/index.html';

fs.readFile(filePath, function (err, buf) {
  if (err) {
    console.log(err);
  } else {

    const originalValue = buf.toString();
    const minifiedValue = minify(originalValue, {
      caseSensitive: false,
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: false,
      collapseWhitespace: true,
      conservativeCollapse: false,
      decodeEntities: true,
      html5: true,
      minifyCSS: true,
      minifyJS: true,
      preserveLineBreaks: false,
      preventAttributesEscaping: false,
      processConditionalComments: true,
      processScripts: ["text/html"],
      removeComments: true,
      removeTagWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
    });


    fs.writeFile(filePath, minifiedValue, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        const diff = originalValue.length - minifiedValue.length;
        const savings = originalValue.length ? (100 * diff / originalValue.length).toFixed(2) : 0;
        console.log("Successfully minified '" + filePath + "'" +
          ". Original size: " + originalValue.length +
          ". Minified size: " + minifiedValue.length +
          ". Savings: " + diff + " (" + savings + "%)");
      }
    });
  }
});
