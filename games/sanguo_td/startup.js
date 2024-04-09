const { app, BrowserWindow } = require('electron');

let win = null;

function createWindow () {
	win = new BrowserWindow({ width: 800, height: 480 });
	win.loadFile('index.html');

	win.on('closed', () => {
		win = null
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit()
});

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
});
