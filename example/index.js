import React from "react";
import ReactDOM from "react-dom";
import Drawer from '../src/index';
import style from './index.css';

class App extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		}
	}

	closeDrawer = () => {
		this.setState({isOpen: false});
	}

	openDrawer = () => {
		this.setState({isOpen: true});
	}

	render() {
		return (
			<div>
				<Drawer isOpen={this.state.isOpen} closeDrawer={this.closeDrawer} openDrawer={this.openDrawer}>
					<div className={style.menu}>
						<ul className={style.list}>
							<li className={style.item} onClick={this.closeDrawer}><a href="#">Menu item 1</a></li>
							<li className={style.item} onClick={this.closeDrawer}><a href="#">Menu item 2</a></li>
							<li className={style.item} onClick={this.closeDrawer}><a href="#">Menu item 3</a></li>
							<li className={style.item} onClick={this.closeDrawer}><a href="#">Menu item 4</a></li>
							<li className={style.item} onClick={this.closeDrawer}><a href="#">Menu item 5</a></li>
						</ul>
					</div>
				</Drawer>
				<button onClick={this.openDrawer}>Open Drawer</button>
				<div className={style.content}></div>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById("app"));