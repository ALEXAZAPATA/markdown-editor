const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');

let win;

app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          click() {
         
            win.webContents.send('new-file');
          }
        },
        {
          label: 'Open',
          async click() {
            const { filePaths } = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [
                { name: 'Markdown', extensions: ['md'] }
              ]
            });

            if (filePaths.length > 0) {
              const content = fs.readFileSync(filePaths[0], 'utf-8');

              win.webContents.send('load-file', content);
            }
          }
        },
        {
          label: 'Save',
          click() {
           
            win.webContents.send('save-file');
          }
        },
        { type: 'separator' },
        {
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});


ipcMain.on('file-content', async (event, content) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Guardar archivo',
    defaultPath: 'archivo.md',
    filters: [
      { name: 'Markdown', extensions: ['md'] }
    ]
  });

  if (filePath) {
    fs.writeFileSync(filePath, content);
  }
});
