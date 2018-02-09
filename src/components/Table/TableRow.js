import React, {PropTypes, Component} from 'react';
import TableCell from './TableCell';
import ExpandIcon from './ExpandIcon';
import ColorColumn from './ColorColumn';
import EmailColumn from './EmailColumn';
import shallowequal from 'shallowequal';
import {ContextMenu, ContextMenuTrigger, MenuItem} from '../RightKey';
import xt from '../../common/xt';

export class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState(props);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
        this.onCheckboxClick = this.onCheckboxClick.bind(this);
        this.onFollowClick = this.onFollowClick.bind(this);
        this.emailSelect = this.emailSelect.bind(this);
        this.accessorySelect = this.accessorySelect.bind(this);
        this.dbClick = false;
    }
    accessorySelect(e){
      e.preventDefault();
      e.stopPropagation();
      let isFol = this.state.isEmailReadly;
      // this.setState({isEmailReadly: isFol});
      if (this.props.accessoryConfig.accessorySelect) {
          const {
              record,
              index
          } = this.props;
          this.props.accessoryConfig.accessorySelect(record, index, isFol);  //是否有附件
      }
    }
    emailSelect(e){

      e.preventDefault();
      e.stopPropagation();

      // 已回复|已转发
      if(this.props.record.reTimes || this.props.record.fwTimes) return;

      let isFol = !this.state.isEmailReadly;
      this.setState({isEmailReadly: isFol});
      if (this.props.emailFilterConfig.emailSelect) {
          const {
              record,
              index
          } = this.props;
          this.props.emailFilterConfig.emailSelect(record, index, isFol);  //邮件是否已读
      }
    }
    initialState = (props) => ({
        hovered: false,
        //checkClassName:'select-check',
        isFollowed: props.record[props.followConfig.dataIndex],
        isEmailReadly:props.record[props.emailFilterConfig.dataIndex],
        isAccessory:props.record[props.accessoryConfig.dataIndex]
    });

    componentWillReceiveProps (props){
        let isFollowed = props.record[props.followConfig.dataIndex];
        if(isFollowed !== this.state.isFollowed){
            this.setState({isFollowed});
        }
        //邮件的是否已读
        let isEmailReadly = props.record[props.emailFilterConfig.dataIndex];
        if(isEmailReadly !== this.state.isEmailReadly){
            this.setState({isEmailReadly});
        }
        //是否有附件
        let isAccessory = props.record[props.accessoryConfig.dataIndex];
        if(isAccessory != this.state.isAccessory){
          this.setState({isAccessory});
        }
    }

    onCheckboxClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        /*
         let checkClass,checked=true;
         if(this.state.checkClassName.indexOf('select-checked')>=0){
         checkClass=this.state.checkClassName.replace('select-checked','').trim();
         checked=false;
         }else{
         checkClass=this.state.checkClassName+ ' select-checked';
         }
         this.setState(Object.assign({},this.state,{checkClassName:checkClass}));
         */
        const {
            record,
            index,
            onRowClick
        } = this.props;
        let {onRowCheckboxCellClick} = this.props;

        if (onRowCheckboxCellClick) {
            onRowCheckboxCellClick(record, index);
        }
        if (typeof onRowClick === 'function') {
            onRowClick(record, index);
        }
    }

    onFollowClick(e) {
        e.preventDefault();
        e.stopPropagation();
        let isFol = !this.state.isFollowed;
        this.setState({isFollowed: isFol});
        if (this.props.followConfig.onClick) {
            const {
                record,
                index
            } = this.props;
            this.props.followConfig.onClick(record, index, isFol);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return xt.equalsObject(nextProps, this.props) || xt.equalsObject(nextState, this.state);
    }

    componentDidMount() {
        const {store, hoverKey} = this.props;
        this.unsubscribe = store.subscribe(() => {
            if (store.getState().currentHoverKey === hoverKey) {
                this.setState({hovered: true});
            } else if (this.state.hovered === true) {
                this.setState({hovered: false});
            }
        });
    }

    componentWillUnmount() {
        this.props.onDestroy(this.props.record);
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    onRowClick(event) {
        this.onCheckboxClick(null);
        if (this.props.contextMenuConfig.enable) {
            const {
                record,
                expandable,
                expandRowByClick,
                expanded,
                onExpand,
            } = this.props;
            if (expandable && expandRowByClick) {
                onExpand(!expanded, record);
            }
        } else {
            const sender = Object.assign({}, event);
            window.setTimeout(() => {
                if (this.dbClick) {
                    return false;
                } else {
                    const {
                        record,
                        index,
                        onRowClick,
                        expandable,
                        expandRowByClick,
                        expanded,
                        onExpand,
                    } = this.props;
                    if (expandable && expandRowByClick) {
                        onExpand(!expanded, record);
                    }
                }
            }, 500);
        }
    }

    onRowDoubleClick(event) {
        if (!this.props.contextMenuConfig.enable) {
            event.preventDefault();
            event.stopPropagation();
            this.dbClick = true;
        }

        this.onCheckboxClick(null);
        const {record, index, onRowDoubleClick} = this.props;
        onRowDoubleClick(record, index, event);

        if (!this.props.contextMenuConfig.enable) {
            window.setTimeout(() => {
                this.dbClick = false;
            }, 500)
        }
    }

    onMouseEnter() {
        const {onHover, hoverKey} = this.props;
        onHover(true, hoverKey);
    }

    onMouseLeave() {
        const {onHover, hoverKey} = this.props;
        onHover(false, hoverKey);
    }

    collect = (props) => {
        return {record: props.name};
    }

    render() {
        const {
            prefixCls, columns, record, height, visible, index,
            expandIconColumnIndex, expandIconAsCell, expanded, expandRowByClick,
            expandable, onExpand, needIndentSpaced, indent, indentSize, checkboxConfig,
            colorFilterConfig, followConfig, contextMenuConfig,emailFilterConfig,accessoryConfig
        } = this.props;
        let {checkedAll, checked, showCheckbox} = checkboxConfig;
        let {className} = this.props;

        if (this.state.hovered) {
            className += ` ${prefixCls}-hover`;
        }
        const cells = [];
        const expandIcon = (
            <ExpandIcon
                expandable={expandable}
                prefixCls={prefixCls}
                onExpand={onExpand}
                needIndentSpaced={needIndentSpaced}
                expanded={expanded}
                record={record}
            />
        );
        if (showCheckbox && checkboxConfig.position === 'first') {
            let checkClass;
            if (checkedAll) {
                checkClass = 'select-check select-checked';
                className += `${prefixCls}-select-checked`;
            } else {
                checkClass = checked ? 'select-check select-checked' : 'select-check';
                //checkClass=this.state.checkClassName;
                className = checked? ` ${prefixCls}-select-checked`:""
            }

            cells.push(
                <td className={checkClass} key={'checkbox-cell'} data-type='checkbox-cell' onClick={(e) => {
                    this.onCheckboxClick(e)
                }}>
                    <span></span>
                </td>
            )
        }
        for(var i=0;i<this.props.colorConfig.length;i++){
            if(record[this.props.colorConfig[i].key] && !checked){
                className += ' ' + this.props.colorConfig[i].color;
            }
        }
        if (emailFilterConfig.show) {

          let classIcon = (row)=>{
              if(row['reTimes']) return <i className='foddingicon fooding-answer-mail-new' title='已回复' style={{fontSize: 16}}></i>; // 已回复
              if(row['fwTimes']) return <i className='foddingicon fooding-forward-mail-new' title='已转发' style={{fontSize: 16}}></i>; // 已转发

              return row['markRead'] ? // 已读|未读
                    <i className='foddingicon fooding-readly' title='已读' style={{fontSize: 16}}></i>
                    :
                    <i className='foddingicon fooding-no-readly' title='未读' style={{fontSize: 16}}></i>
          }

          cells.push(
              <td key={'email-cell'} className={'email-cell email-filter-header-cell'} data-type='email-cell' onClick={(e) => {
                  this.emailSelect(e)
              }}>
                  {classIcon(record)}
              </td>
          );

        }
        if (accessoryConfig.show) {
          let className = '';
          if (this.state.isAccessory) {
              className += ' foddingicon fooding-lianjie';
          } else {
              className += '';
          }
          cells.push(
              <td key={'accessory-cell'} className={'accessory-cell accessory-filter-header-cell'}
                 data-type='accessory-cell' onClick={(e) => {
                  this.accessorySelect(e)
              }}>
                  <i className={className} style={{fontSize: 16}}></i>
              </td>
          );

        }
        if (colorFilterConfig.show) {
            let value = record[colorFilterConfig.dataIndex];
            cells.push(
                <td key={'color-filter-cell'} className={'color-filter-cell'} data-type='color-filter-cell'>
                    <ColorColumn onSelect={colorFilterConfig.onSelect} onVisibleChange={colorFilterConfig.onVisibleChange} value={value}
                                 rowData={record}/>
                </td>
            );
        }
        if (followConfig.show) {
            let className = 'glyphicon';
            if (this.state.isFollowed) {
                className += ' glyphicon-star';
            } else {
                className += ' glyphicon-star-empty';
            }
            cells.push(
                <td key={'follow-cell'} className={'follow-cell'} data-type='follow-cell' onClick={(e) => {
                    this.onFollowClick(e)
                }}>
                    <span className={className} style={{fontSize: 16}}></span>
                </td>
            );
        }
        if (this.props.search.isShowSerach) {
            cells.push(
                <td key={'search'} className={'follow-cell'} data-type='search'>
                    <span className={className}></span>
                </td>
            );
        }
        for (let i = 0; i < columns.length; i++) {
            if(columns[i].visible === false) continue;
            if (expandIconAsCell && i === 0) {
                cells.push(
                    <td
                        className={`${prefixCls}-expand-icon-cell`}
                        key="rc-table-expand-icon-cell"
                    >
                        {expandIcon}
                    </td>
                );
            }

            const isColumnHaveExpandIcon = (expandIconAsCell || expandRowByClick)
                ? false : (i === expandIconColumnIndex);
            let indexKey = columns[i].key || columns[i].dataIndex;
            cells.push(
                <TableCell
                    prefixCls={prefixCls}
                    record={record}
                    indentSize={indentSize}
                    indent={indent}
                    index={{index:index,key: indexKey}}
                    column={columns[i]}
                    key={indexKey}
                    expandIcon={isColumnHaveExpandIcon ? expandIcon : null}
                />
            );
        }

        if (showCheckbox && checkboxConfig.position == 'last') {
            let checkClass;
            if (checkedAll) {
                checkClass = 'select-check select-checked';
            } else {
                checkClass = checked ? 'select-check select-checked' : 'select-check';
                //checkClass=this.state.checkClassName;
            }
            cells.push(
                <td className={checkClass} key={'checkbox-cell'} data-type='checkbox-cell' onClick={(e) => {
                    this.onCheckboxClick(e)
                }}>
                    <span></span>
                </td>
            )
        }
        const style = {height};
        if (!visible) {
            style.display = 'none';
        }

        const trClassName = `${prefixCls} ${className} ${prefixCls}-level-${indent}`;
        let inner;
        if (contextMenuConfig.enable && null != contextMenuConfig.contextMenuId) {
            let obj = Object.assign({},{index: this.props.index,record:record});
            inner = <ContextMenuTrigger renderTag='tr' name={obj} id={contextMenuConfig.contextMenuId} key={index} collect={this.collect}
                                        attributes={{className: trClassName}} onClick={this.onRowClick} onDbClick={this.onRowDoubleClick}
                                        onMouseEnter={this.onMouseEnter}
                                        onMouseLeave={this.onMouseLeave}>
                {cells}
            </ContextMenuTrigger>
        } else {
            inner = <tr
                onClick={(e) => this.onRowClick(e)}
                onDoubleClick={(e) => this.onRowDoubleClick(e)}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                className={`${prefixCls} ${className} ${prefixCls}-level-${indent}`}
                style={style}
            >
                {cells}
            </tr>
        }
        return inner;
    }

}

TableRow.propTypes = {
    // onDestroy: PropTypes.func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // record: PropTypes.object,
    // prefixCls: PropTypes.string,
    // expandIconColumnIndex: PropTypes.number,
    // onHover: PropTypes.func,
    // columns: PropTypes.array,
    // height: PropTypes.oneOfType([
    //   PropTypes.string,
    //   PropTypes.number,
    // ]),
    // visible: PropTypes.bool,
    // index: PropTypes.number,
    // hoverKey: PropTypes.any,
    // expanded: PropTypes.bool,
    // expandable: PropTypes.any,
    // onExpand: PropTypes.func,
    // needIndentSpaced: PropTypes.bool,
    // className: PropTypes.string,
    // indent: PropTypes.number,
    // indentSize: PropTypes.number,
    // expandIconAsCell: PropTypes.bool,
    // expandRowByClick: PropTypes.bool,
    // store: PropTypes.object.isRequired,
    // onRowCheckboxCellClick:PropTypes.func,
    // checkboxConfig:PropTypes.object,
    // colorFilterConfig:PropTypes.object,
    // followConfig:PropTypes.object
}

TableRow.defaultProps = {
    onRowClick() {
    },
    onRowDoubleClick() {
    },
    onDestroy() {
    },
    expandIconColumnIndex: 0,
    expandRowByClick: false,
    onHover() {
    },
    onRowCheckboxCellClick(){
    },

    checkboxConfig: {
        showCheckbox: true,
        checked: false,
        position: 'first'
    },
    emailFilterConfig: {
        show: false,
        emailSelect(){
        }
    },
    accessoryConfig: {
        show: false,
        accessorySelect(){
        }
    },
    colorFilterConfig: {
        show: false,
        onSelect(){
        },
        onVisibleChange(){
        },
    },
    followConfig: {
        show: false,
        dataIndex: 'followIndex',
        onClick(){
        }
    }
}
export default TableRow;
