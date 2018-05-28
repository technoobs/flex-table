import React from 'react';

class TableHeader extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.columnId;
    this.requiredField = this.props.requiredField || "false";

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
    const headerStyle = (this.props.className == undefined || this.props.className == "") ?
    ("table-header") : (this.props.className);

    return(
      <div className={headerStyle}>
        <a>{this.props.headerName}</a>
      </div>
    )
  }
}

export default TableHeader;
