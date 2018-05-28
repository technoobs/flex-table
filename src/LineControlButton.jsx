import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap/lib/';

import ExportButton from './ExportButton.jsx';

class LineControlButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }


  render() {
    return(
      <ButtonToolbar className={this.props.className}>
        <div>
          <Button bsStyle="danger" onClick={this.props.deleteLine} className="example-btn">
            Delete Line
          </Button>
          <Button bsStyle="success" onClick={this.props.addNewLine} className="example-btn">
            Add New Line
          </Button>
          <ExportButton exportValue={this.props.exportValue} className="example-btn"/>
        </div>
      </ButtonToolbar>
    )
  }
}

export default LineControlButton;
