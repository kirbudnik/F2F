import React from 'react';
import { storiesOf } from '@storybook/react';
import { color, number, select, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import * as Icons from '..';

storiesOf('Icons', module)
	.addDecorator(withKnobs)
	.addDecorator(getStory => (
		<div style={{ textAlign: 'center', color: '#999' }}>
			{getStory()}
		</div>
	))

	.add('Icon props', withInfo({
		text: 'Show vector icon',
	})(() => (
		React.createElement(
			Icons[select('icon', Object.keys(Icons), 'MicOff')],
			{
				color: color('color', '#000'),
				size: number('size', 44),
				strokeWidth: number('strokeWidth', 1),
				fill: color('fill', '#fff'),
			},
		)
	)))

	.add('All icons', withInfo({
		text: 'Show all icons',
	})(() => (
		<div>
			{Object.keys(Icons).map(icon =>
				<div key={icon} style={{ display: 'inline-block', width: 160 }}>
					<h2>{icon}</h2>
					<p>
						{React.createElement(Icons[icon], {
							color: '#999',
							size: 33,
							strokeWidth: 1,
							fill: '#fff',
						})}
					</p>
				</div>,
			)}
		</div>
	)));
