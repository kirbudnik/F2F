module.exports = ({ express, controller }) => {
	const { getChannels } = controller;

	const router = express.Router();

	router
		.get('/', getChannels);

	return router;
};
