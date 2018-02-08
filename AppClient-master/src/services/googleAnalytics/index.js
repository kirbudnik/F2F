import reactGa from 'react-ga';
import history from 'history';


const options = process.env.NODE_ENV === 'development'
	? {
		gaOptions: {
			// To work on localhost
			cookieDomain: 'none',
		},
	}
	: {};


reactGa.initialize(process.env.GA_TRACKING_ID, options);

// Log page view events
history.listen((location) => {
	reactGa.set({ page: location.pathname });
	reactGa.pageview(location.pathname);
});


export default {
	// See https://github.com/react-ga/react-ga for list of arguments
	event(args) {
		reactGa.event(args);
	},
};
