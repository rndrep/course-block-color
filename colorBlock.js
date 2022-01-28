let firstColor = { h: 216, s: 33, l: 97 },
	secondColor = { h: 217, s: 35, l: 83 },
	courseHeaderImg = null,
	courseHeaderImgUrl = localStorage.getItem("courseHeaderImgUrl"),
	courseTheme = localStorage.getItem("courseTheme");

const blockThumb = document.querySelector(".course-block__thumb"),
	blocksOneColor = document.getElementsByClassName("theme_one-color"),
	blocksDifferentColor = document.getElementsByClassName("theme_different-color");

try {
	// если картинки нет в хранилище или адрес картинки не совпадает
	if (courseHeaderImgUrl === null || courseHeaderImgUrl !== item.getAttribute("src")) {
		if (blockThumb && blockThumb.hasChildNodes()) {
			for (const item of blockThumb.children) {
				if (item.tagName === "IMG") {
					courseHeaderImgUrl = item.getAttribute("src");
					localStorage.setItem("courseHeaderImgUrl", courseHeaderImgUrl);
					courseHeaderImg = document.createElement("img");
					courseHeaderImg.src = courseHeaderImgUrl;
					break;
				}
			}
		}

		if (!courseTheme) {
			if (blocksOneColor.length > 0) {
				applyСolor(blocksOneColor, courseHeaderImg, false);
			} else if (blocksDifferentColor.length > 0) {
				applyСolor(blocksDifferentColor, courseHeaderImg, true);
			}
			courseTheme = true;
			localStorage.setItem("courseTheme", courseTheme);
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

	height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
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

function setBackgroundСolor(
	elem,
	degree = "135",
	firstColor = firstColor,
	secondColor = secondColor,
	gradientStopValue = "200"
) {
	elem.style.backgroundImage = `linear-gradient(
      ${degree}deg, 
  		hsl(${firstColor.h} ${firstColor.s}% ${firstColor.l}%) 0%, 
  		hsl(${secondColor.h} ${secondColor.s}% ${secondColor.l}%) ${gradientStopValue}%)`;
}

function applyСolor(classBlocks, img, isDifferentColours = false) {
	const blocksLength = classBlocks.length,
		lightnessStep = ~~(100 / blocksLength),
		hueStep = ~~(360 / blocksLength);

	if (img) secondColor = getAverageColor(img);

	//  есть картинка и блоки с одним цветом
	if (img && !isDifferentColours) {
		let footerSecondColor = JSON.parse(JSON.stringify(secondColor));

		for (let i = 0; i < blocksLength; i++) {
			// первый блок - шапка
			if (i == 0) {
				setBackgroundСolor(classBlocks[i], "135", firstColor, secondColor);
			}
			// последний блок с классом "course-block_footer"
			else if (
				i == blocksLength - 1 &&
				classBlocks[i].classList.contains("course-block_footer")
			) {
				footerSecondColor.l = lightnessStep * (blocksLength - i);
				setBackgroundСolor(
					classBlocks[i],
					"180",
					firstColor,
					footerSecondColor,
					"300"
				);
			}
			// все остальные блоки
			else {
				secondColor.l = lightnessStep * (blocksLength - i);
				setBackgroundСolor(classBlocks[i], "135", firstColor, secondColor);
			}
		}
	}
	//  есть картинка и блоки с разными цветами
	else if (isDifferentColours) {
		let footerSecondColor = JSON.parse(JSON.stringify(secondColor)),
			moduleSecondColor = JSON.parse(JSON.stringify(secondColor));

		if (img) {
			for (let i = 0; i < blocksLength; i++) {
				// первый блок - шапка
				if (i == 0) {
					setBackgroundСolor(classBlocks[i], "135", firstColor, secondColor);
				}
				// последний блок с классом "course-block_footer"
				else if (
					i == blocksLength - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					setBackgroundСolor(
						classBlocks[i],
						"180",
						firstColor,
						footerSecondColor
					);
				}
				// все остальные блоки
				else {
					moduleSecondColor.h = hueStep * (blocksLength - i);
					setBackgroundСolor(
						classBlocks[i],
						"135",
						firstColor,
						moduleSecondColor
					);
				}
			}
		} else {
			for (let i = 0; i < blocksLength; i++) {
				// первый блок - шапка
				if (i == 0) {
					setBackgroundСolor(
						classBlocks[i],
						"135",
						firstColor,
						secondColor,
						"100"
					);
				}
				// последний блок с классом "course-block_footer"
				else if (
					i == blocksLength - 1 &&
					classBlocks[i].classList.contains("course-block_footer")
				) {
					setBackgroundСolor(
						classBlocks[i],
						"180",
						firstColor,
						footerSecondColor,
						"100"
					);
				}
				// все остальные блоки
				else {
					moduleSecondColor.h = hueStep * (blocksLength - i);
					setBackgroundСolor(
						classBlocks[i],
						"135",
						firstColor,
						moduleSecondColor,
						"100"
					);
				}
			}
		}
	}
	// нет картинки, второй цвет по умолчанию
	else {
		for (let i = 0; i < blocksLength; i++) {
			if (
				i == blocksLength - 1 &&
				classBlocks[i].classList.contains("course-block_footer")
			) {
				setBackgroundСolor(classBlocks[i], "180", firstColor);
			}

			setBackgroundСolor(classBlocks[i], "135", firstColor);
		}
	}
}
