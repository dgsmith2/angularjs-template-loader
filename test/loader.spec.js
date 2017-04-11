var should = require("should");
var loader = require("../index.js");

describe("loader", () => {
  it("Should convert html file string to require()", () => {
    loader.call({}, `
        angular.module("my-module").component("my-component", {
            templateUrl: "./myComponent.html"
        });`)
      .should
      .be
      .eql(`
        angular.module("my-module").component("my-component", {
            template: require('./myComponent.html')
        });`);
  });

  it("Should convert html file string to require() regardless of inner quotes", () => {
    loader.call({}, String.raw`
        angular.module("my-module").component("my-component", {
            templateUrl: './some/path/to/file\'.html',
            templateUrl: "./some/path/\"goodies\".html\\"
        });`)
      .should
      .be
      .eql(String.raw`
        angular.module("my-module").component("my-component", {
            template: require('./some/path/to/file\'.html'),
            template: require('./some/path/\"goodies\".html\\')
        });`);
  });

  it("Should return original source if there are no matches", () => {
    loader.call({}, 'foo')
      .should
      .be
      .eql('foo');
  });

  it("Should convert partial string match to require()", () => {
    loader.call({}, `{templateUrl: './index/app.html'}`)
      .should
      .be
      .eql(`{template: require('./index/app.html')}`);
  });

  it("Should handle the absense of proper relative path notation", () => {
    loader.call({}, `
        angular.module("my-module").component("my-component", {
            templateUrl: "myComponent.html"
        });`)
      .should
      .be
      .eql(`
        angular.module("my-module").component("my-component", {
            template: require('./myComponent.html')
        });`);
  });

  it("Should convert html file string to require() regardless of spacing", () => {
    loader.call({}, `
        angular.module("my-module").component("my-component", {
            templateUrl : "myComponent.html"
        });`)
      .should
      .be
      .eql(`
        angular.module("my-module").component("my-component", {
            template: require('./myComponent.html')
        });`);
  });

  it("Should convert html file string to require() with relativeTo", () => {
    var self = {};
    self.query = {
      relativeTo: "/foo/bar"
    };

    loader.call(self, `
        angular.module("my-module").component("my-component", {
            templateUrl: "./myComponent.html"
        });`)
      .should
      .be
      .eql(`
        angular.module("my-module").component("my-component", {
            template: require('/foo/bar/myComponent.html')
        });`);
  });

  it("Should convert html file string to require() in a single line component definition", () => {
    loader.call({}, `angular.module("my-module").component("my-component", {templateUrl: "./myComponent.html"});`)
      .should
      .be
      .eql(`angular.module("my-module").component("my-component", {template: require('./myComponent.html')});`);
  });

  it("Should convert html string to require() if line is ending by space character", () => {
    loader.call({}, `
        angular.module("my-module").component("my-component", {
            templateUrl: "./myComponent.html" ,
            controller: "MyController"
        });`)
      .should
      .be
      .eql(`
        angular.module("my-module").component("my-component", {
            template: require('./myComponent.html') ,
            controller: "MyController"
        });`);
  });
});
