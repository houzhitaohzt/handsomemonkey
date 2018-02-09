import React, {PropTypes, Component} from 'react';
import shallowequal from 'shallowequal';
import ColorColumn from './ColorColumn';
import {ContextMenu, ContextMenuTrigger, MenuItem} from '../RightKey';
import xt from '../../common/xt';

export class TableHeader extends Component {
    constructor(props) {
        super(props);
        this.handClick = this.handClick.bind(this);

        let {checkedAll} = props, checkedClass;
        this.checkedAll = checkedAll;
        this.search = this.search.bind(this);
        this.state = {
            isFollowed: false,
            showSearch: false,
            sortType: 'desc',
            sortColumn: '',
        }
        /*
         if(checkedAll){
         checkedClass='select-check select-checked';
         }else{
         checkedClass='select-check';
         }
         this.state={
         checkClassName:checkedClass
         }*/
    }

    static propTypes = {
        // prefixCls: PropTypes.string,
        // rowStyle: PropTypes.object,
        // rows: PropTypes.array,
        // checkedAll:PropTypes.bool,
        // colorFilterConfig:PropTypes.object,
        // followConfig:PropTypes.object
    };

    shouldComponentUpdate(nextProps, nextState) {
        return xt.equalsObject(nextProps, this.props) || xt.equalsObject(nextState, this.state);
    }

    search() {
        let dataArray = [];
        let rows = this.props.rows[1];
        this.props.search.callFucntion(rows);
    }

    handClick(e, cellProps) {
        let type = 'data-cell';
        let isFollowed = this.state.isFollowed;
        switch (cellProps.data ? cellProps.data.type : '') {
            case "checkbox":
                this.checkedAll = !this.checkedAll;
                /*
                 let checkClass;
                 if(this.state.checkClassName.indexOf('select-checked')>=0){
                 checkClass=this.state.checkClassName.replace('select-checked','').trim();
                 }else{
                 checkClass=this.state.checkClassName+ ' select-checked';
                 checkedAll=true;
                 }
                 this.setState({
                 checkClassName:checkClass
                 });*/
                type = 'checkbox-cell';
                break;
            case "follow":
                this.setState({isFollowed: isFollowed = !this.state.isFollowed});
                type = 'follow-cell';
                break;
            case "search":
                this.setState({ showSearch: !this.state.showSearch});
                break;
            case 'search_01':
                this.search();
            default:
                type = 'sort-cell';
                this._sortColumn(cellProps);
                break;
        }
        const {onHeaderCellClick} = this.props;
        if (onHeaderCellClick) {
            onHeaderCellClick(e, Object.assign({}, cellProps, {checkedAll: this.checkedAll, type: type, followed: isFollowed}));
        }
    }

    _sortColumn = cell =>{
        const {onHeaderSortClick} = this.props;
        if(!xt.isEmpty(cell.sort) && onHeaderSortClick){
            let {sortType, sortColumn} = this.state;
            let type = sortType === 'desc' && sortColumn === cell.sort ? 'asc': 'desc';
            this.setState({sortType: type, sortColumn: cell.sort});


            if (onHeaderSortClick) {
                onHeaderSortClick({column: cell.sort, order: type});
            }
        }
    };

    renderSort (cell) {
        const {onHeaderSortClick} = this.props;
        const {sortColumn, sortType} = this.state;
        return (
            !xt.isEmpty(cell.sort) && onHeaderSortClick && sortColumn === cell.sort?<div className="sort">
                <label className="sort-title">{cell.children}</label>
                <div className="sort-order">
                    {/*<div className="s1"><i className={'foddingicon fooding-order-' + (sortColumn === cell.sort && sortType === 'asc'  ? '02': '01')}/></div>*/}
                    {/*<div className="s2"><i className={'foddingicon fooding-order-' + (sortColumn === cell.sort && sortType === 'desc' ? '02': '01')}/></div>*/}

                    <div className="s1"><i className={'foddingicon fooding-' + (sortColumn === cell.sort && sortType === 'asc'  ? 'order-02': 'oreder-01')}/></div>
                </div>
            </div>: cell.children
        );
    }

    render() {
        const {prefixCls, rowStyle, rows, checkedAll, colorFilterConfig, headerMenuConfig} = this.props;
        let checkedClass;
        this.checkedAll = checkedAll;
        if (checkedAll) {
            checkedClass = 'select-check select-checked';
        } else {
            checkedClass = 'select-check';
        }
        let temp = rows[0].filter((col, index) => (index >= 0));
        let serachDom;
        if (this.props.search.isShowSerach) {
            let searchdata = rows[1].filter((col, index) => (index >= 0));
            serachDom = (
                <tr style={rowStyle} className={this.state.showSearch ? 'serach' : 'none'}>
                    {
                        searchdata.map((cellProps1, i) => {
                            let isCheckbox = false;
                            if ('data' in cellProps1 && 'type' in cellProps1.data && cellProps1.data.type == 'checkbox') {
                                isCheckbox = true;
                            }
                            if ('data' in cellProps1 && 'type' in cellProps1.data && cellProps1.data.type == 'follow') {
                                let classFollow = 'glyphicon';

                                if (this.state.isFollowed) {
                                    classFollow += ' glyphicon-star';
                                } else {
                                    classFollow += '  glyphicon-star-empty';
                                }
                                cellProps1.children = (<span className={classFollow}/>);
                            }
                            checkedClass += ' ' + cellProps1.className;
                            return (<th  {...cellProps1} className={isCheckbox == true ? checkedClass : cellProps1.className} key={i}
                                         onClick={(e) => this.handClick(e, cellProps1)}/>
                            )
                        })
                    }
                </tr>)
        }
        let tdInner = temp.map((cellProps, i) => {
            if(cellProps.visible === false) return;
                let isCheckbox = false;
                if ('data' in cellProps && 'type' in cellProps.data && cellProps.data.type == 'checkbox') {
                    isCheckbox = true;
                }
                if ('data' in cellProps && 'type' in cellProps.data && cellProps.data.type == 'follow') {
                    let classFollow = 'glyphicon';

                    if (this.state.isFollowed) {
                        classFollow += ' glyphicon-star';
                    } else {
                        classFollow += '  glyphicon-star-empty';
                    }
                    cellProps.children = (<span className={classFollow} style={{fontSize: 16}}/>);
                }
                checkedClass += ' ' + cellProps.className;
                return (<th data={cellProps.data}
                            className={isCheckbox == true ? checkedClass : cellProps.className} key={i}
                            onClick={(e) => this.handClick(e, cellProps)}>
                    {this.renderSort(cellProps)}
                </th>)
            });

        let inner;
        if(headerMenuConfig.enable && headerMenuConfig.contextMenuId){
            inner =
                <ContextMenuTrigger renderTag='tr' id={headerMenuConfig.contextMenuId} attributes={{className: rowStyle}}>
                    {tdInner}
                </ContextMenuTrigger>

        } else {
            inner =
                <tr style={rowStyle}>
                    {tdInner}
                </tr>
        }

        return (
            <thead className={`${prefixCls}-theader`}>
            {inner}
            {serachDom}
            </thead>
        );
    }
}

export default TableHeader;
