/* eslint react/display-name: off, react/prop-types: off */
import React from 'react';
import { Link } from 'react-router-dom';
import { alertTypes } from 'constants/index';

export default {
	// Tests
	TEST_ERROR: {
		text: () => <span>Test <strong>error!</strong></span>,
		type: alertTypes.ERROR,
	},
	TEST_SUCCESS: {
		text: () => <span>Test <strong>success!</strong></span>,
		type: alertTypes.SUCCESS,
	},
	TEST_INFO: {
		text: () => <span>Test <strong>information!</strong></span>,
		type: alertTypes.INFO,
	},

	// Generic
	SERVER_ERROR: {
		text: () => <span>Something isn&apos;t quite working right on our end. Sorry about that :(
			Please <Link to="/contact">contact us</Link> if this persists.</span>,
		type: alertTypes.ERROR,
	},
	REQUEST_TIMEOUT: {
		text: () => <span>We&apos;re having trouble connecting you to our servers.<br/><br/>This is
			commonly caused by an unstable internet connection. If your connection is alive and well
			then this is likely a problem on our end. Please
			{' '}<Link to="/contact">contact us</Link> if you need help.</span>,
		type: alertTypes.ERROR,
	},
	LOGIN_REQUIRED: {
		text: () => <span>We&apos;re having trouble identifying you. Is it possible you
			logged out from another tab? Please refresh the page and log back in.</span>,
		type: alertTypes.INFO,
	},

	// Broadcast
	START_BROADCAST_FAILED: {
		text: () => <span>We&apos;re having trouble starting a broadcast for you right now.
			First, try refreshing the page and having another go.
			If this continues, please <Link to="/contact">let us know</Link> and we&apos;ll
			look into it immediately.</span>,
		type: alertTypes.ERROR,
	},

	// Settings
	STRIPE_LINK_SUCCESS: {
		text: () => <span>Woohoo! You&apos;re all set up to take payments with Stripe.</span>,
		type: alertTypes.SUCCESS,
	},
	STRIPE_LINK_FAILED: {
		text: () => <span>An error occured while trying to link your Stripe account. Please
			try it again and <Link to="/contact">contact us</Link> if this persists.</span>,
		type: alertTypes.ERROR,
	},
	STRIPE_UNLINK_SUCCESS: {
		text: () => <span>We&apos;ve unlinked your Stripe account.
			You can still view all of your
			{' '}<Link to="/settings/payments/transactions">transactions</Link>
			{' '}at any time.</span>,
		type: alertTypes.SUCCESS,
	},
	STRIPE_UNLINK_FAILED: {
		text: () => <span>An error occured while trying to unlink your Stripe account. Please
			try it again and <Link to="/contact">contact us</Link> if this persists.</span>,
		type: alertTypes.ERROR,
	},

	// Payments
	PAY_SUCCESS: {
		text: ({ username }) => <span>{username} has received your payment. Thank you.</span>,
		type: alertTypes.SUCCESS,
	},
	PAY_CARD_ERROR: {
		text: ({ message }) => <span>Your payment has failed for the following reason:<br/>
			{message}</span>,
		type: alertTypes.ERROR,
	},
	PAY_FAILED: {
		text: () => <span>Unable to process the payment because your connection failed.
			Please try again.</span>,
		type: alertTypes.ERROR,
	},
	PAY_NOT_SET_UP: {
		text: () => <span>It looks like this user is not completely set up to take payments
			right now. Your card has not beed charged.</span>,
		type: alertTypes.ERROR,
	},

	// User
	LOGIN_FAILED: {
		text: () => <span>We&apos;re having trouble logging you in.
			Please try refreshing the page or logging in with a different account and
			{' '}<Link to="/contact">contact us</Link> if this continues.</span>,
		type: alertTypes.ERROR,
	},
	LOGIN_PERMISSIONS_DENIED: {
		text: () => <span>We ask for a few basic permissions to give you the best possible
			user experience. If you can&apos;t grant us those permissions then you won&apos;t be
			able to use F2F. If you&apos;d like more information, please see our
			{' '}<Link to="/terms">terms of service</Link>.</span>,
		type: alertTypes.INFO,
	},
	IMG_UPLOAD_FAILED: {
		text: () => <span>We&apos;re having trouble saving your image.
			Please <Link to="/contact">contact us</Link> if this continues to occur.</span>,
		type: alertTypes.ERROR,
	},
	SAVE_TEXT_FAILED: {
		text: () => <span>We&apos;re having trouble saving your text to our server.
			If this continues, please save your text somewhere else so you don&apos;t lose
			it and <Link to="/contact">contact us</Link>.</span>,
		type: alertTypes.ERROR,
	},
	DELETE_CHANNEL_FAILED: {
		text: () => <span>We&apos;re having trouble deleting your channel.
			Please <Link to="/contact">contact us</Link> if this continues to occur.</span>,
		type: alertTypes.ERROR,
	},
};
