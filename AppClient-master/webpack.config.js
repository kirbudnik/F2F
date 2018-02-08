const assert = require('assert');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const webpackEnvLoader = require('./webpackEnvLoader');


const WEBPACK_DEV_PORT = 8080;
const PUBLIC_PATH = '/assets/static';

// These files will be loaded using the actual class/id names. Files should be loaded
// globally if you want to preserve class names after webpack has compiled.
const GLOBAL_CSS_TESTS = [/carousel\.css$/];

const ENVIRONMENTS = [
	'development',
	'staging',
	'production',
];

// Fail if any of these are not provided
const REQUIRED_ENV_KEYS = [
	'NODE_ENV',
	'ENVIRONMENT',
	'GA_TRACKING_ID',
	'FACEBOOK_CLIENT_ID',
	'ROLLBAR_CLIENT_TOKEN',
	'ROLLBAR_TOKEN',
	'STRIPE_PUBLIC_KEY',
	'CODE_SHA',
];

// These vars will be passed to the application in process.env
const PUBLIC_ENV_KEYS = [
	'NODE_ENV',
	'ENVIRONMENT',
	'GA_TRACKING_ID',
	'FACEBOOK_CLIENT_ID',
	'ROLLBAR_CLIENT_TOKEN',
	'STRIPE_PUBLIC_KEY',
	'CODE_SHA',
	'DESIGN_MODE',
];

const rollbarPublicPath = {
	production: `https://f2f.live${PUBLIC_PATH}`,
	staging: `https://staging.f2f.live${PUBLIC_PATH}`,
	development: '',
};


function plugins(envVars, environment) {
	let F2F_LIB_SRC = 'https://video.f2f.live';

	if (envVars.F2F_LIB_SRC) {
		F2F_LIB_SRC = envVars.F2F_LIB_SRC;
	}
	if (environment === 'staging') {
		F2F_LIB_SRC = 'https://video.staging.f2f.live';
	}

	const commonPlugins = [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src', 'index.html'),
			filename: path.join(__dirname, 'dist', 'build', 'index.html'),
			// FIXME - Change to prod once it is ready
			f2fLibrarySrc: `${F2F_LIB_SRC}/f2f.js?${Math.floor(Math.random() * 1000000000)}`,
			// Enable cache busting on our js bundle
			hash: true,
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'async',
		}),
		new webpack.DefinePlugin({
			// Exposed env variables need to be JSON-ified to be parsed correctly in the code
			'process.env':
				Object.keys(envVars)
					.filter(key => PUBLIC_ENV_KEYS.includes(key))
					.reduce((dict, key) => Object.assign(dict, { [key]: JSON.stringify(envVars[key]) }), {}),
		}),
	];

	if (environment === 'development') {
		return commonPlugins.concat([
			// new BundleAnalyzerPlugin(),
		]);
	}
	return commonPlugins.concat([
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			sourceMap: true,
			compress: { warnings: false },
			output: { comments: false },
		}),
		new RollbarSourceMapPlugin({
			accessToken: envVars.ROLLBAR_TOKEN,
			version: envVars.CODE_SHA,
			publicPath: rollbarPublicPath[environment],
		}),
	]);
}


module.exports = (cmdArgs = {}) => {
	let environment = 'development';

	if (process.env.CIRCLECI) {
		// Get the deployment environment name from the circle tag
		environment = process.env.CIRCLE_TAG || 'production';
	}

	assert(ENVIRONMENTS.includes(environment), 'Invalid deployment environment');

	const isDev = environment === 'development';
	const envVars = webpackEnvLoader(environment);

	envVars.NODE_ENV = environment === 'development' ? 'development' : 'production';
	envVars.ENVIRONMENT = environment;
	envVars.DESIGN_MODE = cmdArgs.design;

	REQUIRED_ENV_KEYS.forEach((key) => {
		assert(envVars[key], `${key} is a required env variable`);
	});

	return {
		// Absolute path for resolving the entry
		context: path.join(__dirname, 'src'),
		entry: './index.js',
		output: {
			path: path.join(__dirname, 'dist', 'build', 'static'),
			filename: 'index.js',
			publicPath: `${PUBLIC_PATH}/`,
		},
		// Don't build a source map on dev. It is slow.
		...(!isDev && { devtool: 'hidden-source-map' }),
		// Hot reload when files change
		watch: isDev,
		// devtool: 'source-map',
		// devtool: environment !== 'development' ? 'hidden-source-map' : false,
		resolve: {
			extensions: ['.js', '.scss', '.css', '.mp3'],
			// Gives us ability to require files absolutely instead of relative
			modules: [
				path.resolve(__dirname, 'src'),
				'node_modules',
			],
			alias: {
				images: path.resolve(__dirname, 'src', 'static', 'images'),
				styles: path.resolve(__dirname, 'src', 'static', 'styles'),
				audio: path.resolve(__dirname, 'src', 'static', 'audio'),
			},
		},
		devServer: environment === 'development' ? {
			contentBase: path.join(__dirname, 'dist', 'build'),
			port: WEBPACK_DEV_PORT,
			// Serve html page from other paths besides just '/'
			historyApiFallback: true,
		} : {},
		module: {
			loaders: [
				{ 	// JAVASCRIPT LOADER
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{	// CSS LOADER
					// Post css is used to compile our css modules
					// postcss.config.js imports the dependencies
					test: /\.css$/,
					exclude: GLOBAL_CSS_TESTS,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: '[name]__[local]___[hash:base64:5]',
							},
						},
						'postcss-loader',
					],
				},
				{	// GLOBAL CSS LOADER
					// Global css files are loaded without modifying class names
					test: GLOBAL_CSS_TESTS,
					use: [
						'style-loader',
						'css-loader',
						'postcss-loader',
					],
				},
				{ // SCSS LOADER
					test: /\.scss$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
								localIdentName: '[name]__[local]___[hash:base64:5]',
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins() {
									return [
										autoprefixer,
									];
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								data: '@import "global/f2f-global";',
								includePaths: [
									path.resolve(__dirname, 'src', 'static', 'styles'),
								],
							},
						},
					],
				},
				{	// IMAGE LOADER
					test: /\.(jpe?g|png|gif|svg)$/,
					loader: 'file-loader?name=img/[hash].[ext]',
				},
				{	// AUDIO LOADER
					test: /\.mp3$/,
					loader: 'file-loader?name=audio/[hash].[ext]',
				},
				cmdArgs instanceof Object && cmdArgs.eslint ? {
					// Javascript eslint
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'eslint-loader',
					options: {
						failOnWarning: false,
						failOnError: false,
					},
				} : {},
			],
		},
		plugins: plugins(envVars, environment),
	};
};
