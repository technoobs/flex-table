import React from 'react';

import TableCellElement from './TableCellElement.jsx';
import RowCheckBox from './RowCheckBox.jsx';

class TableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowId: this.props.rowId,
      colNum: [],
      notNullNum: [],
      hasInput: false,
      notNullStatus: [], // need action to alter value in specific position
      isValid: false
    };

    // this.populateColumn = this.populateColumn.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.updateCellValidation = this.updateCellValidation.bind(this);
    this.getRowStatus = this.getRowStatus.bind(this);
    this.getSelectedRowStatus = this.getSelectedRowStatus.bind(this);
    this.getCellsValue = this.getCellsValue.bind(this);

    this.simpleTest = this.simpleTest.bind(this);
  }

  simpleTest() {
    console.log("<TableRow> Simple self test");
  }



  handleInput(e) {
    console.log("Handle input function: " + e.target.value);
    if(typeof e.target.value != 'undefined') {
      this.setState({
        hasInput: true
      });
    }
  }

  // Validate required field **pass to cell element**
  updateCellValidation(cellId, status) {
    if(this.state.indexOf(cellId) != -1) {
      this.setState({
        isValid: status
      });
    }
  }

  // Select rows action
  getSelectedRowStatus() {
    return this.refs["checkbox"].getRowSelectStatus();
  }

  // Get the valid status of row
  getRowStatus() {
    let cellRefStatusArray = []; // array to store valid status of all not null cells
    if(this.state.notNullNum == "") {
      cellRefStatusArray.push(true);
    } else {
      for(let ref in this.refs) {
        if(this.state.notNullNum.indexOf(parseInt(ref)) != -1) {
          let cellStatus = this.refs[ref].getValidStatus();
          cellRefStatusArray.push(cellStatus);
        }
      }
    }
    return (cellRefStatusArray.indexOf(false) != -1) ? (false) : (true);
  }

  // Get values from all cells
  getCellsValue() {
    let rowData = [];
    for(let ref in this.refs) {
      if(ref != "checkbox") {
        let cellValue = this.refs[ref].getCellValue();
        rowData.push(cellValue);
      }
    }
    return rowData;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      colNum: nextProps.colNum,
      notNullNum: nextProps.notNullColNum,
      isValid: (nextProps.notNullColNum != "") ? (false) : (true)
    };
  }

  render() {
    const rowCellGroup = this.state.colNum.map((cell, index) => {
      let cellEstimatedId = index + 1;
      let cellId = this.state.rowId + "-" + cellEstimatedId;
      const requiredCell = (this.state.notNullNum.indexOf(cellEstimatedId) != -1) ?
      (true) : (false);

      return <TableCellElement
        key={index}
        ref={cellEstimatedId}
        cellId={cellId}
        cellName={this.props.colName[index]}
        isRequired={requiredCell}
        handleInput={this.handleInput}
        handleValidation={this.updateCellValidation} />
    });

    return(
      <tr>
        <RowCheckBox
          ref="checkbox"
          rowId={this.state.rowId}
          selectRows={this.props.selectRows} />
        {rowCellGroup}
      </tr>
    )
  }
}

export default TableRow;
