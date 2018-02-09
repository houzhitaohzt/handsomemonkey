import React, { Component } from "react";

class Template extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const {item, itemSelected, dragHandle,commonProps} = this.props;
        let {columns,otherData} = commonProps;
        console.log(columns, 'columns');
        return (<li>
            {dragHandle(<h4>
                <span className={"mtlqtitem-ul-content-drag-show-top"}></span>
                <span className = "mtlqtitem-ul-content-drag-show-middle"></span>
                <span className = "mtlqtitem-ul-content-drag-show-foot"></span></h4>)}
            {columns.map((e,index) => { return e.render(item[e.key],item,index,otherData) })}
        </li>)
    }
}

export default Template;