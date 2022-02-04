window.addEventListener("DOMContentLoaded", () => {
	(function () {
		try {
			if (checkPathname(window.location.pathname)) colorBlock();
		} catch (error) {}
	})();
});

function checkPathname(path) {
	const pathname = ["/course/view.php", "/course/editsection.php"];

	if (pathname.includes(path)) return true;
}

function colorBlock() {
	let color = { h: 217, s: 35, l: 83 },
		defaultColor = { h: 217, s: 35, l: 83 },
		courseHeaderImgUrl = localStorage.getItem(
			`courseHeaderImgUrl${window.location.search}`
		),
		hasTheme = localStorage.getItem(`hasTheme${window.location.search}`);

	const blockThumb = document.querySelector(".course-block__thumb"),
		blocksOneColor = document.getElementsByClassName("theme_one-color"),
		blocksDifferentColor = document.getElementsByClassName("theme_different-color");

	if (blocksOneColor.length !== 0)
		applyTheme(
			blocksOneColor,
			createImageElement(blockThumb, courseHeaderImgUrl),
			false
		);

	if (blocksDifferentColor.length !== 0)
		applyTheme(
			blocksDifferentColor,
			createImageElement(blockThumb, courseHeaderImgUrl),
			true
		);

	function applyTheme(blocks, newImg, isDifferentColours) {
		if (hasTheme && !newImg) return "Image exists and theme already applied";

		if (blocks.length > 0) {
			applyСolor(blocks, newImg, isDifferentColours);
		}

		hasTheme = true;
		addToLocalStorage("hasTheme", hasTheme);
	}

	function checkImageExists(item, imgLocalStorage) {
		// картинки нет в курсе и в хранилище
		if (!item && imgLocalStorage === "null") return true;

		// картинка в курсе совпадает со значением в хранилище
		if (
			item &&
			`${item.getAttribute("src")}${window.location.search}` === imgLocalStorage
		)
			return true;

		return null;
	}

	function createImageElement(imgBlock, imgLocalStorage) {
		// в курсе нет картинки
		if (!imgBlock || imgBlock.children.length === 0) {
			if (checkImageExists(null, imgLocalStorage)) return false;

			addToLocalStorage("courseHeaderImgUrl", null);
			// TODO: проверить если картинки нет применяется ли тема
			// addToLocalStorage("hasTheme", hasTheme);
			return null;
		}

		// в курсе есть картинка
		for (const item of imgBlock.children) {
			// картинка есть в хранилище не создаем элемент
			if (checkImageExists(item, imgLocalStorage)) return false;

			const img = document.createElement("img");
			hasTheme = false;
			img.src = item.src;

			addToLocalStorage("courseHeaderImgUrl", img.src);
			addToLocalStorage("hasTheme", hasTheme);

			// break;
			return img;
		}
	}

	function addToLocalStorage(key, value) {
		localStorage.setItem(`${key}${window.location.search}`, value);
	}

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
			return null;
		}

		height = canvas.height =
			imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
		width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

		context.drawImage(imgEl, 0, 0);

		try {
			data = context.getImageData(0, 0, width, height);
		} catch (e) {
			console.log("security error, img on diff domain");
			return null;
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

		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

		return hsl;
	}

	function setBackgroundСolor(elem, color = defaultColor, alfa = 30) {
		if (color.s < 20) {
			color.s = 20;
			alfa = 40;
		}
		elem.style.backgroundColor = `hsl(${color.h} ${color.s}% ${color.l}% / ${alfa}%)`;
	}

	function applyСolor(classBlocks, img, isDifferentColours = false) {
		const lightnessStep = ~~(100 / classBlocks.length),
			hueStep = ~~(360 / classBlocks.length);

		if (img) color = getAverageColor(img);

		if (!color) color = defaultColor;

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
		} else if (!img && isDifferentColours) {
			let footerColor = JSON.parse(JSON.stringify(color)),
				moduleColor = JSON.parse(JSON.stringify(color));

			for (let i = 0; i < classBlocks.length; i++) {
				// первый блок - шапка
				if (i == 0) {
					setBackgroundСolor(classBlocks[i], color, 100);
				}
				// последний блок с классом "course-block_footer"
				else if (
					i == classBlocks.length - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					setBackgroundСolor(classBlocks[i], footerColor, 100);
				}
				// все остальные блоки
				else {
					moduleColor.h = hueStep * (classBlocks.length - i);
					setBackgroundСolor(classBlocks[i], moduleColor, 100);
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
