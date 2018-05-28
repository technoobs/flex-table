import React from 'react';
import FlexTable from './FlexTable.jsx';
import TableHeader from './TableHeader.jsx';
// import {ExpandableTable, TableHeader} from './ExpandableTable.jsx';
import './css/expand-style.css';
import './css/example-style.css';

var exportDATA = {
  data: ''
};

class App extends React.Component {
  render() {
    return(
      <div className="example-div">
        <h2>flex-table Simple Demo</h2>
        <FlexTable title="Example Table" exportTarget={exportDATA}>
          <TableHeader columnId={1} headerName="Key" requiredField="true" />
          <TableHeader columnId={2} headerName="Value" />
          <TableHeader columnId={3} headerName="Example" />
        </FlexTable>
      </div>
    )
  }
}

export default App;
