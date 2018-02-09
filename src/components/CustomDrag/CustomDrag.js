import React, { Component, PropTypes } from "react";

import DraggableList from "react-draggable-list";
import "./index.less";


class Template extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {item, itemSelected, dragHandle,commonProps} = this.props;
        let {columns,otherData} = commonProps;
        return (<li className={'custom-drag-table-body'}>
            <h4 className={'custom-drag-table-body-draghandle'}>
                {dragHandle(<a className={'custom-drag-table-body-draghandle-move'}>
                    <span className={"custom-drag-table-body-draghandle-move-top"}></span>
                    <span className = {"custom-drag-table-body-draghandle-move-middle"}></span>
                    <span className = {"custom-drag-table-body-draghandle-move-foot"}></span></a>)}
            </h4>
            {columns.map((e,index) => { return <h4 style={{width:e.width,lineHeight:"40px"}} key={e.key || index}>{e.render(item[e.key],item,index,otherData)}</h4> })}
        </li>)
    }
}

class CustomDrag extends Component{
    static propTypes = {
        itemKey:PropTypes.string,
        template:PropTypes.node,
        list:PropTypes.array,
        columns:PropTypes.array,
        prefixCls:PropTypes.string,
        onMoveEnd:PropTypes.func
    };

    static defaultProps = {
      itemKey:"id",
      template:<Template />,
      data:[],
      columns:[],
      otherData:{},
      prefixCls:'custom-drag',
      onMoveEnd:() => {}

    };

    constructor(props){
        super(props);
        this.onMoveEnd=this.onMoveEnd.bind(this);
    }

    onMoveEnd = (list,current) => {
        this.props.onMoveEnd && this.props.onMoveEnd(list,current);
    };

    renderHead = (item,index) => {
      return (<h3 style={{width:item.width,lineHeight:"50px"}} key={index}>{item.title || ""}</h3>);
    };


    render(){
        let {itemKey, columns, otherData, data, prefixCls} = this.props;
        return (<div className={`${prefixCls}`}>
            <ul className={`${prefixCls}-table`}>
                <li className={`${prefixCls}-table-head`}>
                    <h3 className={`${prefixCls}-table-head-draghandle`}></h3>
                    {columns.map(this.renderHead)}
                </li>
                <DraggableList
                    itemKey={itemKey}
                    template={Template}
                    list={data}
                    onMoveEnd={this.onMoveEnd}
                    commonProps={{columns:columns,otherData:otherData}}
                    padding={1}
                />
            </ul>
        </div>)
    }
}

export default CustomDrag;
