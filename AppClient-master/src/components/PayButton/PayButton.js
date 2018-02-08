import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import StripeCheckout from 'react-stripe-checkout';
import { PAY_BTN_COLORS, MIN_PAYMENT, MAX_PAYMENT } from 'constants/settings';
import { STRIPE_PUBLIC_KEY } from 'constants/pay';
import Avatar from 'components/Avatar';
import Spinner from 'components/Spinner';
import styles from './PayButton.scss';


const centsToDollars = cents => parseFloat((cents / 100).toFixed(2));
const minToMax = amount => parseInt(Math.min(Math.max(amount, MIN_PAYMENT), MAX_PAYMENT), 10);
const zeroToMax = amount => parseInt(Math.min(Math.max(amount, 0), MAX_PAYMENT), 10);

function selectMiddleNonZeroIndex(arr) {
	const filtered = arr
		.map((am, i) => ({ am, i }))
		.filter(args => args.am > 0)
		.map(args => args.i);

	return filtered.length > 0 ? filtered[Math.round((filtered.length - 1) / 2)] : null;
}

const popupAlign = (tooltipEl) => {
	const { innerWidth } = window;
	const bounds = tooltipEl.getBoundingClientRect();
	const cssPosition = {
		left: parseFloat(tooltipEl.style.left),
	};

	if (bounds.left < 10) {
		// eslint-disable-next-line no-param-reassign
		tooltipEl.style.left = `${(cssPosition.left + 10) - bounds.left}px`;
	} else if (bounds.left + bounds.width > innerWidth - 10) {
		// eslint-disable-next-line no-param-reassign
		tooltipEl.style.left = `${(cssPosition.left - 10) + (innerWidth - bounds.left - bounds.width)}px`;
	}
};

class PayButton extends React.PureComponent {
	constructor(props) {
		super(props);

		// Select the middle preset button
		const customAmount = 1000;
		const activeIndex = selectMiddleNonZeroIndex(props.presetAmounts);

		this.state = {
			activeIndex,
			customAmount,
			amount: minToMax(activeIndex !== null
				? props.presetAmounts[activeIndex]
				: customAmount),
		};

		this.afterVisibleChange = this.afterVisibleChange.bind(this);
		this.onStripeToken = this.onStripeToken.bind(this);
		this.setCustomActive = this.setCustomActive.bind(this);
		this.onCustomChange = this.onCustomChange.bind(this);
	}

	afterVisibleChange(visible) {
		if (!visible && this.props.status === 'success') {
			this.props.clearPayStatus();
		}
	}

	setActiveIndex(i) {
		this.setState({ activeIndex: i, amount: minToMax(this.props.presetAmounts[i]) });
	}

	setCustomActive() {
		this.setState({ activeIndex: null, amount: minToMax(this.state.customAmount) });
	}

	onCustomChange(e) {
		const amount = zeroToMax(e.target.value * 100);

		this.setState({
			customAmount: amount,
			...(this.state.activeIndex === null && { amount: minToMax(amount) }),
		});
	}

	onStripeToken(token) {
		this.props.payWithStripe({
			token,
			amount: minToMax(this.state.amount),
			username: this.props.username,
			broadcastId: this.props.broadcastId,
		});
	}

	render() {
		const {
			avatarSrc,
			isCustomAmountOn,
			btnColor,
			btnText,
			descriptionText,
			presetAmounts,
			preview,
			status,
			email,
			username,
		} = this.props;

		const {
			activeIndex,
			amount,
			customAmount,
		} = this.state;

		// @todo fix after resolve https://github.com/react-component/tooltip/issues/95
		const props = {};
		if (preview) {
			props.visible = true;
		}

		return (
			<Tooltip
				placement="bottom"
				overlayClassName={classNames('rc-tooltip-portal')}
				trigger={['click']}
				afterVisibleChange={this.afterVisibleChange}
				onPopupAlign={popupAlign}
				{...props}
				overlay={<div>
					{status === 'success' &&
						<div className={classNames(styles.panel, styles.success)}>
							<h2>Thank you!</h2>
							<Avatar src={avatarSrc} size="medium" title={username} className={styles.avatar} />
							<h3>{username}</h3>
							<p>received your payment.</p>
						</div>
					}
					{status === 'loading' &&
						<div className={classNames(styles.panel, styles.loading)}>
							<Spinner inline className={styles.spinner} />
							<h3>Processing...</h3>
						</div>
					}
					{!status &&
						<div className={classNames(styles.panel, preview && styles.preview)}>
							<div className={styles.desc}>{descriptionText}</div>
							<p className={styles.small}>Amount (USD)</p>
							<div className={styles.amounts}>
								{presetAmounts
									.map((am, i) => ({ am, i }))
									.filter(args => args.am > 0)
									.map(({ am, i }) => (
										// Need to preserve correct array indexes
										<button
											key={i}
											className={classNames(activeIndex === i && styles.active)}
											onClick={() => this.setActiveIndex(i)}
										>
											${centsToDollars(minToMax(am))}
										</button>
									))
								}
							</div>
							{isCustomAmountOn &&
								<label
									className={classNames(activeIndex === null && styles.active)}
									onClick={this.setCustomActive}
								>
									<span>Other</span>
									<input
										type="number"
										min="0"
										value={centsToDollars(customAmount).toString()}
										onChange={this.onCustomChange}
									/>
								</label>
							}
							{!preview &&
								<StripeCheckout
									name="F2F PAY™"
									token={this.onStripeToken}
									stripeKey={STRIPE_PUBLIC_KEY}
									amount={amount} // Cents
									currency="USD"
									allowRememberMe={false}
									email={email}
								>
									<button className={styles.payBtn}>Pay ${centsToDollars(amount)}</button>
								</StripeCheckout>
							}
							{preview &&
								<button className={styles.payBtn}>Pay ${centsToDollars(amount)}</button>
							}
						</div>
					}
				</div>
			}>
				<button
					className={classNames(styles.btn, btnColor === '#ffffff' && styles.light)}
					style={{ backgroundColor: btnColor }}
				>
					<span className={classNames(!preview && 'show-medium')}>{btnText || '$'}</span>
					{!preview && <span className="hide-medium" title={btnText}>$</span>}
				</button>
			</Tooltip>
		);
	}
}


PayButton.propTypes = {
	avatarSrc: PropTypes.string,
	btnColor: PropTypes.oneOf(PAY_BTN_COLORS).isRequired,
	btnText: PropTypes.string.isRequired,
	descriptionText: PropTypes.string.isRequired,
	isCustomAmountOn: PropTypes.bool.isRequired,
	presetAmounts: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
	preview: PropTypes.bool,
	status: PropTypes.oneOf([null, 'loading', 'success']),
	username: PropTypes.string,
	broadcastId: PropTypes.string,
	email: PropTypes.string,
	clearPayStatus: PropTypes.func.isRequired,
	payWithStripe: PropTypes.func.isRequired,
};

PayButton.defaultProps = {
	btnColor: PAY_BTN_COLORS[0],
};

export default PayButton;
