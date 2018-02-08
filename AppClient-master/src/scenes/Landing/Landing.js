import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.css';
import './carousel.scss';
import Banner from './components/Banner';
import Body from './components/Body';


const Landing = ({
	isAuth,
	username,
	carouselInterval,
	slider,
	bodyTitle,
	bodyText,
	bodyButtonText,
	bodyButtonOnClick,
}) => {
	if (isAuth) {
		return <Redirect to={`/${username}`} />;
	} else if (isAuth === null) {
		return false;
	}
	return (
		<main role="main">
			<Carousel
				showThumbs={false}
				autoPlay={true}
				interval={carouselInterval}
				infiniteLoop
				showStatus={false}
			>
				{slider.map(slide => <Banner key={slide.id} {...slide} />)}
			</Carousel>
			<Body
				title={bodyTitle}
				text={bodyText}
				buttonText={bodyButtonText}
				buttonOnClick={bodyButtonOnClick}
			/>
		</main>
	);
};

Landing.propTypes = {
	isAuth: PropTypes.bool,
	username: PropTypes.string,
	carouselInterval: PropTypes.number.isRequired,
	slider: PropTypes.array.isRequired,
	bodyTitle: PropTypes.string.isRequired,
	bodyText: PropTypes.node.isRequired,
	bodyButtonText: PropTypes.string.isRequired,
	bodyButtonOnClick: PropTypes.func,
};

export default Landing;
