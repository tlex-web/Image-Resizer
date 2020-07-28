const { dialog } = require("electron").remote;
const { ipcRenderer } = require("electron");
const path = require("path");
const os = require("os");

const saveBtn = document.querySelector(".choose-saving-location");
const form = document.querySelector("#image-form");
const slider = document.querySelector("#slider");
const img = document.querySelector("#img");

let filePath;

//document.querySelector(".output-path").innerText = path.join(os.homedir(), 'gallery');

saveBtn.addEventListener("click", () => {
	dialog
		.showSaveDialog(null, {
			title: "Choose file name and saving location",
			defaultPath: img.files[0].path,
			buttonLabel: "Save here",
			filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
		})
		.then((result) => {
			console.log(result.canceled);
			if (!result.canceled) {
				filePath = result.filePath;

				document.querySelector(".output-path").innerText = result.filePath;
			} else {
				dialog.showErrorBox("File Saving Error", "You need to choose a saving location");
			}
		})
		.catch((err) => {
			console.log("Error: ", err);
		});
});

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const imgPath = img.files[0].path;
	const quality = slider.value;

	ipcRenderer.send("saving:path", {
		filePath,
	});

	ipcRenderer.send("image:minimize", {
		imgPath,
		quality,
	});
});
