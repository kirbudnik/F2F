import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import Avatar from 'components/Avatar';
import Spinner from 'components/Spinner';
import { ChevronLeft, ChevronRight } from 'components/Icons';
import defaultImage from 'images/banner/default-poligon.jpg';
import styles from './Discover.scss';

const arrowProps = {
	strokeWidth: 2,
	size: 26,
};

const CarouselArrow = ({
	direction,
	className,
	onClick,
}) => (
	<div className={className} onClick={onClick}>
		{direction === 'left' ?
			<ChevronLeft {...arrowProps} /> :
			<ChevronRight {...arrowProps} />
		}
	</div>
);

CarouselArrow.propTypes = {
	className: PropTypes.string,
	direction: PropTypes.oneOf(['left', 'right']).isRequired,
	onClick: PropTypes.func,
};

const settings = {
	dots: false,
	infinite: true,
	responsive: [
		{
			breakpoint: 768,
			settings: { slidesToShow: 1, centerMode: true, arrows: false },
		},
		{
			breakpoint: 1024,
			settings: { slidesToShow: 3, centerMode: false },
		},
		{
			breakpoint: 1920,
			settings: { slidesToShow: 3, centerMode: true },
		},
		{
			breakpoint: 2400,
			settings: { slidesToShow: 5, centerMode: false },
		},
	],
	autoplay: true,
	autoplaySpeed: 5000,
	touchThreshold: 100,
	speed: 300,
	slidesToShow: 5,
	slidesToScroll: 1,
	swipeToSlide: true,
	centerMode: true,
	nextArrow: <CarouselArrow direction="right" />,
	prevArrow: <CarouselArrow direction="left" />,
};


class Discover extends React.Component {
	constructor(props) {
		super(props);

		this.isDragging = false;

		this.settings = {
			...settings,
			beforeChange: () => {
				this.isDragging = true;
			},
			afterChange: () => {
				this.isDragging = false;
			},
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isOpen && !this.props.isOpen) {
			// We already manage loadings in discovery epic
			this.props.loadAttempt();
		}
	}

	render() {
		const {
			channels,
			isLoading,
			isLoadingError,
			isOpen,
			loadAttempt,
			history,
			channelClick,
		} = this.props;

		return (
			<div className={classNames(styles.wrap, isOpen && styles.isOpen)}>
				{!isLoadingError && !isLoading && !!channels.length &&
					<Slider {...this.settings} className={styles.inner}>
						{channels.map(({
							avatarSrc,
							channelName,
							coverSrc,
							isLive,
							link,
							username,
						}) => (
							<div key={link}>
								<div
									className={styles.slide}
									style={{
										backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .1) 60%, rgba(0, 0, 0, .35) 100%), url(${coverSrc || defaultImage})`,
									}}
									onClick={() => {
										if (!this.isDragging) {
											channelClick();
											history.push(link);
										}
									}}
								>
									<div className={styles.info}>
										<Avatar
											src={avatarSrc}
											title={username}
											size="small"
											className={styles.avatar}
										/>
										{isLive && <span className={styles.isLive}>LIVE</span>}
										<h4>{channelName}</h4>
									</div>
								</div>
							</div>
						))}
					</Slider>
				}
				{isLoadingError &&
					<div className={styles.message}>
						<span>Something wrong. Please <a onClick={loadAttempt}>try again</a></span>
					</div>
				}
				{!isLoadingError && !isLoading && !channels.length &&
					<div className={styles.message}>
						<span>We did not find any channels.<br /> Try again later.</span>
					</div>
				}
				{isLoading && <Spinner className={styles.spinner} />}
			</div>
		);
	}
}

Discover.propTypes = {
	history: PropTypes.shape().isRequired,
	channels: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string.isRequired,
		channelName: PropTypes.string.isRequired,
		link: PropTypes.string.isRequired,
		avatarSrc: PropTypes.string,
		coverSrc: PropTypes.string,
		isLive: PropTypes.bool,
	})),
	isLoading: PropTypes.bool.isRequired,
	isLoadingError: PropTypes.bool.isRequired,
	isOpen: PropTypes.bool.isRequired,
	loadAttempt: PropTypes.func.isRequired,
	channelClick: PropTypes.func.isRequired,
};

export default withRouter(Discover);
