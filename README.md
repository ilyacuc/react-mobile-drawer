# react-mobile-drawer
Simple react drawer component with touch events support

Example: https://ilyacuc.github.io/react-mobile-drawer/

**Usage**
```javascript
   import React from "react";
   import ReactDOM from "react-dom";
   import Drawer from 'react-mobile-drawer';
   
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
   					<div>Menu content here</div>
   				</Drawer>
   				<button onClick={this.openDrawer}>Open Drawer</button>
   				<div>Main content here</div>
   			</div>
   		);
   	}
   }
   
   ReactDOM.render(<App/>, document.getElementById("app"));
```
