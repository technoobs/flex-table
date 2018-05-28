import React from 'react';

import TableTitle from './TableTitle.jsx';
import TableHeader from './TableHeader.jsx';
import TableRow from './TableRow.jsx';
import TableRowController from './TableRowController.jsx';
import LineControlButton from './LineControlButton.jsx';
import ExportButton from './ExportButton.jsx';

class FlexTable extends React.Component {
  constructor(props) {
    super(props);
    const tableTypes = ["line", "lineGroups"];
    this.state = {
      num: this.props.rowsExpand || 1,
      childCount: this.collectChildComp(),
      rows: this.props.tableRows || 1,
      headersName: [],
      columnId: [],
      requiredCol: [],
      tableType: (tableTypes.indexOf(this.props.tableType) != -1) ?
      (this.props.tableType) : ("line")
    };

    this.collectChildComp = this.collectChildComp.bind(this);
    this.updateRowNumber = this.updateRowNumber.bind(this);
    this.updateRequiredField = this.updateRequiredField.bind(this);
    this.getRequiredField = this.getRequiredField.bind(this);
    this.updateColumnId = this.updateColumnId.bind(this);
    this.getTableValidStatus = this.getTableValidStatus.bind(this);
    this.addNewLine = this.addNewLine.bind(this);
    this.deleteTableRows = this.deleteTableRows.bind(this);
    this.validateTableRowsExist = this.validateTableRowsExist.bind(this);
    this.exportValue = this.exportValue.bind(this);
    this.updateHeaderName = this.updateHeaderName.bind(this);
  }

  // Collect all available child component
  collectChildComp() {
    let num = 0;
    React.Children.forEach(this.props.children, function(child) {
      if(child.type == TableHeader) {
        num = num + 1;
      }
    });
    return num;
  }

  // Export values from table.
  // Export data from selected rows or the whole table
  exportValue() {
    this.refs["rowCtrl"].exportRowsValue(this.props.exportTarget);
  }

  // Validate table's healthy
  validateTableRowsExist() {
    this.setState({
      rows: 1
    });
  }

  // Update total number of rows that must be mapped
  updateRowNumber(num) {
    this.setState({
      rows: this.state.rows + num
    });
  }

  // Update column id
  updateColumnId(colId) {
    this.setState(prevState => ({
      columnId: [...prevState.columnId, colId]
    }));
  }

  // Update required field state
  updateRequiredField(headerId) {
    this.setState(prevState => ({
      requiredCol: [...prevState.requiredCol, headerId]
    }));
  }

  // Get required field
  getRequiredField() {
    return this.state.requiredCol;
  }

  // Get table valid status
  getTableValidStatus() {
    return this.refs["rowCtrl"].getAllRowsValidStatus();
  }

  // Update header name
  updateHeaderName(headerName) {
    // headersName
    if(this.state.headersName.indexOf(headerName) == -1) {
      this.setState(prevState => ({
        headersName: [...prevState.headersName, headerName]
      }));
    }
  }

  // Handle button click and fires relative actions
  // checkTableStatus rowsExpand
  addNewLine() {
    if(this.getTableValidStatus()) {
      let newLinesNum = (this.state.tableType == "line") ? (1) : (this.state.num);
      this.updateRowNumber(newLinesNum);
    } else {
      alert("Please fill the required field");
    }
  }

  // Delete specific rows *******************************************************************8
  deleteTableRows() {
    this.refs["rowCtrl"].deleteRows();
  }

  render() {
    const emptyHeaderValue = "Check";
    const flexStyle = (this.props.className == undefined || this.props.className == "") ?
    ("expand-zone") : (this.props.className);
    const tableStyle = (this.props.className == undefined || this.props.className == "") ?
    ("table-zone") : (this.props.className);

    // Returns column names
    const colName = this.props.children.map((colChild, index) => {
      if(colChild.type == TableHeader) {
        return <th key={index}>
          <TableHeader
            updateheader={this.updateHeaderName}
            updatecolumnid={this.updateColumnId}
            detectrequired={this.updateRequiredField}
            getrequired={this.getRequiredField}
            {...colChild.props} />
        </th>
      }
    });

    // Create an array list for all rows
    const rowsList = () => {
      let a = [];
      for(let i = 1; i <= this.state.rows; i++) {
        a.push(i);
      }
      return a;
    };

    return(
      <div className={flexStyle}>
        <TableTitle title={this.props.title}/>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th>
                <span className="default-empty-header">
                  {emptyHeaderValue}
                </span>
              </th>
              {colName}
            </tr>
          </thead>
          <TableRowController
            ref="rowCtrl"
            rowNum={rowsList()}
            rowHeaders={this.state.headersName}
            colId={this.state.columnId}
            requiredColumnId={this.state.requiredCol}
            updateRowsCount={this.updateRowNumber} />
        </table>
        <div>
          <LineControlButton
            className="example-btn-div"
            addNewLine={this.addNewLine}
            deleteLine={this.deleteTableRows}
            exportValue={this.exportValue} />
        </div>
      </div>
    )
  }
}

export default FlexTable;
