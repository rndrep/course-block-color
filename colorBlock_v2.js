window.addEventListener("DOMContentLoaded", () => {
	(function () {
		colorBlock();
	})();
});

// function colorBlock() {
// 	let color = { h: 217, s: 35, l: 83 },
// 		courseHeaderImg = null,
// 		courseHeaderImgUrl = localStorage.getItem("courseHeaderImgUrl"),
// 		courseTheme = localStorage.getItem("courseTheme");

// 	const blockThumb = document.querySelector(".course-block__thumb"),
// 		blocksOneColor = document.getElementsByClassName("theme_one-color"),
// 		blocksDifferentColor = document.getElementsByClassName("theme_different-color");

// 	try {
// 		// если картинки нет в хранилище или адрес картинки не совпадает
// 		if (
// 			courseHeaderImgUrl === null ||
// 			courseHeaderImgUrl !== item.getAttribute("src")
// 		) {
// 			if (blockThumb && blockThumb.hasChildNodes()) {
// 				for (const item of blockThumb.children) {
// 					if (item.tagName === "IMG") {
// 						courseHeaderImgUrl = item.getAttribute("src");
// 						localStorage.setItem("courseHeaderImgUrl", courseHeaderImgUrl);
// 						courseHeaderImg = document.createElement("img");
// 						courseHeaderImg.src = courseHeaderImgUrl;
// 						break;
// 					}
// 				}
// 			}

// 			if (!courseTheme) {
// 				if (blocksOneColor.length > 0) {
// 					applyСolor(blocksOneColor, courseHeaderImg, false);
// 				} else if (blocksDifferentColor.length > 0) {
// 					applyСolor(blocksDifferentColor, courseHeaderImg, true);
// 				}
// 				courseTheme = true;
// 				localStorage.setItem("courseTheme", courseTheme);
// 			}
// 		}
// 	} catch (error) {}

// 	function rgbToHsl(r, g, b) {
// 		r /= 255;
// 		g /= 255;
// 		b /= 255;

// 		let cmin = Math.min(r, g, b),
// 			cmax = Math.max(r, g, b),
// 			delta = cmax - cmin,
// 			h = 0,
// 			s = 0,
// 			l = 0;

// 		if (delta == 0) h = 0;
// 		// Red is max
// 		else if (cmax == r) h = ((g - b) / delta) % 6;
// 		// Green is max
// 		else if (cmax == g) h = (b - r) / delta + 2;
// 		// Blue is max
// 		else h = (r - g) / delta + 4;

// 		h = Math.round(h * 60);

// 		if (h < 0) h += 360;

// 		l = (cmax + cmin) / 2;

// 		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

// 		// Multiply l and s by 100
// 		s = +(s * 100).toFixed(1);
// 		l = +(l * 100).toFixed(1);

// 		return { h: h, s: s, l: l };
// 	}

// 	function getAverageColor(imgEl) {
// 		const blockSize = 5, // only visit every 5 pixels
// 			defaultRGB = { r: 49, g: 90, b: 155 }, // for non-supporting envs
// 			canvas = document.createElement("canvas"),
// 			context = canvas.getContext && canvas.getContext("2d");

// 		let data,
// 			width,
// 			height,
// 			i = -4,
// 			length,
// 			rgb = { r: 49, g: 90, b: 155 },
// 			count = 0;

// 		if (!context) {
// 			return defaultRGB;
// 		}

// 		height = canvas.height =
// 			imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
// 		width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

// 		context.drawImage(imgEl, 0, 0);

// 		try {
// 			data = context.getImageData(0, 0, width, height);
// 		} catch (e) {
// 			/* security error, img on diff domain */ console.log(
// 				"security error, img on diff domain"
// 			);
// 			return defaultRGB;
// 		}

// 		length = data.data.length;

// 		while ((i += blockSize * 4) < length) {
// 			++count;
// 			rgb.r += data.data[i];
// 			rgb.g += data.data[i + 1];
// 			rgb.b += data.data[i + 2];
// 		}

// 		// ~~ used to floor values
// 		rgb.r = ~~(rgb.r / count);
// 		rgb.g = ~~(rgb.g / count);
// 		rgb.b = ~~(rgb.b / count);

// 		let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

// 		return hsl;
// 	}

// 	function setBackgroundСolor(elem, color = defaultColor) {
// 		elem.style.backgroundColor = `hsl(${color.h} ${color.s}% ${color.l}% / 20%)`;
// 	}

// 	function applyСolor(classBlocks, img, isDifferentColours = false) {
// 		const lightnessStep = ~~(100 / classBlocks.length),
// 			hueStep = ~~(360 / classBlocks.length);

// 		if (img) color = getAverageColor(img);

// 		// есть картинка и блоки с одним цветом
// 		if (img && !isDifferentColours) {
// 			let footerColor = JSON.parse(JSON.stringify(color));

// 			for (let i = 0; i < classBlocks.length; i++) {
// 				// первый блок - шапка
// 				if (i == 0) {
// 					setBackgroundСolor(classBlocks[i], color);
// 				}
// 				// последний блок с классом "course-block_footer"
// 				else if (
// 					i == classBlocks.length - 1 &&
// 					classBlocks[i].classList.contains("course-block_footer")
// 				) {
// 					footerColor.l = lightnessStep * (classBlocks.length - i);
// 					setBackgroundСolor(classBlocks[i], footerColor);
// 				}
// 				// все остальные блоки
// 				else {
// 					color.l = lightnessStep * (classBlocks.length - i);
// 					setBackgroundСolor(classBlocks[i], color);
// 				}
// 			}
// 			//  блоки с разными цветами с картинкой
// 		} else if (img && isDifferentColours) {
// 			let footerColor = JSON.parse(JSON.stringify(color)),
// 				moduleColor = JSON.parse(JSON.stringify(color));

// 			for (let i = 0; i < classBlocks.length; i++) {
// 				// первый блок - шапка
// 				if (i == 0) {
// 					setBackgroundСolor(classBlocks[i], color);
// 				}
// 				// последний блок с классом "course-block_footer"
// 				else if (
// 					i == classBlocks.length - 1 &&
// 					classBlocks[i].classList.contains("course-block_footer")
// 				) {
// 					setBackgroundСolor(classBlocks[i], footerColor);
// 				}
// 				// все остальные блоки
// 				else {
// 					moduleColor.h = hueStep * (classBlocks.length - i);
// 					setBackgroundСolor(classBlocks[i], moduleColor);
// 				}
// 			}
// 		} else if (isDifferentColours) {
// 			let footerColor = JSON.parse(JSON.stringify(color)),
// 				moduleColor = JSON.parse(JSON.stringify(color));

// 			for (let i = 0; i < classBlocks.length; i++) {
// 				// первый блок - шапка
// 				if (i == 0) {
// 					setBackgroundСolor(classBlocks[i], color);
// 				}
// 				// последний блок с классом "course-block_footer"
// 				else if (
// 					i == classBlocks.length - 1 &&
// 					classBlocks[i].classList.contains("course-block_footer")
// 				) {
// 					setBackgroundСolor(classBlocks[i], footerColor);
// 				}
// 				// все остальные блоки
// 				else {
// 					moduleColor.h = hueStep * (classBlocks.length - i);
// 					setBackgroundСolor(classBlocks[i], moduleColor);
// 				}
// 			}
// 		} else {
// 			// нет картинки, второй цвет по умолчанию
// 			for (let i = 0; i < classBlocks.length; i++) {
// 				if (
// 					i == classBlocks.length - 1 &&
// 					classBlocks[i].classList.contains("course-block_footer")
// 				) {
// 					setBackgroundСolor(classBlocks[i], color);
// 				}

// 				setBackgroundСolor(classBlocks[i], color);
// 			}
// 		}
// 	}
// }

function colorBlock() {
	let color = { h: 217, s: 35, l: 83 },
		courseHeaderImg = null,
		courseHeaderImgUrl = localStorage.getItem(
			`courseHeaderImgUrl${window.location.search}`
		),
		courseTheme = localStorage.getItem(`courseTheme${window.location.search}`);

	const blockThumb = document.querySelector(".course-block__thumb"),
		blocksOneColor = document.getElementsByClassName("theme_one-color"),
		blocksDifferentColor = document.getElementsByClassName("theme_different-color");

	try {
		// если картинки нет в хранилище или адрес картинки не совпадает
		if (
			!courseHeaderImgUrl ||
			courseHeaderImgUrl === `courseHeaderImgUrl${window.location.search}` ||
			courseHeaderImgUrl !== `${item.getAttribute("src")}${window.location.search}`
		) {
			if (blockThumb && blockThumb.hasChildNodes()) {
				for (const item of blockThumb.children) {
					if (item.tagName === "IMG") {
						courseHeaderImgUrl = item.getAttribute("src");
						localStorage.setItem(
							`courseHeaderImgUrl${window.location.search}`,
							courseHeaderImgUrl
						);
						courseHeaderImg = document.createElement("img");
						courseHeaderImg.src = courseHeaderImgUrl;
						break;
					}
				}
			}

			if (courseTheme !== window.location.search) {
				if (blocksOneColor.length > 0) {
					applyСolor(blocksOneColor, courseHeaderImg, false);
				} else if (blocksDifferentColor.length > 0) {
					applyСolor(blocksDifferentColor, courseHeaderImg, true);
				}
				courseTheme = true;
				localStorage.setItem(`courseTheme${window.location.search}`, courseTheme);
			}
		}
	} catch (error) {}

	function rgbToHsl(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		if (delta == 0) h = 0;
		// Red is max
		else if (cmax == r) h = ((g - b) / delta) % 6;
		// Green is max
		else if (cmax == g) h = (b - r) / delta + 2;
		// Blue is max
		else h = (r - g) / delta + 4;

		h = Math.round(h * 60);

		if (h < 0) h += 360;

		l = (cmax + cmin) / 2;

		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

		// Multiply l and s by 100
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return { h: h, s: s, l: l };
	}

	function getAverageColor(imgEl) {
		const blockSize = 5, // only visit every 5 pixels
			defaultRGB = { r: 49, g: 90, b: 155 }, // for non-supporting envs
			canvas = document.createElement("canvas"),
			context = canvas.getContext && canvas.getContext("2d");

		let data,
			width,
			height,
			i = -4,
			length,
			rgb = { r: 49, g: 90, b: 155 },
			count = 0;

		if (!context) {
			return defaultRGB;
		}

		height = canvas.height =
			imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
		width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

		context.drawImage(imgEl, 0, 0);

		try {
			data = context.getImageData(0, 0, width, height);
		} catch (e) {
			/* security error, img on diff domain */ console.log(
				"security error, img on diff domain"
			);
			return defaultRGB;
		}

		length = data.data.length;

		while ((i += blockSize * 4) < length) {
			++count;
			rgb.r += data.data[i];
			rgb.g += data.data[i + 1];
			rgb.b += data.data[i + 2];
		}

		// ~~ used to floor values
		rgb.r = ~~(rgb.r / count);
		rgb.g = ~~(rgb.g / count);
		rgb.b = ~~(rgb.b / count);

		let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

		return hsl;
	}

	function setBackgroundСolor(elem, color = defaultColor) {
		elem.style.backgroundColor = `hsl(${color.h} ${color.s}% ${color.l}% / 30%)`;
	}

	function applyСolor(classBlocks, img, isDifferentColours = false) {
		const lightnessStep = ~~(100 / classBlocks.length),
			hueStep = ~~(360 / classBlocks.length);

		if (img) color = getAverageColor(img);

		// есть картинка и блоки с одним цветом
		if (img && !isDifferentColours) {
			let footerColor = JSON.parse(JSON.stringify(color));

			for (let i = 0; i < classBlocks.length; i++) {
				// первый блок - шапка
				if (i == 0) {
					setBackgroundСolor(classBlocks[i], color);
				}
				// последний блок с классом "course-block_footer"
				else if (
					i == classBlocks.length - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					footerColor.l = lightnessStep * (classBlocks.length - i);
					setBackgroundСolor(classBlocks[i], footerColor);
				}
				// все остальные блоки
				else {
					color.l = lightnessStep * (classBlocks.length - i);
					setBackgroundСolor(classBlocks[i], color);
				}
			}
			//  блоки с разными цветами с картинкой
		} else if (img && isDifferentColours) {
			let footerColor = JSON.parse(JSON.stringify(color)),
				moduleColor = JSON.parse(JSON.stringify(color));

			for (let i = 0; i < classBlocks.length; i++) {
				// первый блок - шапка
				if (i == 0) {
					setBackgroundСolor(classBlocks[i], color);
				}
				// последний блок с классом "course-block_footer"
				else if (
					i == classBlocks.length - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					setBackgroundСolor(classBlocks[i], footerColor);
				}
				// все остальные блоки
				else {
					moduleColor.h = hueStep * (classBlocks.length - i);
					setBackgroundСolor(classBlocks[i], moduleColor);
				}
			}
		} else if (isDifferentColours) {
			let footerColor = JSON.parse(JSON.stringify(color)),
				moduleColor = JSON.parse(JSON.stringify(color));

			for (let i = 0; i < classBlocks.length; i++) {
				// первый блок - шапка
				if (i == 0) {
					setBackgroundСolor(classBlocks[i], color);
				}
				// последний блок с классом "course-block_footer"
				else if (
					i == classBlocks.length - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					setBackgroundСolor(classBlocks[i], footerColor);
				}
				// все остальные блоки
				else {
					moduleColor.h = hueStep * (classBlocks.length - i);
					setBackgroundСolor(classBlocks[i], moduleColor);
				}
			}
		} else {
			// нет картинки, второй цвет по умолчанию
			for (let i = 0; i < classBlocks.length; i++) {
				if (
					i == classBlocks.length - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					setBackgroundСolor(classBlocks[i], color);
				}

				setBackgroundСolor(classBlocks[i], color);
			}
		}
	}
}
