import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import FlatButton from 'components/FlatButton';
import Modal from 'components/Modal';
import { RotateCW } from 'components/Icons';
import styles from './ImageUpload.scss';

const accept = '.png,.jpeg,.jpg,.gif';

class ImageUpload extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			crop: {},
			isModalOpen: false,
		};

		this.reader = new FileReader();

		this.reader.onloadend = () => {
			const image = new Image();
			image.src = this.reader.result;

			// To know image height and width we are waiting for image.onload
			image.onload = () => {
				const { height, width } = image;
				this.setState({
					crop: this.defaultCrop(width, height),
					src: this.reader.result,
					isModalOpen: true,
				});
			};
		};

		this.getPixelCrop = this.getPixelCrop.bind(this);
		this.attachImage = this.attachImage.bind(this);
		this.cropAndSubmit = this.cropAndSubmit.bind(this);
		this.onCropChange = this.onCropChange.bind(this);
		this.rotate = this.rotate.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.imageLoaded = this.imageLoaded.bind(this);
	}

	getPixelCrop(crop) {
		const { image } = this;
		return {
			x: Math.round(image.naturalWidth * (crop.x / 100)),
			y: Math.round(image.naturalHeight * (crop.y / 100)),
			width: Math.round(image.naturalWidth * (crop.width / 100)),
			height: Math.round(image.naturalHeight * (crop.height / 100)),
		};
	}

	attachImage(e) {
		e.preventDefault();
		const file = e.target.files[0];

		this.reader.readAsDataURL(file);
		e.target.value = null;
	}

	cropAndSubmit() {
		const pixelCrop = this.getPixelCrop(this.state.crop);

		const canvas = document.createElement('canvas');
		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;
		const ctx = canvas.getContext('2d');

		ctx.drawImage(
			this.image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height,
		);

		canvas.toBlob((file) => {
			file.name = 'image.jpg'; // eslint-disable-line no-param-reassign
			this.props.onFileReady(file);

			this.setState({ isModalOpen: false });
		}, 'image/jpeg');
	}

	defaultCrop(width, height) {
		const { aspect } = this.props;

		return makeAspectCrop({
			aspect: this.props.aspect,
			x: 0,
			y: 0,
			width: width / height < aspect && 100,
			height: width / height >= aspect && 100,
		}, width / height);
	}

	onCropChange(crop) {
		this.setState({ crop });
	}

	rotate() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const image = new Image();
		image.src = this.state.src;

		image.onload = () => {
			canvas.width = image.height;
			canvas.height = image.width;
			ctx.setTransform(0, 1, -1, 0, image.height, 0);
			ctx.drawImage(image, 0, 0);
			this.setState({
				crop: this.defaultCrop(canvas.width, canvas.height),
				src: canvas.toDataURL(),
			});
		};
	}

	toggleModal() {
		this.setState({ isModalOpen: !this.state.isModalOpen });
	}

	imageLoaded(image) {
		this.image = image;
	}

	render() {
		const { children, className, id } = this.props;
		const { crop, isModalOpen, src } = this.state;

		return (
			<div>
				<label htmlFor={id} className={classNames(styles.label, className)}>
					{children}
					<input
						id={id}
						type="file"
						accept={accept}
						className={styles.input}
						onChange={this.attachImage}
					/>
				</label>
				<Modal isOpen={isModalOpen} onRequestClose={this.toggleModal}>
					{src && <ReactCrop
						crop={crop}
						src={src}
						onChange={this.onCropChange}
						onImageLoaded={this.imageLoaded}
					/>}
					<div className={styles.buttons}>
						<FlatButton onClick={this.rotate}>
							<RotateCW strokeWidth={2.4} size={14} />
						</FlatButton>
						<FlatButton onClick={this.cropAndSubmit} disabled={!crop.width} color="primary">
							Submit
						</FlatButton>
					</div>
				</Modal>
			</div>
		);
	}
}

ImageUpload.propTypes = {
	aspect: PropTypes.number,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	onFileReady: PropTypes.func.isRequired,
};

ImageUpload.defaultProps = {
	aspect: 1 / 1,
};

export default ImageUpload;
