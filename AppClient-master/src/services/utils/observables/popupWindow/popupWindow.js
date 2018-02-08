export default ({ options, Observable, openWindow, addEventListener, removeEventListener }) => {
	function getPopupHref(popup) {
		try {
			return popup.location.href;
		} catch (err) {
			// User must be on 3rd party site.
			// Can't access href because of CORS.
			return null;
		}
	}

	const popupWindow = (callbacks) => {
		const { windowName, getRedirectUrl, endUrl } = callbacks;
		// Open a popup with an empty url. It will be set shortly. Need to open
		// the popup immediately on a user gesture.
		const popup = openWindow('', windowName || 'newWindow', 'width=600,height=600');

		// Need to get the href after we have redirected back to f2f. Use two different
		// techniques. First is to simply read it directly. This will throw cross origin
		// errors while we are on the other site. A second method was added because there
		// appeared to be cases on certain devices where this was never resolving. The
		// second method is for the popup to send a window 'message' event containing it's
		// href when it has returned to f2f.
		return getRedirectUrl
			.takeWhile(() => !popup.closed)
			.do((redirectUrl) => {
				popup.location.href = redirectUrl;
			})
			.mergeMap(() => Observable.merge(
				// Technique 1
				Observable
					.interval(options.interval)
					.takeWhile(() => !popup.closed)
					.map(() => getPopupHref(popup)),
				// Technique 2
				Observable
					.fromEventPattern(
					handler => addEventListener('message', handler),
					handler => removeEventListener('message', handler),
					)
					.takeWhile(() => !popup.closed)
					// Ensure we unsub this listener after popup closes
					.takeUntil(Observable.interval(options.interval).filter(() => popup.closed))
					.pluck('data')
					.filter(msg => msg instanceof Object && msg.command === 'f2fRedirect')
					.map(msg => msg.href),
				)
				.filter(href => typeof href === 'string' && href.indexOf(endUrl) !== -1)
				.take(1)
				.do(() => popup.close()),
			)
			.catch((err) => {
				popup.close();
				throw err;
			});
	};

	return popupWindow;
};
