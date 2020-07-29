const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const slash = require("slash");
const log = require("electron-log");

process.env.NODE_ENV = "production";

const isDevelopment = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: "Image Resizer",
		width: 600,
		height: 700,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDevelopment,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	});

	mainWindow.loadURL(`file://${__dirname}/app/index.html`); // mainWindow.loadfile('./app/index.html')
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: "About Image Resizer",
		width: 300,
		height: 500,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		backgroundColor: "#fff",
		resizable: isDevelopment,
	});

	aboutWindow.loadURL(`file://${__dirname}/app/about.html`);
}

app.on("ready", () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on("close", () => (mainWindow = null));
});

const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: "About",
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		role: "fileMenu",
	},
	...(!isMac
		? [
				{
					label: "Help",
					click: createAboutWindow,
				},
		  ]
		: []),
	...(isDevelopment
		? [
				{
					label: "Developer",
					submenu: [{ role: "reload" }, { role: "forcereload" }, { type: "separator" }, { role: "toggledevtools" }],
				},
		  ]
		: []),
];

let d;

ipcMain.on("saving:path", (e, result) => {
	d = slash(result.filePath);
});

ipcMain.on("image:minimize", (e, options) => {
	console.log(d);
	setImageQuality(options, d);
});

async function setImageQuality({ imgPath, quality }, dest) {
	try {
		const pngQuality = quality / 100;

		const file = await imagemin([slash(imgPath)], {
			destination: dest,
			plugins: [
				imageminMozjpeg({ quality }),
				imageminPngquant({
					quality: [pngQuality, pngQuality],
				}),
			],
		});

		log.info(file);

		shell.openPath(dest);
	} catch (err) {
		log.error("Imagemin Error: ", err);
	}
}

// Function to minimize the window on mac to the menu bar but doesnt close it
app.on("window-all-closed", () => {
	if (!isMac) {
		app.quit();
	}
});

// Function to create a new window when pressing the dock icon on mac
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});
