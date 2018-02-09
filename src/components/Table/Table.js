import React, {PropTypes, Component} from 'react';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import {measureScrollbar, debounce} from './utils';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import ColumnManager from './ColumnManager';
import createStore from './createStore';
import ColorColumn from './ColorColumn';
import EmailColumn from './EmailColumn';
import Accessory from './Accessory';
import {ContextMenu, ContextMenuTrigger, MenuItem, SubMenu} from '../RightKey';
import UUID from 'uuid';
import xt from '../../common/xt';

import {permissionsBtn} from "../../services/apiCall";

/**
 * 判断浏览器打开
 * Judge the browser
 * */
const judgeBrower = () => {
    var userAgent = window.navigator.userAgent;
    if(window.opr != undefined) return "Opera";
    if(userAgent.indexOf("Firefox") > -1) return "Firefox";
    if(userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("WebKit") > -1 && userAgent.indexOf("Mozilla") > -1) return "Chrome";
    if(userAgent.indexOf("Safari") > -1) return "Safari";
    if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf('MSIE') > -1 && userAgent.indexOf('Opera') == -1) return "IE";
    if(userAgent.indexOf("Mozilla") > -1 && userAgent.indexOf("WebKit") == -1 && userAgent.indexOf("compatible") == -1 && userAgent.indexOf("Chrome") == -1 ) return "Mozilla"
};


export class Table extends Component {
    constructor(props) {

        super(props);
        this.state = this.initialState();
        this.handleBodyScroll = this.handleBodyScroll.bind(this);
        this.onRowCheckboxCellClick = this.onRowCheckboxCellClick.bind(this);
        this.onHeaderCellClick = this.onHeaderCellClick.bind(this);
        this.buildContextMenu = this.buildContextMenu.bind(this);
        this.tableRowUUIDKey = UUID.v4();
        this.tableHeaderUUIDKey = UUID.v4();
        let browerAgent = judgeBrower();
        console.log( '%c ' +  browerAgent + "浏览器",'color:pink');
        this.styBol = (browerAgent == "IE" || browerAgent == "Firefox" || browerAgent == "Safari")? true:false;
    }

    onHeaderCellClick(e, props) {
        // let{checkedAll}=props;
        // let newState={checkedAll:checkedAll};
        // //this.setState(Object.assign({},this.state,{checkedAll}));
        // if(!checkedAll){
        //   newState.checkedRows=[];
        // }else{
        //   newState.checkedRows=this.state.data.map((item,index)=>(index));
        // }
        // this.setState({
        //     checkedAll:newState.checkedAll,
        //     checkedRows:newState.checkedRows
        //   });
        const {followConfig} = this.props;
        if(props.type === 'checkbox-cell'){
            let {selectedData, data} = this.state;
            if (selectedData.size === data.length){
                selectedData.clear();
            } else {
                selectedData = new Set(data);
            }
            this.setState({selectedData});
        } else if(props.type === 'follow-cell'){
            followConfig.onHeaderClick && followConfig.onHeaderClick(props.followed);
        }


        //----- Tang ------
        // let checkedRows = [];
        // let selectArr = [];
        // if (props.checkedAll) {
        //     selectArr = selectArr.concat(this.state.data);
        //     selectArr = Array.from(new Set(selectArr));
        //     checkedRows = selectArr.map((value, index) => index);
        // } else {
        //     selectArr = [];
        //     checkedRows = [];
        // }
        // this.setState({
        //     selectArr: selectArr,
        //     checkedRows: checkedRows,
        //     checkedAll: props.checkedAll
        // });
        //---------
        const {onHeaderCellClick} = this.props;
        if (onHeaderCellClick) {
            onHeaderCellClick(e, props);
        }
    }

    initialState() {
        const props = this.props;
        let expandedRowKeys = [];
        let rows = [...props.data];
        this.columnManager = new ColumnManager(props.columns, props.children);
        this.store = createStore({currentHoverKey: null});
        if (props.defaultExpandAllRows) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                expandedRowKeys.push(this.getRowKey(row));
                rows = rows.concat(row[props.childrenColumnName] || []);
            }
        } else {
            expandedRowKeys = props.expandedRowKeys || props.defaultExpandedRowKeys;
        }
        let selectedData = props.checkboxConfig.checkedAll ? (props.data||[]) : this.props.checkboxConfig.checkedRows;
        return {
            expandedRowKeys,
            data: props.data||[],
            currentHoverKey: null,
            scrollPosition: 'left',
            fixedColumnsHeadRowsHeight: [],
            fixedColumnsBodyRowsHeight: [],
            selectedData: new Set(selectedData)
        };
    }

    onRowCheckboxCellClick(row, index) {
        //------- Tang
        // let selectedData = this.state.selectedData;
        // (selectedData.has(row) && selectedData.add(row)) || selectedData.delete(row);
        //
        // if (selectedData.size === this.state.data.length) {
        //     this.setState({checkedAll: true, selectedData});
        // } else {
        //     this.setState({checkedAll: false, selectedData});
        // }
        //-------

        //this.forceUpdate();
        /*
         let {onRowClick}=this.props;
         if(onRowClick){
         onRowClick(row,index,checked);
         }*/
    }

    getSelectArr() {
        return Array.from(this.state.selectedData.values());
    }


    clearChecked() {

        return console.log("table clear");
        // this.setState({
        //     checkedAll: false,
        //     checkedRows: [],
        //     selectArr: []
        // })
    }
    componentDidMount() {
        this.resetScrollY();
        if (this.columnManager.isAnyColumnsFixed()) {
            this.syncFixedTableRowHeight();
            this.resizeEvent = addEventListener(
                window, 'resize', debounce(this.syncFixedTableRowHeight, 150)
            );
        }
    }

    componentWillReceiveProps(nextProps, nexts) {
        let {selectedData} = this.state;
        let newSelectedData = new Set();
        let datal = nextProps.data ||[];
        if ('data' in nextProps) {
            selectedData.forEach(o => {~nextProps.data.indexOf(o) && newSelectedData.add(o)});
            this.setState({
                selectedData: newSelectedData,
                data: datal,
            });
            if (!nextProps.data || datal.length === 0) {
                this.resetScrollY();
            }
        } else {
            this.setState({selectedData: newSelectedData});
        }
        if ('expandedRowKeys' in nextProps) {
            this.setState({
                expandedRowKeys: nextProps.expandedRowKeys,
            });
        }
        if (nextProps.columns && nextProps.columns !== this.props.columns) {
            this.columnManager.reset(nextProps.columns);
        } else if (nextProps.children !== this.props.children) {
            this.columnManager.reset(null, nextProps.children);
        }

        // if(this.props.clear){
        //   if('checkedRows' in nextProps.checkboxConfig){
        //     this.setState({checkedRows:nextProps.checkboxConfig.checkedRows,checkedAll:nextProps.checkboxConfig.checkedAll});
        //   }
        // }
    }

    componentDidUpdate() {
        this.syncFixedTableRowHeight();
    }

    componentWillUnmount() {
        if (this.resizeEvent) {
            this.resizeEvent.remove();
        }
    }

    onExpandedRowsChange(expandedRowKeys) {
        if (!this.props.expandedRowKeys) {
            this.setState({expandedRowKeys});
        }
        this.props.onExpandedRowsChange(expandedRowKeys);
    }

    onExpanded(expanded, record, e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const info = this.findExpandedRow(record);
        if (typeof info !== 'undefined' && !expanded) {
            this.onRowDestroy(record);
        } else if (!info && expanded) {
            const expandedRows = this.getExpandedRows().concat();
            expandedRows.push(this.getRowKey(record));
            this.onExpandedRowsChange(expandedRows);
        }
        this.props.onExpand(expanded, record);
    }

    onRowDestroy(record) {
        if (!this.expandedRows) {
            return;
        }
        const expandedRows = this.getExpandedRows().concat();
        const rowKey = this.getRowKey(record);
        let index = -1;
        expandedRows.forEach((r, i) => {
            if (r === rowKey) {
                index = i;
            }
        });
        if (index !== -1) {
            expandedRows.splice(index, 1);
        }
        this.onExpandedRowsChange(expandedRows);
    }

    getRowKey(record, index) {
        const rowKey = this.props.rowKey;
        if (typeof rowKey === 'function') {
            return rowKey(record, index);
        }
        return typeof record[rowKey] !== 'undefined' ? record[rowKey] : index;
    }

    getExpandedRows() {
        return this.props.expandedRowKeys || this.state.expandedRowKeys;
    }

    getHeader(columns, fixed) {
        const {showHeader, expandIconAsCell, prefixCls} = this.props;
        const rows = this.getHeaderRows(columns);
        if (this.props.search.isShowSerach) {
            let form = [];
            if (!this.props.singleSelect && this.props.checkboxConfig.show) {
                form.push({
                    key: 'rc-table-expandIconAsCell',
                    className: `${prefixCls}-expand-icon-th`,
                    title: '',
                    rowSpan: rows.length,
                });
            }
            if (this.props.followConfig.show) {
                form.push({
                    key: 'rc-table-expandIconAsCell',
                    className: `${prefixCls}-expand-icon-th`,
                    title: '',
                    rowSpan: rows.length,
                });
            }
            if (this.props.colorFilterConfig.show) {
                form.push({
                    key: 'rc-table-expandIconAsCell',
                    className: `${prefixCls}-expand-icon-th`,
                    title: '',
                    rowSpan: rows.length,
                });
            }
            if(this.props.accessoryConfig.show){
              form.push({
                key: 'rc-table-expandIconAsCell',
                className: `${prefixCls}-expand-icon-th`,
                title: '',
                rowSpan: rows.length
              });
            }
            if(this.props.emailFilterConfig.show){
              form.push({
                key: 'rc-table-expandIconAsCell',
                className: `${prefixCls}-expand-icon-th`,
                title: '',
                rowSpan: rows.length
              });
            }
            form.push({
                key: 'seacrch',
                children: <i className='foddingicon fooding-search_32'/>,
                data: {type: 'search_01'},
                className: 'follow-header-cell'
            });
            for (let i = 0, length = rows[0].length; i < length; i++) {
                form.push({
                    children: columns[i].template,
                    className: '',
                    key: columns[i].key,
                    name: columns[i].searchData
                });
            }
            rows[0].unshift(
                {
                    key: 'seacrch',
                    children: <i className='foddingicon fooding-search_32'/>,
                    data: {type: 'search'},
                    className: 'follow-header-cell'
                }
            )
            rows.push(form);
        }
        if (expandIconAsCell && fixed !== 'right') {
            rows[0].unshift({
                key: 'rc-table-expandIconAsCell',
                className: `${prefixCls}-expand-icon-th`,
                title: '',
                rowSpan: rows.length,
            });
        }

        if (this.props.followConfig.show) {
            let className = 'glyphicon glyphicon-star-empty';
            rows[0].unshift(
                {
                    key: 'follow-cell',
                    children: (<span className={className}/>),
                    data: {type: 'follow'},
                    className: 'follow-header-cell'
                }
            )
        }
        if (this.props.colorFilterConfig.show) {
            rows[0].unshift({
                data: {type: 'color-filter'},
                children: (
                    <ColorColumn enable={false} onSelect={this.props.colorFilterConfig.onHeaderSelect}/>
                ),
                key: 'color-filter',
                className: 'color-filter-header-cell'
            });
        }
        if(this.props.accessoryConfig.show){
          rows[0].unshift({
              data: {type: 'accessory-filter'},
              children: (
                  <Accessory enable={false} onSelect={this.props.accessoryConfig.accessoryHeaderSelect}/>
              ),
              key: 'accessory-filter',
              className: 'accessory-filter-header-cell'
          });
        }
        if(this.props.emailFilterConfig.show){
          rows[0].unshift({
              data: {type: 'email-filter'},
              children: (
                  <EmailColumn enable={false} onSelect={this.props.emailFilterConfig.emailHeaderSelect}/>
              ),
              key: 'email-filter',
              className: 'email-filter-header-cell'
          });
        }
        if ( this.props.checkboxConfig.show) {
            let checkbox = {
                className: '',
                data: {type: !this.props.singleSelect ? 'checkbox': ''},
                children: this.props.checkboxConfig.children || <span/>,
                key: 'checkbox-cell',
            };
            if (this.props.checkboxConfig.position !== 'last') {
                rows[0].unshift(checkbox);
            } else {
                rows[0].push(checkbox);
            }
        }
        const trStyle = fixed ? this.getHeaderRowStyle(columns, rows) : null;
        const contextMenuId = this.tableHeaderUUIDKey;
        return showHeader ? (
            <TableHeader
                prefixCls={prefixCls}
                search={this.props.search}
                checkboxBB={this.props.checkboxConfig.children}
                rows={rows}
                rowStyle={trStyle}
                onHeaderCellClick={this.onHeaderCellClick}
                onHeaderSortClick={this.props.onHeaderSortClick}
                checkedAll={this.state.selectedData.size === this.state.data.length && this.state.data.length}
                colorFilterConfig={this.props.colorFilterConfig}
                emailFilterConfig={this.props.emailFilterConfig}
                accessoryConfig ={this.props.accessoryConfig}
                followConfig={this.props.followConfig}
                headerMenuConfig={{...this.props.headerMenuConfig, contextMenuId}}
            />
        ) : null;
    }

    getHeaderRows(columns, currentRow = 0, rows) {
        rows = rows || [];
        rows[currentRow] = rows[currentRow] || [];

        columns.forEach(column => {
            if (column.rowSpan && rows.length < column.rowSpan) {
                while (rows.length < column.rowSpan) {
                    rows.push([]);
                }
            }
            const cell = {
                key: column.key,
                sort: column.sort === false? null: (column.sort || column.key),
                className: column.className || '',
                children: column.title,
                visible: column.visible,
                data: {type: column.type},
            };
            if (column.children) {
                this.getHeaderRows(column.children, currentRow + 1, rows);
            }
            if ('colSpan' in column) {
                cell.colSpan = column.colSpan;
            }
            if ('rowSpan' in column) {
                cell.rowSpan = column.rowSpan;
            }
            if (cell.colSpan !== 0) {
                rows[currentRow].push(cell);
            }
        });
        return rows.filter(row => row.length > 0);
    }

    getExpandedRow(key, content, visible, className, fixed) {
        const {prefixCls, expandIconAsCell} = this.props;
        let colCount;
        if (fixed === 'left') {
            colCount = this.columnManager.leftLeafColumns().length;
        } else if (fixed === 'right') {
            colCount = this.columnManager.rightLeafColumns().length;
        } else {
            colCount = this.columnManager.leafColumns().length;
        }
        const columns = [{
            key: 'extra-row',
            render: () => ({
                props: {
                    colSpan: colCount,
                },
                children: fixed !== 'right' ? content : '&nbsp;',
            }),
        }];
        if (expandIconAsCell && fixed !== 'right') {
            columns.unshift({
                key: 'expand-icon-placeholder',
                render: () => null,
            });
        }
        return (
            <TableRow
                columns={columns}
                visible={visible}
                colorConfig ={this.props.colorConfig}
                className={className}
                key={`${key}-extra-row`}
                prefixCls={`${prefixCls}-expanded-row`}
                indent={1}
                expandable={false}
                store={this.store}
                search={this.props.search}
            />
        );
    }

    onRowClick(record, index) {
        let {selectedData} = this.state;

        if(selectedData.has(record)){
            selectedData.delete(record)
        } else {
            this.props.singleSelect && selectedData.clear();
            selectedData.add(record);
        }

        this.setState({selectedData});
        this.props.onRowClick(record, index);
    }

    onRowDoubleClick(record, index, checked) {
        let {selectedData} = this.state;
        selectedData.clear();
        selectedData.add(record);
        this.setState({ selectedData});
        this.props.onRowDoubleClick(record, index)
    }

    getRowsByData(data, visible, indent, columns, fixed) {
        // if (this.props.clear) {
        //     this.state.checkedRows = [];
        //     this.state.checkedAll = false;
        // }
        let {selectedData} = this.state;
        const props = this.props;
        const childrenColumnName = props.childrenColumnName;
        const expandedRowRender = props.expandedRowRender;
        const expandRowByClick = props.expandRowByClick;
        const {fixedColumnsBodyRowsHeight} = this.state;
        let rst = [];
        const rowClassName = props.rowClassName;
        const rowRef = props.rowRef;
        const expandedRowClassName = props.expandedRowClassName;
        let datal =  props.data || [];
        const needIndentSpaced = datal.some(record => record[childrenColumnName]);
        const onRowClick = this.onRowClick.bind(this);
        const onRowDoubleClick = this.onRowDoubleClick.bind(this);

        const expandIconAsCell = fixed !== 'right' ? props.expandIconAsCell : false;
        const expandIconColumnIndex = fixed !== 'right' ? props.expandIconColumnIndex : -1;
        const contextMenuId = this.tableRowUUIDKey;
        for (let i = 0; i < data.length; i++) {
            const record = data[i];
            const key = this.getRowKey(record, i);
            const childrenColumn = record[childrenColumnName];
            const isRowExpanded = this.isRowExpanded(record);
            let expandedRowContent;
            if (expandedRowRender && isRowExpanded) {
                expandedRowContent = expandedRowRender(record, i, indent);
            }
            const className = rowClassName(record, i, indent);

            const onHoverProps = {};
            if (this.columnManager.isAnyColumnsFixed()) {
                onHoverProps.onHover = this.handleRowHover;
            }

            const height = (fixed && fixedColumnsBodyRowsHeight[i]) ?
                fixedColumnsBodyRowsHeight[i] : null;

            let leafColumns;
            if (fixed === 'left') {
                leafColumns = this.columnManager.leftLeafColumns();
            } else if (fixed === 'right') {
                leafColumns = this.columnManager.rightLeafColumns();
            } else {
                leafColumns = this.columnManager.leafColumns();
            }
            rst.push(
                <TableRow
                    indent={indent}
                    colorConfig ={this.props.colorConfig}
                    indentSize={props.indentSize}
                    needIndentSpaced={needIndentSpaced}
                    className={className}
                    record={record}
                    expandIconAsCell={expandIconAsCell}
                    onDestroy={this.onRowDestroy}
                    index={i}
                    visible={visible}
                    expandRowByClick={expandRowByClick}
                    onExpand={this.onExpanded}
                    expandable={childrenColumn || expandedRowRender}
                    expanded={isRowExpanded}
                    prefixCls={`${props.prefixCls}-row`}
                    childrenColumnName={childrenColumnName}
                    columns={leafColumns}
                    expandIconColumnIndex={expandIconColumnIndex}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onRowDoubleClick}
                    height={height}
                    {...onHoverProps}
                    key={key}
                    hoverKey={key}
                    ref={rowRef(record, i, indent)}
                    store={this.store}
                    onRowCheckboxCellClick={this.onRowCheckboxCellClick}
                    colorFilterConfig={props.colorFilterConfig}
                    emailFilterConfig={props.emailFilterConfig}
                    accessoryConfig = {props.accessoryConfig}
                    search={this.props.search}
                    checkboxConfig={{
                        checked: selectedData.has(record),
                        showCheckbox: props.checkboxConfig.show,
                        position: null == props.checkboxConfig.position ? 'first' : props.checkboxConfig.position
                    }}
                    followConfig={props.followConfig}
                    contextMenuConfig={{enable: props.contextMenuConfig.enable, contextMenuId}}
                />
            );

            const subVisible = visible && isRowExpanded;

            if (expandedRowContent && isRowExpanded) {
                rst.push(this.getExpandedRow(
                    key, expandedRowContent, subVisible, expandedRowClassName(record, i, indent), fixed
                ));
            }
            if (childrenColumn) {
                rst = rst.concat(this.getRowsByData(
                    childrenColumn, subVisible, indent + 1, columns, fixed
                ));
            }
        }
        return rst;
    }

    getRows(columns, fixed) {
        return this.getRowsByData(this.state.data, true, 0, columns, fixed);
    }

    getColGroup(columns, fixed) {
        let cols = [];
        if (this.props.expandIconAsCell && fixed !== 'right') {
            cols.push(
                <col
                    className={`${this.props.prefixCls}-expand-icon-col`}
                    key="rc-table-expand-icon-col"
                />
            );
        }
        let leafColumns;

        if (fixed === 'left') {
            leafColumns = this.columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
            leafColumns = this.columnManager.rightLeafColumns();
        } else {
            leafColumns = this.columnManager.leafColumns();
        }

        if (this.props.checkboxConfig.show && this.props.checkboxConfig.position !== 'last') {
            cols.push(<col key='checkbox-cell-g' style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}}/>);
        }
        if (this.props.emailFilterConfig.show) {
            cols.push(<col key='email-filter-cell-g' style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}} />);
        }
        if (this.props.accessoryConfig.show) {
            cols.push(<col key='accessory-filter-cell-g' style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}} />);
        }
        if (this.props.colorFilterConfig.show) {
            cols.push(<col key='color-filter-cell-g' style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}} />);
        }

        if (this.props.followConfig.show) {
            cols.push(<col key='follow-cell-g' style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}} />);
        }
        if (this.props.search.isShowSerach) {
            cols.push(<col key={'seacrch-g'} style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}} />);
        }

        cols = cols.concat(leafColumns.map(c => {
            return c.visible !== false ? <col key={c.key || c.dataIndex} style={{width: c.width, minWidth: c.width}}/>: null;
        }));
        if (this.props.checkboxConfig.show && this.props.checkboxConfig.position === 'last') {
            cols.push(<col key='checkbox-cell-g' style={this.styBol ? {width: '2%', maxWidth: '2%'}:{width: '24px', maxWidth: '24px'}}/>);
        }
        return <colgroup>{cols}</colgroup>;
    }

    getLeftFixedTable() {
        return this.getTable({
            columns: this.columnManager.leftColumns(),
            fixed: 'left',
        });
    }

    getRightFixedTable() {
        return this.getTable({
            columns: this.columnManager.rightColumns(),
            fixed: 'right',
        });
    }

    getTable(options = {}) {
        const {columns, fixed} = options;
        const {prefixCls, scroll = {}, getBodyWrapper} = this.props;
        let {useFixedHeader} = this.props;
        const bodyStyle = {...this.props.bodyStyle};
        const headStyle = {};

        let tableClassName = '';
        if (scroll.x || fixed) {
            tableClassName = `${prefixCls}-fixed`;
            bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
        }

        if (scroll.y) {
            // maxHeight will make fixed-Table scrolling not working
            // so we only set maxHeight to body-Table here
            if (fixed) {
                bodyStyle.height = bodyStyle.height || scroll.y;
            } else {
                bodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
            }
            //bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
            bodyStyle.overflowY = bodyStyle.overflowY || 'auto';
            useFixedHeader = true;

            // Add negative margin bottom for scroll bar overflow bug
            const scrollbarWidth = measureScrollbar();
            if (scrollbarWidth > 0) {
                (fixed ? bodyStyle : headStyle).marginBottom = `-${scrollbarWidth}px`;
                (fixed ? bodyStyle : headStyle).paddingBottom = '0px';
                headStyle.marginBottom = 0;
            }
        }

        const renderTable = (hasHead = true, hasBody = true) => {
            const tableStyle = {};
            if (!fixed && scroll.x) {
                // not set width, then use content fixed width
                if (scroll.x === true) {
                    tableStyle.tableLayout = 'fixed';
                } else {
                    tableStyle.width = scroll.x;
                }
            }
            const tableBody = hasBody ? getBodyWrapper(
                <tbody className={`${prefixCls}-tbody`}>
                {this.getRows(columns, fixed)}
                </tbody>
            ) : null;
            return (
                <table className={tableClassName} style={tableStyle}>
                    {this.getColGroup(columns, fixed)}
                    {hasHead ? this.getHeader(columns, fixed) : null}
                    {tableBody}
                </table>
            );
        };

        let headTable;

        if (useFixedHeader) {
            headTable = (
                <div
                    className={`${prefixCls}-header`}
                    ref={fixed ? null : 'headTable'}
                    style={headStyle}
                    onMouseOver={(e) => this.detectScrollTarget(e)}
                    onTouchStart={(e) => this.detectScrollTarget(e)}
                    onScroll={(e) => this.handleBodyScroll(e)}
                >
                    {renderTable(true, false)}
                </div>
            );
        }

        let BodyTable = (
            <div
                className={`${prefixCls}-body`}
                style={bodyStyle}
                ref="bodyTable"
                onMouseOver={(e) => this.detectScrollTarget(e)}
                onTouchStart={(e) => this.detectScrollTarget(e)}
                onScroll={(e) => this.handleBodyScroll(e)}
            >
                {renderTable(!useFixedHeader)}
            </div>
        );

        if (fixed && columns.length) {
            let refName;
            if (columns[0].fixed === 'left' || columns[0].fixed === true) {
                refName = 'fixedColumnsBodyLeft';
            } else if (columns[0].fixed === 'right') {
                refName = 'fixedColumnsBodyRight';
            }
            delete bodyStyle.overflowX;
            delete bodyStyle.overflowY;
            BodyTable = (
                <div
                    className={`${prefixCls}-body-outer`}
                    style={{...bodyStyle}}>
                    <div
                        className={`${prefixCls}-body-inner`}
                        ref={refName}
                        onMouseOver={(e) => this.detectScrollTarget(e)}
                        onTouchStart={(e) => this.detectScrollTarget(e)}
                        onScroll={(e) => this.handleBodyScroll(e)}
                    >
                        {renderTable(!useFixedHeader)}
                    </div>
                </div>
            );
        }

        return <span>{headTable}{BodyTable}</span>;
    }

    getTitle() {
        const {title, prefixCls} = this.props;
        return title ? (
            <div className={`${prefixCls}-title`}>
                {title(this.state.data)}
            </div>
        ) : null;
    }

    getFooter() {
        const {footer, prefixCls} = this.props;
        return footer ? (
            <div className={`${prefixCls}-footer`}>
                {footer(this.state.data)}
            </div>
        ) : null;
    }

    getEmptyText() {
        const {emptyText, prefixCls, data} = this.props;
        let datal = data || [];
        return !datal.length ? (
            <div className={`${prefixCls}-placeholder`}>
                {emptyText()}
            </div>
        ) : null;
    }

    getHeaderRowStyle(columns, rows) {
        const {fixedColumnsHeadRowsHeight} = this.state;
        const headerHeight = fixedColumnsHeadRowsHeight[0];
        if (headerHeight && columns) {
            if (headerHeight === 'auto') {
                return {height: 'auto'};
            }
            return {height: headerHeight / rows.length};
        }
        return null;
    }

    syncFixedTableRowHeight() {
        const {prefixCls} = this.props;
        const headRows = this.refs.headTable ?
            this.refs.headTable.querySelectorAll('thead') :
            this.refs.bodyTable.querySelectorAll('thead');
        const bodyRows = this.refs.bodyTable.querySelectorAll(`.${prefixCls}-row`) || [];
        const fixedColumnsHeadRowsHeight = [].map.call(
            headRows, row => row.getBoundingClientRect().height || 'auto'
        );
        const fixedColumnsBodyRowsHeight = [].map.call(
            bodyRows, row => row.getBoundingClientRect().height || 'auto'
        );
        if (shallowequal(this.state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
            shallowequal(this.state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
            return;
        }
        this.setState({
            fixedColumnsHeadRowsHeight,
            fixedColumnsBodyRowsHeight,
        });
    }

    resetScrollY() {
        if (this.refs.headTable) {
            this.refs.headTable.scrollLeft = 0;
        }
        if (this.refs.bodyTable) {
            this.refs.bodyTable.scrollLeft = 0;
        }
    }

    findExpandedRow(record) {
        const rows = this.getExpandedRows().filter(i => i === this.getRowKey(record));
        return rows[0];
    }

    isRowExpanded(record) {
        return typeof this.findExpandedRow(record) !== 'undefined';
    }

    detectScrollTarget(e) {
        if (this.scrollTarget !== e.currentTarget) {
            this.scrollTarget = e.currentTarget;
        }
    }

    handleBodyScroll(e) {
        // Prevent scrollTop setter trigger onScroll event
        // http://stackoverflow.com/q/1386696
        if (e.target !== this.scrollTarget) {
            return;
        }
        const {scroll = {}} = this.props;
        const {headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight} = this.refs;
        if (scroll.x && e.target.scrollLeft !== this.lastScrollLeft) {
            if (e.target === bodyTable && headTable) {
                headTable.scrollLeft = e.target.scrollLeft;
            } else if (e.target === headTable && bodyTable) {
                bodyTable.scrollLeft = e.target.scrollLeft;
            }
            if (e.target.scrollLeft === 0) {
                this.setState({scrollPosition: 'left'});
            } else if (e.target.scrollLeft + 1 >=
                e.target.children[0].getBoundingClientRect().width -
                e.target.getBoundingClientRect().width) {
                this.setState({scrollPosition: 'right'});
            } else if (this.state.scrollPosition !== 'middle') {
                this.setState({scrollPosition: 'middle'});
            }
        }
        if (scroll.y) {
            if (fixedColumnsBodyLeft && e.target !== fixedColumnsBodyLeft) {
                fixedColumnsBodyLeft.scrollTop = e.target.scrollTop;
            }
            if (fixedColumnsBodyRight && e.target !== fixedColumnsBodyRight) {
                fixedColumnsBodyRight.scrollTop = e.target.scrollTop;
            }
            if (bodyTable && e.target !== bodyTable) {
                bodyTable.scrollTop = e.target.scrollTop;
            }
        }
        // Remember last scrollLeft for scroll direction detecting.
        this.lastScrollLeft = e.target.scrollLeft;
    }

    handleRowHover(isHover, key) {
        this.store.setState({
            currentHoverKey: isHover ? key : null,
        });
    }

    render() {
        const props = this.props;
        const prefixCls = props.prefixCls;

        let className = props.prefixCls;
        if (props.className) {
            className += ` ${props.className}`;
        }
        if (props.useFixedHeader || (props.scroll && props.scroll.y)) {
            className += ` ${prefixCls}-fixed-header`;
        }
        className += ` ${prefixCls}-scroll-position-${this.state.scrollPosition}`;
        const isTableScroll = this.columnManager.isAnyColumnsFixed() || (props.scroll ? props.scroll.x || props.scroll.y : 0);
        let contextMenu = null, headerMenu = null;
        if (props.contextMenuConfig.enable && Array.isArray(props.contextMenuConfig.menuItems) &&
            props.contextMenuConfig.menuItems.length > 0) {
            contextMenu = <ContextMenu id={this.tableRowUUIDKey} onShow={this.menuItemShow}>
                {
                    props.contextMenuConfig.menuItems.map((item, index) => {
                        if( item['permissions'] && !(permissionsBtn(item['permissions'])) ) return;  // 控制按钮 权限
                        // console.log(item);
                        return this.buildContextMenu(item, index, false, Array.from(this.state.selectedData)[0])
                    })
                }
            </ContextMenu>
        }

        if(props.headerMenuConfig.enable && Array.isArray(props.headerMenuConfig.menuItems) && props.headerMenuConfig.menuItems.length){
            headerMenu = <ContextMenu id={this.tableHeaderUUIDKey}>
                {
                    (props.headerMenuConfig.menuItems.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1)).map((item, index) => {
                        return this.buildContextMenu(item, index, true)
                    })
                }
            </ContextMenu>
        }

        return (
            <div className={className} style={props.style}>
                {this.getTitle()}
                <div className={`${prefixCls}-content`}>
                    {this.columnManager.isAnyColumnsLeftFixed() &&
                    <div className={`${prefixCls}-fixed-left`}>
                        {this.getLeftFixedTable()}
                    </div>}
                    <div className={isTableScroll ? `${prefixCls}-scroll` : ''}>
                        {this.getTable({columns: this.columnManager.groupedColumns()})}
                        {this.getEmptyText()}
                        {this.getFooter()}
                    </div>
                    {this.columnManager.isAnyColumnsRightFixed() &&
                    <div className={`${prefixCls}-fixed-right`}>
                        {this.getRightFixedTable()}
                    </div>}
                </div>
                {contextMenu}
                {headerMenu}
            </div>
        );
    }

    menuItemShow = cusEvent =>{
        let {selectedData} = this.state;
        selectedData.clear();
        selectedData.add(cusEvent.detail.data.record.record);
        this.setState({ selectedData});
    };

    menuItemClick(onClick, menuData, e, record) {
        // let {selectedData} = this.state;
        // selectedData.clear();
        // selectedData.add(record.record.record);
        //
        // this.setState({ selectedData}, function () {
        //     onClick(e, Object.assign({}, {record: record.record.record}, menuData));
        // });
        if(!record){
          onClick(e, Object.assign({}, {record: this.getSelectArr()[0]}, menuData));
        }else{
          onClick(e, Object.assign({}, {record: record.record.record}, menuData));
        }
    }

    setSelectRow(record, isSingle = false) {
        let {selectedData} = this.state;
        isSingle && selectedData.clear();
        selectedData.add(record);
        this.setState({selectedData});
    }

    buildContextMenu(menuItem, index, isHeader = false, oneData) {
        if (menuItem.isSubMenu) {
            let children = null;
            if (menuItem.children && menuItem.children.length > 0) {
                let that = this;
                children = menuItem.children.map((item, index) => {
                    return that.buildContextMenu(item, index, isHeader, oneData)
                });
            }

            return (<SubMenu title={menuItem.content} key={index}
               onClick={this.menuItemClick.bind(this, menuItem.onClick, menuItem.data)}
               data={this.getSelectArr()[0]} children={children}/>)
        } else if(isHeader){
            return (<MenuItem data={menuItem.data} onClick={(e)=>menuItem.onClick(e, menuItem.data)} key={index}>{menuItem.content}</MenuItem>)
        } else {
            let menu = <MenuItem permissions={menuItem['permissions']} data={menuItem.data} onClick={this.menuItemClick.bind(this, menuItem.onClick, menuItem.data)}
                                 key={index}>{menuItem.content}</MenuItem>;
            if( !menuItem.condition || !oneData){
                return menu;
            }
            if(xt.condition(oneData, menuItem.condition)){
                return menu;
            }
        }
    };
}


Table.propTypes = {
    // data: PropTypes.array,
    // expandIconAsCell: PropTypes.bool,
    // defaultExpandAllRows: PropTypes.bool,
    // expandedRowKeys: PropTypes.array,
    // defaultExpandedRowKeys: PropTypes.array,
    // useFixedHeader: PropTypes.bool,
    // columns: PropTypes.array,
    // prefixCls: PropTypes.string,
    // bodyStyle: PropTypes.object,
    // style: PropTypes.object,
    // rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    // rowClassName: PropTypes.func,
    // expandedRowClassName: PropTypes.func,
    // childrenColumnName: PropTypes.string,
    // onExpand: PropTypes.func,
    // onExpandedRowsChange: PropTypes.func,
    // indentSize: PropTypes.number,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // expandIconColumnIndex: PropTypes.number,
    // showHeader: PropTypes.bool,
    // title: PropTypes.func,
    // footer: PropTypes.func,
    // emptyText: PropTypes.func,
    // scroll: PropTypes.object,
    // rowRef: PropTypes.func,
    // getBodyWrapper: PropTypes.func,
    // children: PropTypes.node,
    // onHeaderCellClick:PropTypes.func,
    // colorFilterConfig:PropTypes.object,
    // checkboxConfig:PropTypes.object,
    // followConfig:PropTypes.object,
    // contextMenuConfig:PropTypes.object,
    // filterConfig:PropTypes.object,
}

Table.defaultProps = {
    data: [],
    useFixedHeader: false,
    expandIconAsCell: false,
    defaultExpandAllRows: false,
    defaultExpandedRowKeys: [],
    rowKey: 'key',
    singleSelect: false,
    rowClassName: () => '',
    expandedRowClassName: () => '',
    onExpand() {
    },
    onExpandedRowsChange() {
    },
    onRowClick() {
    },
    onRowDoubleClick() {
    },
    prefixCls: 'rc-table',
    bodyStyle: {},
    style: {},
    childrenColumnName: 'children',
    indentSize: 15,
    expandIconColumnIndex: 0,
    showHeader: true,
    scroll: {x: true, y: 400},
    rowRef: () => null,
    getBodyWrapper: body => body,
    onHeaderCellClick(){
    },
    onHeaderSortClick: null, //
    emptyText: () => 'No Data',
    //配置颜色过滤选项
    colorFilterConfig: {
        show: false,
        className: '',
        onHeaderSelect() {},
        onSelect(){
        },
        onVisibleChange(){
        }
    },
    //配置邮件态的过滤
    emailFilterConfig: {
        show: false,
        className: '',
        emailHeaderSelect() {},
        emailSelect(){
        }
    },
    //是否有附件
    accessoryConfig:{
      show: false,
      className: '',
      accessoryHeaderSelect() {},
      accessorySelect(){
      }
    },
    //配置checkbox是否显示选项
    checkboxConfig: {
        show: true,
        className: '',
        checkedAll: false,
        checkedRows: [],
        position: 'first'//参数为first/last,只出现在第一列或最后一列
    },
    //配置关注是否显示选项
    followConfig: {
        show: false,
        onHeaderClick(){},
        onClick(){
        },
        className: ''
    },
    //配置table根据数据显示不同的颜色 key:根据recod的某个字段，color:颜色 传一个数组对象
    colorConfig:[],
    contextMenuConfig: {
        enable: false
    },
    headerMenuConfig: {
        enable: false
    },
    filterConfig: {
        show: true,
        columns: []
    },
    search: {
        isShowSerach: false,
        callFucntion(){
        }
    } //是否显示搜索按钮,以及回调
};

export default Table;
