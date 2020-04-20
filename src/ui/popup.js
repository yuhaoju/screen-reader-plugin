import React from 'react';
import ReactDOM from 'react-dom';
import { Slider, Switch } from 'antd';

import 'antd/dist/antd.css';
import './popup.css'

// constants
const EXTENSION_NAME = 'Screen Reader';
const SCREEN_READER_PLUGIN_STATES = {
  isEnabled: 'isEnabled',
  pitch: 'pitch',
  rate: 'rate',
}

// setup message passing
const port = chrome.runtime.connect({ name: EXTENSION_NAME });
const passMessage = (key, value) => {
  port.postMessage(JSON.stringify({ key, value }));
}

class App extends React.Component {
  state = {
    isEnabled: JSON.parse(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.isEnabled)) !== null
              ? JSON.parse(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.isEnabled)) : true,
    rate: Number(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.rate)) || 1,
    pitch: Number(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.pitch)) || 1,
  };

  handleEnabledStatusChange = (value) => {
    this.setState({ isEnabled: value });
    passMessage(SCREEN_READER_PLUGIN_STATES.isEnabled, value);
    localStorage.setItem(SCREEN_READER_PLUGIN_STATES.isEnabled, value);
  };

  handleRateChange = (value) => {
    this.setState({ rate: value });
    passMessage(SCREEN_READER_PLUGIN_STATES.rate, value);
    localStorage.setItem(SCREEN_READER_PLUGIN_STATES.rate, value);
  };

  handlePitchChange = (value) => {
    this.setState({ pitch: value });
    passMessage(SCREEN_READER_PLUGIN_STATES.pitch, value);
    localStorage.setItem(SCREEN_READER_PLUGIN_STATES.pitch, value);
  };

  render() {
    const { isEnabled, pitch, rate } = this.state;
    return (
      <div className="container">
        <h1>Settings</h1>
        <div className="row">
          <span className="option-name">Enable screen reader</span>
          <Switch checkedChildren="on" unCheckedChildren="off" checked={isEnabled} onChange={this.handleEnabledStatusChange} />
        </div>
        <div className="row">
          <span className="option-name">Rate </span>
          <Slider
            min={0.5}
            max={2}
            onChange={this.handleRateChange}
            value={typeof rate === 'number' ? rate : 0}
            step={0.1}
          />
        </div>
        <div className="row">
          <span className="option-name">Pitch </span>
          <Slider
            min={0.5}
            max={1.2}
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