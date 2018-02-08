import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
	MAX_PAY_DESC_TEXT_LEN,
	MAX_PAY_BTN_TEXT_LEN,
	PAY_BTN_COLORS,
	MAX_PAYMENT,
} from 'constants/settings';
import PayButton from 'components/PayButton';
import FlatButton from 'components/FlatButton';
import Switch from 'components/Switch';
import { Stripe } from 'components/Icons';
import styles from './Payments.scss';


const centsToDollars = cents => parseFloat((cents / 100).toFixed(2));
const zeroToMax = amount => parseInt(Math.min(Math.max(amount, 0), MAX_PAYMENT), 10);

function openStripeDashboard() {
	const win = window.open(null, '_blank');
	win.opener = null;
	win.location = 'https://dashboard.stripe.com/dashboard';
}

class Payments extends React.PureComponent {
	constructor(props) {
		super(props);

		this.btnTextChange = this.btnTextChange.bind(this);
		this.descriptionTextChange = this.descriptionTextChange.bind(this);
		this.isCustomAmountOnChange = this.isCustomAmountOnChange.bind(this);
		this.amountChange = this.amountChange.bind(this);
		this.amount1Change = this.amount1Change.bind(this);
		this.amount2Change = this.amount2Change.bind(this);
		this.amount3Change = this.amount3Change.bind(this);
		this.btnLocationsBroadcastChange = this.btnLocationsBroadcastChange.bind(this);
		this.btnLocationsChannelChange = this.btnLocationsChannelChange.bind(this);
		this.btnLocationsProfileChange = this.btnLocationsProfileChange.bind(this);
	}

	componentWillMount() {
		this.props.loadData({ page: 'pay' });
	}

	btnTextChange(e) {
		this.props.onChange('btnText', e.target.value.slice(0, MAX_PAY_BTN_TEXT_LEN));
	}

	descriptionTextChange(e) {
		this.props.onChange('descriptionText', e.target.value.slice(0, MAX_PAY_DESC_TEXT_LEN));
	}

	isCustomAmountOnChange() {
		this.props.onChange('isCustomAmountOn', !this.props.settings.isCustomAmountOn);
	}

	amountChange(index, value) {
		this.props.onChange(
			'presetAmounts',
			Object.assign(
				[],
				this.props.settings.presetAmounts,
				{ [index]: zeroToMax(value * 100) },
			),
		);
	}

	// TODO - Must be > 1$
	amount1Change(e) {
		this.amountChange(0, e.target.value);
	}

	amount2Change(e) {
		this.amountChange(1, e.target.value);
	}

	amount3Change(e) {
		this.amountChange(2, e.target.value);
	}

	btnLocationsBroadcastChange() {
		const { btnLocations } = this.props.settings;
		this.props.onChange(
			'btnLocations',
			{ ...btnLocations, broadcast: !btnLocations.broadcast },
			{ noDebounce: true },
		);
	}

	btnLocationsChannelChange() {
		const { btnLocations } = this.props.settings;
		this.props.onChange(
			'btnLocations',
			{ ...btnLocations, channel: !btnLocations.channel },
			{ noDebounce: true },
		);
	}

	btnLocationsProfileChange() {
		const { btnLocations } = this.props.settings;
		this.props.onChange(
			'btnLocations',
			{ ...btnLocations, profile: !btnLocations.profile },
			{ noDebounce: true },
		);
	}

	render() {
		const {
			settings,
			username,
			channels,
			onChange,
			linkStripe,
			unlinkStripe,
		} = this.props;

		const {
			btnColor,
			btnText,
			btnLocations,
			isCustomAmountOn,
			descriptionText,
			isStripeConnected,
			presetAmounts,
		} = settings;

		return (
			<div>
				<div>
					<h4>Stripe Account</h4>
					<div className={styles.stripe}>
						{isStripeConnected &&
							<div>
								<div>
									<p>Your account is linked</p>
									<FlatButton className={styles.stripeBtn} onClick={openStripeDashboard}>
										Powered by <Stripe />
									</FlatButton>
								</div>
								<div>
									<p>
										<a className={styles.unlink} onClick={unlinkStripe}>
											Unlink My Account
										</a>
									</p>
									<p>Don&apos;t worry. You won&apos;t lose any of your transactions by unlinking.
									You just won&apos;t be able to accept new payments.
									You can re-link this account or another at any time.</p>
								</div>
							</div>
						}
						{!isStripeConnected &&
							<div style={{ flexDirection: 'column' }}>
								<span>Link your account</span>
								<span>
									<FlatButton className={styles.stripeBtnConnect} onClick={linkStripe}>
										Connect with <Stripe />
									</FlatButton>
								</span>
							</div>
						}
					</div>
				</div>
				{isStripeConnected &&
					<div>
						<h4>F2F Pay Button</h4>
						<div>
							<div>
								<label>Button Text</label>
								<span
									className={classNames(
										'input-desc',
										btnText.length === MAX_PAY_BTN_TEXT_LEN && 'input-desc-error',
									)}
								>
									{btnText.length}/{MAX_PAY_BTN_TEXT_LEN}
								</span>
								<input value={btnText} onChange={this.btnTextChange} />
							</div>
							<div>
								<label>Button Color</label>
								<span>
									{PAY_BTN_COLORS.map(color => (
										<button
											key={color}
											className={styles.colorSelector}
											style={{ backgroundColor: color }}
											onClick={() => onChange('btnColor', color, { noDebounce: true })}
										/>
									))}
								</span>
							</div>
							<div>
								<label>Payment description text</label>
								<span
									className={classNames(
										'input-desc',
										descriptionText.length === MAX_PAY_DESC_TEXT_LEN && 'input-desc-error',
									)}
								>
									{descriptionText.length}/{MAX_PAY_DESC_TEXT_LEN}
								</span>
								<textarea value={descriptionText} onChange={this.descriptionTextChange} rows={3} />
							</div>
							<div>
								<label>Amount 1</label>
								<input
									value={centsToDollars(presetAmounts[0]).toString()}
									type="number"
									onChange={this.amount1Change}
								/>
							</div>
							<div>
								<label>Amount 2</label>
								<input
									value={centsToDollars(presetAmounts[1]).toString()}
									type="number"
									onChange={this.amount2Change}
								/>
							</div>
							<div>
								<label>Amount 3</label>
								<input
									value={centsToDollars(presetAmounts[2]).toString()}
									type="number"
									onChange={this.amount3Change}
								/>
							</div>
							<div>
								<label>Custom Amount</label>
								<Switch
									id="isCustomAmountOn"
									type="light"
									value={isCustomAmountOn}
									onChange={this.isCustomAmountOnChange}
								/>
							</div>
						</div>
						<div className={styles.preview}>
							<h5>Preview</h5>
							<PayButton
								btnColor={btnColor}
								btnText={btnText}
								isCustomAmountOn={isCustomAmountOn}
								descriptionText={descriptionText}
								presetAmounts={presetAmounts}
								preview
							/>
						</div>
					</div>
				}
				{isStripeConnected &&
					<div>
						<h4>Button Locations</h4>
						<div>
							<div>
								<span>Profile Page</span>
								<Link className={styles.subText} to={`/${username}`}>Go to page</Link>
								<Switch
									id="buttonProfilePage"
									type="light"
									value={btnLocations.profile}
									onChange={this.btnLocationsProfileChange}
								/>
							</div>
							<div>
								<span>Channel Page</span>
								{channels.length > 0 &&
									<Link className={styles.subText} to={`/${username}/${channels[0].name}`}>
										Go to page
									</Link>
								}
								<Switch
									id="buttonChannelPage"
									type="light"
									value={btnLocations.channel}
									onChange={this.btnLocationsChannelChange}
								/>
							</div>
							<div>
								<span>Broadcast Page</span>
								<a className={styles.subText}>
									During your broadcasts you can make the F2F Pay button visible
									(and invisible) on your Broadcaster page from the Broadcaster Settings panel.
								</a>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}

Payments.propTypes = {
	settings: PropTypes.shape({
		isStripeConnected: PropTypes.bool,
		btnColor: PropTypes.string,
		btnText: PropTypes.string.isRequired,
		descriptionText: PropTypes.string.isRequired,
		isCustomAmountOn: PropTypes.bool.isRequired,
		presetAmounts: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
		btnLocations: PropTypes.shape({
			channel: PropTypes.bool.isRequired,
			profile: PropTypes.bool.isRequired,
		}).isRequired,
	}).isRequired,
	username: PropTypes.string,
	channels: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
	})).isRequired,

	loadData: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	linkStripe: PropTypes.func.isRequired,
	unlinkStripe: PropTypes.func.isRequired,
};

Payments.defaultProps = {

};

export default Payments;
