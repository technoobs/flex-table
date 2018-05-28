import React from 'react';

class TableTitle extends React.Component {
  render() {
    const cssStyle = (this.props.className == undefined || this.props.className == "") ?
    ("table-title") : (this.props.className);

    return(
      <div className={cssStyle}>
        <a>{this.props.title}</a>
      </div>
    )
  }
}

export default TableTitle;
