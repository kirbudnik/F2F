import React from 'react';
import { connect } from 'react-redux';
import { userActions, userSelectors } from 'services/user';
import Landing from './Landing';

const openLoginModal = dispatch => () =>
	dispatch(userActions.toggleLoginModal({ isOpen: true }));


const mapStateToProps = store => ({
	isAuth: userSelectors.isAuth(store),
	username: userSelectors.username(store),
});


const mapDispatchToProps = dispatch => ({
	// Pass whether or not the user is logged in. This could be used to customize the UI if needed
	carouselInterval: 6000,
	slider: [
		{
			id: 'Stream',
			header: 'Stream Interactively',
			text: <p>Instantly stream from your browser. No delay. Completely interactive.</p>,
			buttonText: 'FREE. START NOW.',
			buttonOnClick: openLoginModal(dispatch),
			list: [
				'Accept Payments',
				'YouTube Live Re-streaming',
				'Live Production Tools',
			],
		},
		{
			id: 'Webinar',
			header: 'Webinars Without Limits',
			text: <p>Instantly start a webinar from your browser.</p>,
			buttonText: 'FREE. START NOW.',
			buttonOnClick: openLoginModal(dispatch),
			list: [
				'1,000,000 Attendees',
				'No Downloads',
				'Screen Sharing',
			],
		},
		{
			id: 'Teach',
			header: 'Teach Interactively',
			text: <p>Instantly create a classroom in your browser</p>,
			buttonText: 'FREE. START NOW.',
			buttonOnClick: openLoginModal(dispatch),
			list: [
				'Unlimited Class Size',
				'Text and Video Interaction',
				'Optional Recording to YouTube',
			],
		},
		{
			id: 'Meet',
			header: 'Meet With No Limits',
			text: <p>Instantly start a meeting in your browser.</p>,
			buttonText: 'FREE. START NOW.',
			buttonOnClick: openLoginModal(dispatch),
			list: [
				'Unlimited Meetings',
				'Unlimited Duration',
				'Single Click to Start a Meeting',
			],
		},
	],
	bodyTitle: 'Engage With Your Community Like Never Before',
	bodyText: <p>Trying to engage your audience? We&apos;ve got you covered.<br/><br/>
		F2F allows you to interactively entertain your audience, share your news,
		teach your class and meet with your team all using the same interface.<br/><br/>
		From 1 to 1,000,000 attendees. No lag. Completely interactive. Most major devices.
		Unlimited duration. No downloads.
		<br/><br/>F2F is free to use for as long as you like.
		</p>,
	bodyButtonText: 'GET STARTED',
	bodyButtonOnClick: openLoginModal(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
