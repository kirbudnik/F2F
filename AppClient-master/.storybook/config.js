import { configure, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import 'rxjs';
import '../src/static/styles/styles.scss';
import '../src/mockRequests';

setAddon(infoAddon);

const req = require.context('../src', true, /\.stories\.js$/);

configure(() => req.keys().forEach(req), module);
