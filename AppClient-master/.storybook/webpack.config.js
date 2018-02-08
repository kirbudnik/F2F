const mainConfig = require('../webpack.config.js')({ design: true });

const { resolve, plugins } = mainConfig;

module.exports = {
	resolve,
	plugins,
	module: {
		rules: [
			...mainConfig.module.loaders,
		],
	},
};
