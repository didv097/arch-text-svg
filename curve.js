const args = process.argv.slice(2);	// text, font, font size(height), width, arch height, x, y

const text = args[0];
const font = args[1];
const font_size = parseInt(args[2]);
const width = parseInt(args[3]);
const arch_height = parseInt(args[4]);
const x = parseInt(args[5]);
const y = parseInt(args[6]);

const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync(font);

const options = {x: 0, y: 0, fontSize: font_size, anchor: 'top'};

let d = [], charWidth = [], totalWidth = 0, pos = [];
let ret = "";
let i, j;

for (i in text) {
	d.push(textToSVG.getD(text[i], options));
	charWidth.push(textToSVG.getMetrics(text[i], options).width);
	pos.push(totalWidth)
	totalWidth += charWidth[i];
}
const baseline = textToSVG.getMetrics(text, options).baseline;
const radius = totalWidth * totalWidth / arch_height / 8;
const totalAngle = totalWidth / radius;

let allNumbers = [], allChars = [];
for (i in text) {
	let numbers = d[i].split(/[A-Z ]+/).slice(1);
	numbers.pop();
	let chars = d[i].split(/[.0-9]+/);
	let angle = totalAngle * ((pos[i] + charWidth[i] / 2) / totalWidth - 0.5);
	for (j = 0; j < numbers.length; j += 2) {
		numbers[j] -= charWidth[i] / 2;
		numbers[j + 1] = Number(numbers[j + 1]) - radius - baseline;
		const temp = numbers[j] * Math.cos(angle) - numbers[j + 1] * Math.sin(angle);
		numbers[j + 1] = numbers[j] * Math.sin(angle) + numbers[j + 1] * Math.cos(angle);
		numbers[j] = temp + charWidth[i] / 2 + totalWidth / 2;
		numbers[j + 1] += baseline + radius + y;
	}
	allChars = allChars.concat(chars);
	allNumbers = allNumbers.concat(numbers);
	allNumbers.push("");
}
let minX = 9999, maxX = -9999;
for (j = 0; j < allNumbers.length; ) {
	if (allNumbers[j] != "") {
		minX = Math.min(allNumbers[j], minX);
		maxX = Math.max(allNumbers[j], maxX);
		j += 2;
	} else {
		j ++;
	}
}
for (j = 0; j < allNumbers.length; ) {
	if (allNumbers[j] != "") {
		allNumbers[j] = (allNumbers[j] - minX) * width / (maxX - minX) + x;
		allNumbers[j] = Math.round(allNumbers[j] * 100) / 100;
		allNumbers[j + 1] = Math.round(allNumbers[j + 1] * 100) / 100;
		j += 2;
	} else {
		j ++;
	}
}
for (j in allNumbers) {
	ret += allChars[j];
	ret += allNumbers[j];
}
ret.length --;

console.log(ret);