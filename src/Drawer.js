import React from 'react';
import PropTypes from 'prop-types';
import styles from './Drawer.css';

const SWIPE_THRESHOLD = 20;
const noop = () => {
};

export default class Drawer extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isDraw: false
		};

		this.drawerElement = React.createRef();
		this.backdropElement = React.createRef();

		this.initialX = null;
		this.initialY = null;
		this.isTouching = false;
		this.initialXShift = null;
		this.windowWidth = document.documentElement.clientWidth;

		document.addEventListener('touchstart', this.handleTouchStart, false);
		document.addEventListener('touchend', this.handleTouchEnd, false);
	}

	componentWillUnmount() {
		document.removeEventListener('touchstart', this.handleTouchStart);
		document.removeEventListener('touchmove', this.handleTouchMove);
		document.removeEventListener('touchend', this.handleTouchEnd);
	}

	closeDrawer = () => {
		this.props.closeDrawer();
	}

	openDrawer = () => {
		this.props.openDrawer();
	}

	moveDrawer = (x) => {
		if (this.drawerElement) {
			const position = Math.min(100, ((x - this.initialXShift) / (this.windowWidth * this.props.width / 100) * 100));
			const drawerPosition = position - 100;
			const backdropDegree = position / 100;
			requestAnimationFrame(() => {
				this.drawerElement.current.style.setProperty('--var-position', `${drawerPosition}%`);
				this.backdropElement.current.style.setProperty('--var-degree', `${backdropDegree}`);
			});
		}
	}

	handleTouchStart = (event) => {
		if (event.changedTouches.length === 1) {
			const touch = event.changedTouches[0];

			const touchOnLeftSide = touch.pageX < this.props.sideZoneWidth;

			if (touchOnLeftSide || this.props.isOpen) {
				this.isTouching = true;
				this.initialX = touch.pageX;
				this.initialY = touch.pageY;
				console.log({initY: touch.pageY});
				document.removeEventListener('touchmove', this.handleTouchMove);
				document.addEventListener('touchmove', this.handleTouchMove, {passive: false, capture: false});
			}
		}
	}

	handleTouchMove = (event) => {
		let isDraw = this.state.isDraw;

		if (event.changedTouches.length === 1 && this.isTouching && !isDraw) {
			const touch = event.changedTouches[0];
			let dx = touch.pageX - this.initialX;
			const direction = dx > 0 ? 'r' : 'l';
			dx = Math.abs(dx);
			const dy = Math.abs(touch.pageY - this.initialY);
			if ((dx > dy) && (dx > SWIPE_THRESHOLD) && ((direction === 'r' && !this.props.isOpen) || (direction === 'l' && this.props.isOpen))) {
				isDraw = true;
				this.initialXShift = touch.pageX - (this.props.isOpen ? (this.windowWidth * this.props.width / 100) : 0);
				this.setState({isDraw});
			}
		}

		if (isDraw) {
			event.preventDefault();
			this.moveDrawer(event.changedTouches[0].pageX);
		}
	}

	handleTouchEnd = (event) => {
		if (event.changedTouches.length === 1 && this.state.isDraw) {
			const touch = event.changedTouches[0];

			if (!this.props.isOpen && (touch.pageX - this.initialXShift > document.documentElement.clientWidth / 3)) {
				this.openDrawer();
			} else {
				if (this.props.isOpen && (touch.pageX + this.initialXShift > document.documentElement.clientWidth / 2)) {
					this.closeDrawer();
				}
			}
		}

		document.removeEventListener('touchmove', this.handleTouchMove);
		this.setState({isDraw: false});
		this.initialX = null;
		this.initialY = null;
		this.isTouching = false;
		this.initialXShift = null;
	}

	render() {
		const {isOpen, width, backdropClassName, drawerClassName, children} = this.props;
		const {isDraw} = this.state;

		return (
			<React.Fragment>
				<div
					className={`${styles.backdrop} ${backdropClassName} ${isOpen ? styles.backdrop_open : styles.backdrop_close} ${isDraw ? styles.backdrop_transition : ''}`}
					ref={this.backdropElement}
					onClick={this.closeDrawer}/>
				<div
					className={`${styles.drawer} ${drawerClassName} ${isOpen ? styles.drawer_open : ''} ${isDraw ? styles.drawer_transition : ''}`}
					ref={this.drawerElement}
					style={{width: `${width}%`}}>
					{children}
				</div>
			</React.Fragment>
		);
	}
}

Drawer.propTypes = {
	backdropClassName: PropTypes.string,
	drawerClassName: PropTypes.string,
	width: PropTypes.number,
	sideZoneWidth: PropTypes.number,
	isOpen: PropTypes.bool,
	closeDrawer: PropTypes.func,
	openDrawer: PropTypes.func,
};

Drawer.defaultProps = {
	backdropClassName: '',
	drawerClassName: '',
	width: 80,
	sideZoneWidth: 30,
	closeDrawer: noop,
	openDrawer: noop,
};