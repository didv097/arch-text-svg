const args = process.argv.slice(2);	// text, font, font size(height), arch height, x, y

const text = args[0];
const font = args[1];
const font_size = parseInt(args[2]);
const arch_height = parseInt(args[3]);
const x = parseInt(args[4]);
const y = parseInt(args[5]);

const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync(font);

const options = {x: 0, y: 0, fontSize: font_size, anchor: 'top'};

let d = [], width = [], totalWidth = 0, pos = [];
let ret = "";
let i, j;

for (i in text) {
	d.push(textToSVG.getD(text[i], options));
	width.push(textToSVG.getMetrics(text[i], options).width);
	pos.push(totalWidth)
	totalWidth += width[i];
}
const baseline = textToSVG.getMetrics(text, options).baseline;
const radius = totalWidth * totalWidth / arch_height / 8;
const totalAngle = totalWidth / radius;

for (i in text) {
	let numbers = d[i].split(/[A-Z ]+/).slice(1);
	numbers.pop();
	let chars = d[i].split(/[.0-9]+/);
	let angle = totalAngle * ((pos[i] + width[i] / 2) / totalWidth - 0.5);
	for (j = 0; j < numbers.length; j += 2) {
		numbers[j] -= width[i] / 2;
		numbers[j + 1] = Number(numbers[j + 1]) - radius - baseline;
		const temp = numbers[j] * Math.cos(angle) - numbers[j + 1] * Math.sin(angle);
		numbers[j + 1] = numbers[j] * Math.sin(angle) + numbers[j + 1] * Math.cos(angle);
		numbers[j] = temp + width[i] / 2 + totalWidth / 2 + x;
		numbers[j + 1] += baseline + radius + y;
	}
	for (j = 0; j < numbers.length; j ++) {
		numbers[j] = Math.floor(numbers[j] * 100) / 100;
		ret += chars[j];
		ret += numbers[j];
	}
	ret += chars[j];
}

console.log(ret);