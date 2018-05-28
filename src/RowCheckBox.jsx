import React from 'react';

class RowCheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowId: this.props.rowId,
      isClicked: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.getRowSelectStatus = this.getRowSelectStatus.bind(this);
  }

  handleClick() {
    this.setState({
      isClicked: (this.state.isClicked) ? (false) : (true)
    });
  }

  // Return 0 if the row is not selected, otherwise return row's id
  getRowSelectStatus() {
    if(this.state.isClicked) {
      return this.state.rowId;
    } else {
      return 0;
    }
  }

  render() {
    return(
      <td>
        <input
          type="checkbox"
          className="checkbox"
          onClick={this.handleClick}>
        </input>
      </td>
    )
  }
}

export default RowCheckBox;
