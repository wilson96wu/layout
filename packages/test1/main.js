'use strict';

const ipcDebug = require("./ipcDebug.js");
// Enable below call for logging ipc messages
ipcDebug.enable();
module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('test1');
    },
    'say-hello' () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('test1', 'test1:hello');
    },
    'clicked' () {
      Editor.log('Button clicked!');
    }
  },
};