const loaderUtils = require("loader-utils");
const path = require("path");

// using: regex, capture groups, and capture group variables.
const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string, relativeTo) {
  return string.replace(stringRegex, (match, quote, url) => {
    if (relativeTo) {
      url = path.join(relativeTo, ...url.split('/'));
    }
    else if (url.charAt(0) !== ".") {
      url = "./" + url;
    }
    url = url.replace(/\\/g, '\\\\');
    return "require('" + url + "')";
  });
}

module.exports = function(source, sourcemap) {
  const options = loaderUtils.getOptions(this);

  // Not cacheable during unit tests;
  this.cacheable && this.cacheable();

  const newSource = source.replace(templateUrlRegex, (match, url) =>  {
    // replace: templateUrl: './path/to/template.html'
    // with: template: require('./path/to/template.html')
    // or: template: require('/root/app/path/template.html')
    // if `relativeTo` option is set to /root/app.
    return "template:" + replaceStringsWithRequires(url, options && options.relativeTo);
  });

  // Support for tests
  if (this.callback) {
    this.callback(null, newSource, sourcemap)
  } else {
    return newSource;
  }
};
