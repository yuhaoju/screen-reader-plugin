import React from 'react';
import ReactDOM from 'react-dom';
import { Slider, Switch } from 'antd';

import 'antd/dist/antd.css';
import './popup.css'

// constants
const EXTENSION_NAME = 'Screen Reader';
const SCREEN_READER_PLUGIN_STATES = {
  autoRead: 'autoRead',
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
    autoRead: Boolean(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.autoRead)) || false,
    rate: Number(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.rate)) || 1,
    pitch: Number(localStorage.getItem(SCREEN_READER_PLUGIN_STATES.pitch)) || 1,
  };

  handleSiwtchChange = (value) => {
    this.setState({ autoRead: value });
    passMessage(SCREEN_READER_PLUGIN_STATES.autoRead, value);
    localStorage.setItem(SCREEN_READER_PLUGIN_STATES.autoRead, value);
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
    const { autoRead, pitch, rate } = this.state;
    return (
      <div className="container">
        <div className="row">
          <span className="option-name">Auto-read</span>
          <Switch checkedChildren="on" unCheckedChildren="off" checked={autoRead} onChange={this.handleSiwtchChange} />
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