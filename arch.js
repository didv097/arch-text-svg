const args = process.argv.slice(2);	// text, font, width, height, arch height, x_coord, y_coord

const text = args[0];
const font = args[1];
const width = parseInt(args[2]);
const height = parseInt(args[3]);
const arch_height = parseInt(args[4]);
const x = parseInt(args[5]);
const y = parseInt(args[6]);

const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync(font);

const options = {x: 0, y: 0, fontSize: height, anchor: 'top'};

const d = textToSVG.getD(text, options);

let numbers = d.split(/[A-Z ]+/).slice(1);
numbers.pop();
let chars = d.split(/[.0-9]+/);

let maxX = -1000, maxY = -1000, minX = 1000, minY = 1000;
let orgWidth, orgHeight;

for (let i = 0; i < numbers.length; i += 2) {
	numbers[i] = parseFloat(numbers[i]);
	numbers[i + 1] = parseFloat(numbers[i + 1]);
	maxX = Math.max(maxX, numbers[i]);
	minX = Math.min(minX, numbers[i]);
	maxY = Math.max(maxY, numbers[i + 1]);
	minY = Math.min(minY, numbers[i + 1]);
}

orgWidth = maxX - minX;
orgHeight = maxY - minY;

for (let i = 0; i < numbers.length; i += 2) {
	numbers[i] -= minX;
	numbers[i] *= width / orgWidth;
	numbers[i + 1] -= minY;
	numbers[i + 1] *= height / orgHeight;
	numbers[i + 1] += Math.pow((numbers[i] - width / 2), 2) * 4 * arch_height / Math.pow(width, 2);
	numbers[i] += x;
	numbers[i + 1] += y;
}

for (let i = 0; i < numbers.length; i ++) {
	numbers[i] = Math.floor(numbers[i] * 100) / 100;
}

let ret = "", i;

for (i = 0; i < numbers.length; i ++) {
	ret += chars[i];
	ret += numbers[i];
}
ret += chars[i];

console.log(ret)
