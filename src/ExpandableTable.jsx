
import React from 'react';
// import ReactDOM from 'react-dom';
import { ButtonToolbar,
  Button,
  Table
} from 'react-bootstrap/lib/';

import TableTitle from './TableTitle.jsx';

// Table types used for table validation.
// "line" type will validate required field once
// a new line is going to be created.
// "table" type will validate required field once
// the table is going to export all data.
// this.tableType = this.props.tableType || "line";

class ExpandableTable extends React.Component {
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
      console.log("<LineControlButton> Table doesn't meet requirements to add new lines !!!!");
    }
  }

  // Delete specific rows *******************************************************************8
  deleteTableRows() {
    this.refs["rowCtrl"].deleteRows();
  }

  render() {
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

    const emptyHeaderValue = "Check";

    const tableStyle = (this.props.className == undefined || this.props.className == "") ?
    ("expand-zone") : (this.props.className);

    return(
      <div>
        <div className={tableStyle}>
          <TableTitle title="Example"/>
          <div>
            <table className="table-zone">
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
          </div>
          <div className="control-btn-div">
            <LineControlButton
              addNewLine={this.addNewLine}
              deleteLine={this.deleteTableRows}/>
            <ExportButton exportValue={this.exportValue}/>
          </div>
        </div>
      </div>
    )
  }
}

class TableHeader extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.columnId;
    this.requiredField = this.props.requiredfield || "false";

    this.detectRequiredField = this.detectRequiredField.bind(this);

  }

  // Detect if table header is a required field or not
  detectRequiredField(id) {
    if(this.requiredField === "true") {
      this.props.detectrequired(id);
    }
  }

  componentDidMount() {
    // Update header name
    this.props.updateheader(this.props.colname);
    // Update column id to <ExpandableTable> component
    this.props.updatecolumnid(this.id);
    // Update required column to <ExpandableTable> component
    this.detectRequiredField(this.id);
  }

  render() {
    const headerStyle = (typeof this.props.className == 'undefined') ?
    ("col-header inner-div") : (this.props.className + " col-header");

    return(
      <div className={headerStyle}>
        <a>{this.props.colname}</a>
      </div>
    )
  }
}

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

    console.log("selectedRows are: " + selectedRows);

    if(selectedRows.length == 0) {
      let i = 1;
      for(let ref in this.refs) {

        let rowId = this.refs[ref].state.rowId;

        let rowValue = this.refs[ref].getCellsValue();
        // data["row-" + i] = rowValue;
        // data["row-" + rowId] = rowValue;
        data.push(rowValue);
        // i++;
      }
    } else {
      // let i = 1;
      for(let ref in this.refs) {
        let rowId = this.refs[ref].state.rowId;
        if(selectedRows.indexOf(rowId) != -1) {
          let rowValue = this.refs[ref].getCellsValue();
          // data["row-" + rowId] = rowValue;
          data.push(rowValue);
        }
        // i++;
      }
    }
    exportTarget["data"] = data;
    // exportTarget = data;

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
        <input
          id={this.state.inputId}
          type="text"
          placeholder={inputMsg}
          onChange={this.checkInput}>
        </input>
      </td>
    )
  }
}

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

class LineControlButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }


  render() {
    return(
      <ButtonToolbar>
        <Button bsStyle="danger" onClick={this.props.deleteLine}>Delete Line</Button>
        <Button bsStyle="success" onClick={this.props.addNewLine}>
          Add New Line
        </Button>
      </ButtonToolbar>
    )
  }
}

class ExportButton extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Button
        bsStyle="info"
        onClick={this.props.exportValue}>
        Export Data
      </Button>
    )
  }
}

export {ExpandableTable, TableHeader};
