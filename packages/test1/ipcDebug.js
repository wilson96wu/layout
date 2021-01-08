const electronIpcLog = require("electron-ipc-log");
const { ipcMain } = require("electron");

const events = [];
let isReady = false;

const EXCLUDED_CHANNELS = [
  "editor:ipc-reply",
  "editor:ipc-renderer2panel",
  "selection:hoverin",
  "selection:hoverout",
  "_selection:hoverin",
  "_selection:hoverout",
  "editor:ipc-renderer2all"
];

module.exports = {
  enable() {
    electronIpcLog((event) => {
      const { channel, data, sent, sync } = event;
      if (EXCLUDED_CHANNELS.indexOf(channel) === -1) {
        const args = [sent ? "⬆️" : "⬇️", channel, ...data];
        if (sync) args.unshift("ipc:sync");
        else args.unshift("ipc");
        if (isReady === false) {
          events.push(args);
        } else {
          Editor.log(...args);
        }
      }
    });

    ipcMain.once("editor:ready", () => {
      for (const event of events) {
        Editor.log(...event);
      }
      events.length = 0;
      isReady = true;
    });
  }
};
