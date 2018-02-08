

module.exports = ({ config, InfusionSoftAPI, error, log }) => {
	const { ENVIRONMENT, INFUSIONSOFT } = config;
	const {
		ACTIVE_GROUP,
		CONFIRMED_GROUP,
		BROADCASTER_GROUP,
		BROADCAST_STARTED_GROUP,
	} = INFUSIONSOFT;

	const InfusionSoftSDK =
		new InfusionSoftAPI.DataContext(INFUSIONSOFT.APP_NAME, INFUSIONSOFT.API_KEY);

	const events = {
		signup(message) {
			const contact = {
				FirstName: message.firstName,
				_F2FUserId: message.userId,
				Email: message.email,
			};
			if (message.refCode) {
				// eslint-disable-next-line no-underscore-dangle
				contact._F2FReferringBroadcaster = message.refCode;
			}

			InfusionSoftSDK.ContactService
				.add(contact)
				.then(() => {
					InfusionSoftSDK.Contacts
						// eslint-disable-next-line no-underscore-dangle
						.where('_F2FUserId', message.userId)
						.first()
						.then((newContact) => {
							InfusionSoftSDK.ContactService
								.addToGroup(newContact.Id, ACTIVE_GROUP);
							InfusionSoftSDK.APIEmailService
								.optIn(message.email, 'signUp');
						})
						.fail(err => error('InfusionSoft active group', err));
				})
				.catch(err => error('InfusionSoft add contact', err));
		},
		setUsername(message) {
			InfusionSoftSDK.Contacts
				.where('_F2FUserId', message.userId)
				.first()
				.then(contact =>
					InfusionSoftSDK.ContactService
						.update(contact.Id, { Username: message.username })
						.then(() => InfusionSoftSDK.ContactService
							.addToGroup(contact.Id, CONFIRMED_GROUP),
						),
				)
				.fail(err => error('InfusionSoft confirmed group', err));
		},
		startBroadcast(message) {
			if (message.broadcastCount === 1) {
				// Tag a user when they start their first broadcast
				InfusionSoftSDK.Contacts
					.where('_F2FUserId', message.userId)
					.first()
					.then(contact =>
						InfusionSoftSDK.ContactService
							.addToGroup(contact.Id, BROADCASTER_GROUP),
					)
					.fail(err => error('InfusionSoft first broadcast', err));
			}

			InfusionSoftSDK.Contacts
				.where('_F2FUserId', message.userId)
				.first()
				.then(contact =>
					InfusionSoftSDK.ContactService
						.addToGroup(contact.Id, BROADCAST_STARTED_GROUP),
				)
				.fail(err => error('InfusionSoft start broadcast', err));
		},
	};

	function event(eventName, message) {
		if (eventName in events) {
			events[eventName](message);
			log('Event', eventName, message);
		}
	}

	function devEvent(eventName, message) {
		if (eventName in events) {
			log('Event', eventName, message);
		}
	}

	return ENVIRONMENT === 'production' ? event : devEvent;
};
