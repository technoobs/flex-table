import React from 'react';

class TableCellElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cellId: "col-" + this.props.cellId,
      inputId: "col-input-" + this.props.cellId,
      isRequired: this.props.isRequired,
      value: '',
      hasInput: false,
      isValid: (this.props.isRequired) ? (false) : (true)
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkInput = this.checkInput.bind(this);
    this.getValidStatus = this.getValidStatus.bind(this);
    this.getCellValue = this.getCellValue.bind(this);
  }

  handleInputChange(e) {
    if(this.state.isRequired) {
      if(e.target.value == 'undefined' || e.target.value == "") {
        this.setState({
          isValid: false
        });
      } else {
        this.setState({
          isValid: true
        });
      }
    }
  }

  // Check input
  checkInput() {
    let cellValue = document.getElementById(this.state.inputId).value;
    if(this.state.isRequired) { // this cell must have a value
      if(cellValue.trim() == 'undefined' || cellValue.trim() == "") {
        this.setState({
          isValid: false
        });
      } else {
        this.setState({
          value: cellValue,
          isValid: true
        });
      }
    } else {
      this.setState({
        value: cellValue,
        isValid: true
      });
    }
  }

  // Get current cell valid status
  getValidStatus() {
    this.checkInput();
    return this.state.isValid;
  }

  // Get current cell value
  getCellValue() {
    let cellData = {};
    cellData.cellName = this.props.cellName;
    cellData.cellValue = this.state.value;
    return cellData;
  }

  render() {
    const inputMsg = (this.state.isRequired) ? ("Required Field") : ("");
    return(
      <td id={this.state.cellId}>
        <div className="cell-element">
          <input
            id={this.state.inputId}
            type="text"
            placeholder={inputMsg}
            onChange={this.checkInput}>
          </input>
        </div>
      </td>
    )
  }
}

export default TableCellElement;
