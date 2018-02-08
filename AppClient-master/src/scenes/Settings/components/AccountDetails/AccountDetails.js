import React from 'react';
import PropTypes from 'prop-types';

const AccountDetails = ({
	username,
	// settings,
	// onChange,
}) => { // eslint-disable-line arrow-body-style
	// const testChange = e => onChange('aboutMe', e.target.value);
	// const { aboutMe } = settings;

	return (
		<div>
			<div>
				<h4>General</h4>
				<div>
					<div>
						<span>Username</span>
						<span>{username}</span>
					</div>
					{ /* <div>
						<label>About me</label>
						<textarea value={aboutMe} onChange={testChange} rows={3} />
					</div> */ }
				</div>
			</div>
		</div>
	);
};

AccountDetails.propTypes = {
	username: PropTypes.string,
	settings: PropTypes.shape({
		aboutMe: PropTypes.string.isRequired,
	}).isRequired,
	onChange: PropTypes.func.isRequired,
};

export default AccountDetails;
