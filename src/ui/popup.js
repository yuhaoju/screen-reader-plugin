import React from 'react';
import ReactDOM from 'react-dom';
import { Slider, Switch } from 'antd';

import 'antd/dist/antd.css';
import './popup.css'

class App extends React.Component {
  state = {
    isSwitchOn: false,
    pitch: 0.8,
    rate: 0.8,
  };

  handleSiwtchChange = (value) => {
    this.setState({ isSwitchOn: value });
  };

  handleRateChange = (value) => {
    this.setState({ rate: value });
  };

  handlePitchChange = (value) => {
    this.setState({ pitch: value });
  };

  render() {
    const { pitch, rate } = this.state;
    return (
      <div className="container">
        <div className="row">
          <span className="option-name">Auto-read</span>
          <Switch checkedChildren="on" unCheckedChildren="off" onChange={this.handleSiwtchChange} />
        </div>
        <div className="row">
          <span className="option-name">Rate </span>
          <Slider
            min={0}
            max={1}
            onChange={this.handleRateChange}
            value={typeof rate === 'number' ? rate : 0}
            step={0.1}
          />
        </div>
        <div className="row">
          <span className="option-name">Pitch </span>
          <Slider
            min={0}
            max={1}
            onChange={this.handlePitchChange}
            value={typeof pitch === 'number' ? pitch : 0}
            step={0.1}
          />
        </div>
      </div>
    );
  }
}

// create wrapper
const wrapper = document.createElement('div');
wrapper.id = 'root';
document.body.appendChild(wrapper);
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
