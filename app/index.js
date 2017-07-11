import React from 'react';
import PropTypes from 'prop-types';
import { getFromStorage, saveToStorage } from 'remotedev-app/lib/utils/localStorage';
import { render } from 'react-dom';
import Dock from 'react-dock';
import DevTools from 'remotedev-app';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/night.css';
import './app.css';

const dockSizeKey = 'remotedev-dock-size';

class DevToolsDock extends React.Component {
  static propTypes = {
    size: PropTypes.number,
    options: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { size: props.size || 0.5 };
  }

  handleSizeChange = (eventSize) => {
    let size = eventSize > 1 ? 1 : eventSize;
    size = size < 0.1 ? 0.1 : size;
    saveToStorage(dockSizeKey, size);
    this.setState({ size });
  };

  render() {
    return (
      <Dock
        zIndex={500} // Must be less than material-ui z-index
        position="right"
        dimMode="transparent"
        size={this.state.size}
        isVisible
        onSizeChange={this.handleSizeChange}
      >
        <div className="redux-container">
          <DevTools useCodemirror noSettings socketOptions={this.props.options} />
        </div>
      </Dock>
    );
  }
}

render(
  <DevToolsDock size={Number(getFromStorage(dockSizeKey))} options={window.remotedevOptions} />,
  document.getElementById('remote-redux-devtools-on-debugger')
);
