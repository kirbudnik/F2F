import React from 'react';
import Info from 'templates/Info';
import Button from 'components/Button';
import { Mail } from 'components/Icons';
import styles from './Contact.scss';

const Contact = () => (
	<Info>
		<h1>Contact</h1>
		<p>Please get in touch if you have a suggestion, need some help,
		or want to let us know if you&apos;re enjoying the service</p>
		<div className={styles.btnWrap}>
			<Button type="orange" href="mailto:contact@f2f.live" className={styles.button}>
				<Mail size={18} strokeWidth={2} /> EMAIL US
			</Button>
		</div>
		<span className="text-orange">contact@f2f.live</span>
	</Info>
);

export default Contact;
