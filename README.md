# React.js flex-table

## A simple flexible table component written in React.js.
**Supported Features:**
- Not null field
- Rows modification
- Export data

### Usage:
```
<FlexTable title="Example Table">
  <TableHeader columnId={1} headerName="ID" requiredField="true" />
  <TableHeader columnId={2} headerName="Name" />
  <TableHeader columnId={3} headerName="Example" />
</FlexTable>
```
### Properties

| Property Name |   Component   |  Description  | Must be used |
| ------------- | ------------- | ------------- | ------------ |
| title         |   FlexTable   | Title name for table.| No |
| tableType     |   FlexTable   | Types for table: **line**, **lineGroups**. Use type **line** to add one new row. Use **lineGroups** to add multiple new rows.| No |
| rowsExpand    |   FlexTable   | Number of new rows to add. Use this property with **lineGroups** table type.| No |
| tableRows     |   FlexTable   | Number of rows to display when the table is initialized. | No |
| exportTarget  |   FlexTable   | The global variable used to store exported data.  | No |
| columnId      |   TableHeader | Column id. | Yes |
| headerName    |   TableHeader | Name of table headers.  | Yes |
| requiredField |   TableHeader | Defines whether the column is **Not null field** or not. If the **requiredField** is set to **true**, the column must have input value, otherwise the table won't be allowed to add new rows. | No |

### Demo
[Live Demo](http://tecnooob.com:3001/)
