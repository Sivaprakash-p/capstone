const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scribbly', {
  // Listen to server status updates from main process
  onServerStatus: (callback) => {
    ipcRenderer.on('server-status', (_, data) => callback(data));
  },
  onPythonLog: (callback) => {
    ipcRenderer.on('python-log', (_, msg) => callback(msg));
  },
  // Get current status
  getServerStatus: () => ipcRenderer.invoke('get-server-status'),
  openExternal:    (url) => ipcRenderer.invoke('open-external', url),
});
