//npm install --save text-to-svg

const args = process.argv.slice(2);	// text, font_size, font

const text = args[0];
const font_size = parseInt(args[1]);
const font = args[2];

const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync(font);

const options = {x: 0, y: 0, fontSize: font_size, anchor: 'top'};

const d = textToSVG.getMetrics(text, options);

console.log(d.width, d.height)
