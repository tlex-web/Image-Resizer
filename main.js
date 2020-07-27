const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

process.env.NODE_ENV = "development";

const isDevelopment = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: "Image Resizer",
		width: 1920,
		height: 1080,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDevelopment,
	});

	mainWindow.loadURL(`file://${__dirname}/app/index.html`); // mainWindow.loadfile('./app/index.html')
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: "About Image Resizer",
		width: 300,
		height: 600,
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

	globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
	globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () => mainWindow.toggleDevTools());

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
