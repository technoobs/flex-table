import React from 'react';

import TableRow from './TableRow.jsx';

class TableRowController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowNum: [],
      rowHeaders: [],
      colId: this.props.colId,
      notNullField: this.props.requiredColumnId,
      rowSelected: [],
      rowsToHide: []
    };
    this.getAllRowsValidStatus = this.getAllRowsValidStatus.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
    this.collectSelectedRows = this.collectSelectedRows.bind(this);
    this.exportRowsValue = this.exportRowsValue.bind(this);
  }

  // Collect information about selected rows
  collectSelectedRows(action, rowNumber) {
    if(action == "delete") {
      if(this.state.rowsToHide.indexOf(rowNumber) == -1) {
        this.setState(prevState => ({
          rowsToHide: [...prevState.rowsToHide, rowNumber]
        }));
      }
    } else if(action == "export") {
      if(this.state.rowSelected.indexOf(rowNumber) == -1) {
        this.setState(prevState => ({
          rowSelected: [...prevState.rowSelected, rowNumber]
        }));
      }
    }
  }

  // Delete specific rows
  deleteRows() {
    for(let ref in this.refs) {
      let result = this.refs[ref].getSelectedRowStatus();
      if(result != 0) {
        this.collectSelectedRows("delete", result);
      }
    }
  }

  // Get all values of selected rows
  exportRowsValue(exportTarget) {
    var data = [];
    let selectedRows = [];
    for(let ref in this.refs) {
      let result = this.refs[ref].getSelectedRowStatus();
      if(result != 0) {
        selectedRows.push(result);
      }
    }

    if(selectedRows.length == 0) {
      let i = 1;
      for(let ref in this.refs) {
        let rowId = this.refs[ref].state.rowId;
        let rowValue = this.refs[ref].getCellsValue();
        data.push(rowValue);
      }
    } else {
      for(let ref in this.refs) {
        let rowId = this.refs[ref].state.rowId;
        if(selectedRows.indexOf(rowId) != -1) {
          let rowValue = this.refs[ref].getCellsValue();
          data.push(rowValue);
        }
      }
    }
    exportTarget["data"] = data;

    console.log(JSON.stringify(exportTarget));
    console.log(JSON.parse(JSON.stringify(exportTarget)));

    return exportTarget;
  }

  // Get all rows valid status
  getAllRowsValidStatus() {
    let rowsStatusArray = []; // array to store valid status of all rows
    for(let ref in this.refs) {
      rowsStatusArray.push(this.refs[ref].getRowStatus());
    }
    return (rowsStatusArray.indexOf(false) != -1) ? (false) : (true);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      rowNum: nextProps.rowNum,
      rowHeaders: nextProps.rowHeaders,
      colId: nextProps.colId,
      notNullField: nextProps.requiredColumnId
    };
  }

  render() {
    const tableRows = this.state.rowNum.map((row, index) => {
      return (this.state.rowsToHide.indexOf(index + 1) != -1) ?
      (null) : (<TableRow
        key={index}
        ref={"row-" + (index + 1)}
        rowId={index + 1}
        colNum={this.state.colId}
        colName={this.state.rowHeaders}
        notNullColNum={this.state.notNullField}
        selectRows={this.collectSelectedRows} />);
    });

    return(
      <tbody>{tableRows}</tbody>
    )
  }
}

export default TableRowController;
