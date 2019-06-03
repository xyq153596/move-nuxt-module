const path = require("path");
const vfs = require("vinyl-fs");
const map = require("map-stream");
const fse = require("fs-extra");
async function asyncModule() {
  const { outputDir, dirName, version, type } = this.options.globalModuleOptions;

  this.nuxt.hook("generate:done", async nuxt => {
    const dir = path.join(nuxt.options.rootDir, "dist", outputDir);
    let entriePath = "";
    if (type === "oss") {
      entriePath = path.join(dir, "assets", dirName, version, "**/*.html");
    } else if (type === "server") {
      entriePath = path.join(dir, dirName, version, "**/*.html");
    } else {
      entriePath = path.join(dir, "assets", dirName, version, "**/*.html");
    }

    const moveDir = path.join(dir, dirName);
    vfs.src(entriePath).pipe(vfs.dest(moveDir));
    vfs.src(entriePath).pipe(
      map(function(file, cb) {
        fse.removeSync(file.path);
        cb(null, file);
      })
    );
  });
}

module.exports = asyncModule;
module.exports.meta = require("./package.json");
