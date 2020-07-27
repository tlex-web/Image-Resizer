const { dialog } = require("electron").remote;
const path = require("path");
const os = require("os");

document.querySelector(".output-path").innerText = path.join(os.homedir());

const saveBtn = document.querySelector(".choose-saving-location");

const f = saveBtn.addEventListener("click", () => {
	dialog.showSaveDialogSync({
		title: "Choose file location",
		defaultPath: `${__dirname}`,
	});
});

console.log(f);
