import React from 'react';
import FlexTable from './FlexTable.jsx';
import TableHeader from './TableHeader.jsx';
// import {ExpandableTable, TableHeader} from './ExpandableTable.jsx';
import './css/expand-style.css';
import './css/example-style.css';

var exportRequiredTable = {
  data: ''
};

var exportTable = {
  data: ''
};

class App extends React.Component {
  render() {
    return(
      <div className="example-div">
        <h2>flex-table Simple Demo</h2>
        <h3>Table with required fields</h3>
        <FlexTable title="Example Table" exportTarget={exportRequiredTable}>
          <TableHeader columnId={1} headerName="ID" requiredField="true" />
          <TableHeader columnId={2} headerName="Name" />
          <TableHeader columnId={3} headerName="Example" />
        </FlexTable>
        <h3>Table without required fields</h3>
        <FlexTable title="Example Table" exportTarget={exportTable}>
          <TableHeader columnId={1} headerName="ID" />
          <TableHeader columnId={2} headerName="Name" />
          <TableHeader columnId={3} headerName="Example" />
        </FlexTable>
      </div>
    )
  }
}

export default App;
