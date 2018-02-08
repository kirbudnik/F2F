export default ({
	Observable,
	combineEpics,
	url,
	popupWindow,
	expBackoff,
	// ga,
	logger,
	requests,
	notificationActions,
	userActions,
	userSelectors,
	actions,
	actionTypes,
}) => {
	const queryParamsFromHref = href => url.parse(href, true).query;
	const obsOf = action => Observable.of(action);

	const multipleEmits = (...emits) =>
		Observable.merge(...emits.map(obsOf));


	const loadData = action$ =>
		action$
			.ofType(actionTypes.LOAD_DATA)
			.pluck('payload')
			.switchMap(payload =>
				expBackoff({
					promise: () => requests.getPage(payload),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 6,
					initialDelay: 200,
				})
				.map(body => actions.loadDataSuccess({ ...body }))
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 401) {
						return obsOf(notificationActions.addMsg({ name: 'LOGIN_REQUIRED' }));
					}
					return obsOf(actions.loadDataFail(err));
				}),
			);

	const openLoginModal = (action$, store) =>
		action$
			.ofType(actionTypes.OPEN_LOGIN_MODAL)
			.map(() => store.getState())
			.filter(state => !userSelectors.isAuth(state))
			.map(() => userActions.toggleLoginModal({ isOpen: true }));

	const handleChange = action$ =>
		action$
			.ofType(actionTypes.FIELD_CHANGE)
			.pluck('payload')
			.debounce(({ options }) =>
				Observable.timer(options && options.noDebounce ? 0 : 1000))
			.map(({ page, field, value }) =>
				actions.saveData({ page, settings: { [field]: value } }));

	const saveData = action$ =>
		action$
			.ofType(actionTypes.SAVE_DATA)
			.pluck('payload')
			.mergeMap(({ page, settings }) =>
				expBackoff({
					promise: () => requests.toggleSettings({ page, settings }),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 3,
					initialDelay: 200,
				})
				.map(() => actions.saveDataSuccess())
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 401) {
						return obsOf(notificationActions.addMsg({ name: 'LOGIN_REQUIRED' }));
					}
					return Observable.empty();
				}),
			);

	const linkStripe = action$ =>
		action$
			.ofType(actionTypes.STRIPE_LINK)
			.switchMap(() => popupWindow({
				windowName: 'f2fStripe',
				getRedirectUrl:
					expBackoff({
						promise: () => requests.getStripeRedirectUrl(),
						retryWhen: err => err.statusCode >= 500,
						maxRetries: 3,
						initialDelay: 200,
					})
					.pluck('body', 'redirectUrl'),
				endUrl: 'state=stripe.',
			}))
			.map(href => queryParamsFromHref(href))
			.mergeMap(args =>
				expBackoff({
					promise: () => requests.linkStripe(args),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 3,
					initialDelay: 200,
				})
				.switchMap(() => multipleEmits(
					actions.changeField({
						page: 'pay',
						field: 'isStripeConnected',
						value: true,
					}),
					notificationActions.addMsg({ name: 'STRIPE_LINK_SUCCESS' }),
					userActions.auth(),
				))
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 401) {
						return obsOf(notificationActions.addMsg({ name: 'LOGIN_REQUIRED' }));
					}
					return obsOf(notificationActions.addMsg({ name: 'STRIPE_LINK_FAILED' }));
				}),
			);

	const unlinkStripe = action$ =>
		action$
			.ofType(actionTypes.STRIPE_UNLINK)
			.mergeMap(() =>
				expBackoff({
					promise: () => requests.unlinkStripe(),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 3,
					initialDelay: 200,
				})
				.switchMap(() => multipleEmits(
					actions.changeField({
						page: 'pay',
						field: 'isStripeConnected',
						value: false,
					}),
					notificationActions.addMsg({ name: 'STRIPE_UNLINK_SUCCESS' }),
					userActions.auth(),
				))
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 401) {
						return obsOf(notificationActions.addMsg({ name: 'LOGIN_REQUIRED' }));
					}
					return obsOf(notificationActions.addMsg({ name: 'STRIPE_UNLINK_FAILED' }));
				}),
			);


	// User finished filling out the typeform application. We should record on our servers
	// that they have submitted it.
	const appliedForPay = action$ =>
		action$
			.ofType(actionTypes.PAY_APPLIED)
			.mergeMap(() =>
				expBackoff({
					promise: () => requests.appliedForPay(),
					retryWhen: err => err.statusCode >= 500,
					maxRetries: 10,
					initialDelay: 200,
				})
				.map(() => userActions.auth())
				.catch((err) => {
					logger.error(err);
					if (err.statusCode === 401) {
						return obsOf(notificationActions.addMsg({ name: 'LOGIN_REQUIRED' }));
					}
					return Observable.empty();
				}),
			);


	return combineEpics(
		loadData,
		openLoginModal,
		handleChange,
		saveData,
		linkStripe,
		unlinkStripe,
		appliedForPay,
	);
};
