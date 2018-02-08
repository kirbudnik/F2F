const autoprefixer = require('autoprefixer');
const moduleValues = require('postcss-modules-values');


module.exports = {
	plugins: [
		// Adds all necessary prefixes for cross browser compatibility
		autoprefixer,
		// Can use variables in CSS for things like colors and media sizes
		moduleValues,
	],
};
