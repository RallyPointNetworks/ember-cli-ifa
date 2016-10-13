/* jshint node: true */
'use strict';

let fs = require('fs');

module.exports = {
  name: 'ember-cli-ifa',

  isDevelopingAddon: function() {
    return false;
  },

  postBuild: function (build) {
    let indexFilePath = build.directory + '/index.html';
    let indexFileBuffer = fs.readFileSync(indexFilePath);
    let indexFile = indexFileBuffer.toString('utf8');

    let files = fs.readdirSync(build.directory + '/assets');
    let totalFiles = files.length;

    let assetFileName = null;
    for (let i = 0; i < totalFiles; i++) {
      if (files[i].match(/^assetMap/i)) {
        assetFileName = files[i];
        break;
      }
    }

    if (assetFileName) {
      let fingerprint = this.app.options.fingerprint;
      let prepend = '/';

      if (fingerprint && fingerprint.prepend) {
        prepend = fingerprint.prepend;
      }

      fs.writeFileSync(
        indexFilePath,
        indexFile.replace(/__asset_map_placeholder__/, prepend + 'assets/' + assetFileName)
      );
    }
  },

  contentFor(type, config) {
    if (type === 'head-footer' && config.ifa && config.ifa.enabled) {
      return '<script>var __assetMapFilename__ = "__asset_map_placeholder__";</script>';
    }
  }
};
