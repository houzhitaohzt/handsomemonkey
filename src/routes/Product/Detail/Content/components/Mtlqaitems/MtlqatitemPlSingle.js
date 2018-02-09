import React, { Component,PropTypes } from 'react';
import i18n from './../../../../../../lib/i18n';
import RightKey from '../../../../../../components/RightKey/RightKey';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../../services/apiCall';
//引入提示
import Tooltip from 'antd/lib/tooltip';
class MtlqatitemPlSingle extends Component{
    constructor(props){
        super(props)
    }
    handleClick = (e,data) => {
        let that = this;
        that.props.commonProps.handleClick(e,data);
    }
    render(){
        const {item, itemSelected, dragHandle,commonProps} = this.props;
        const {menuObj} = commonProps;
        return(        
            <li className={'mtlqtitem-ul-content'}>
                <span className={'mtlqtitem-ul-content-drag'}>
                    {dragHandle(<a className={'mtlqtitem-ul-content-drag-show'}><span className={"mtlqtitem-ul-content-drag-show-top"}></span><span className = "mtlqtitem-ul-content-drag-show-middle"></span><span className = "mtlqtitem-ul-content-drag-show-foot"></span></a>)}
                </span>
                <span className={'mtlqtitem-ul-content-main'}><i style = {{display: 'inline-block',textAlign: 'center'}} className={item.majMrk?'foddingicon fooding-dui-icon2':''}></i></span>
                {
                    item.qaItem&&item.qaItem.localName?
                    <Tooltip
                        placement="topRight"
                        mouseEnterDelay={0.2}
                        // arrowPointAtCenter={true}
                        mouseLeaveDelay={0.1}
                        overlay={item.qaItem.localName}
                    >
                        <span className={'mtlqtitem-ul-content-name'}>{item.qaItem.localName}</span>  
                    </Tooltip>:<span className={'mtlqtitem-ul-content-name'}></span>      
                }                                       
                <span className={'mtlqtitem-ul-content-calsymbol'}> {item.calSymBol&&item.calSymBol.name?item.calSymBol.name:""}</span>
                {
                    item.maxQaValue?<Tooltip
                        placement="top"
                        mouseEnterDelay={0.2}
                        arrowPointAtCenter={true}
                        mouseLeaveDelay={0.1}
                        overlay={item.maxQaValue}
                    >
                        <span className={'mtlqtitem-ul-content-target'}>{item.maxQaValue}</span>  
                    </Tooltip>:<span className={'mtlqtitem-ul-content-target'}></span>
                }
                {
                    item.testMeth&&item.testMeth.localName?
                    <Tooltip
                        placement="topLeft"
                        mouseEnterDelay={0.2}
                        // arrowPointAtCenter={true}
                        mouseLeaveDelay={0.1}
                        overlay={item.testMeth.localName}
                    >
                        <span className={'mtlqtitem-ul-content-testmethod'}>{item.testMeth.localName}</span>
                    </Tooltip>:<span className={'mtlqtitem-ul-content-testmethod'}></span>      
                }              
                <span className={'mtlqtitem-ul-content-operate'}>
                {
                    permissionsBtn(menuObj.permissionsEdit)?<i className={'foddingicon fooding-alter_icon2'} onClick={this.handleClick.bind(this,null,{action:2,name:item})}></i>:""
                }
                {
                    permissionsBtn(menuObj.permissionsDelete)?<i className={'foddingicon fooding-delete-icon3'} onClick={this.handleClick.bind(this,null,{action:3,name:item})}></i>:""
                }
                </span>
                
            </li>
        )
    }
}
export default MtlqatitemPlSingle;





//   const {item, itemSelected, dragHandle} = this.props;
//     let array = [{type:1,child:<div><i className={'foddingicon fooding-add-icon3'}></i><span>{i18n.t(100392/*新增*/)}</span></div>},{type:2,child:<div><i className={'foddingicon fooding-alter_icon2'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>},{type:3,child:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>}];
//     return(        
//     <RightKey array ={array} handleClick={this.handleClick} id={item.id} data={item} isShowMenu={true}>
//         <li className={'mtlqtitem-ul-content'}>
//             <span className={'mtlqtitem-ul-content-drag'}>
//                 {dragHandle(<a className={'mtlqtitem-ul-content-drag-show'}></a>)}
//             </span>
//             <span className={'mtlqtitem-ul-content-main'}>{item.majMrk?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</span>
//             <span className={'mtlqtitem-ul-content-name'}>{item.qaItem&&item.qaItem.localName?item.qaItem.localName:""}</span>               
//             <span className={'mtlqtitem-ul-content-calsymbol'}> {item.calSymBol&&item.calSymBol.name?item.calSymBol.name:""}</span>
//             <span className={'mtlqtitem-ul-content-target'}>{item.maxQaValue || ""}</span>
//             <span className={'mtlqtitem-ul-content-testmethod'}>{item.testMeth&&item.testMeth.localName?item.testMeth.localName:""}</span>
//             <span className={'mtlqtitem-ul-content-operate'}><i className={'foddingicon fooding-add-icon3'} onClick={this.handleClick.bind(this,null,{action:1,name:item})}></i><i className={'foddingicon fooding-alter_icon2'} onClick={this.handleClick.bind(this,null,{action:2,name:item})}></i><i className={'foddingicon fooding-delete-icon3'} onClick={this.handleClick.bind(this,null,{action:3,name:item})}></i></span>
//         </li>
//     </RightKey>
//     )