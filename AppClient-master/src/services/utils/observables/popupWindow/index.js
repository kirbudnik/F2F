import { Observable } from 'rxjs/Observable';
import PopupWindow from './popupWindow';


export default PopupWindow({
	Observable,
	openWindow: window.open.bind(window),
	addEventListener: window.addEventListener.bind(window),
	removeEventListener: window.removeEventListener.bind(window),
	options: {
		interval: 100,
	},
});
