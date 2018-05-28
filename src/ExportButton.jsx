import React from 'react';
import { Button } from 'react-bootstrap/lib/';

class ExportButton extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Button
        bsStyle="info"
        className={this.props.className}
        onClick={this.props.exportValue}>
        Export Data
      </Button>
    )
  }
}

export default ExportButton;
