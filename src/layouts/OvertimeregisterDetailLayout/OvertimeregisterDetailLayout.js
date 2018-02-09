import i18n from './../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import SODetailsHead from '../../routes/Overtimeregister/Detail/Header/SODetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,API_FOODING_HR } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import Dialog from '../../components/Dialog/Dialog';//弹层

import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/Overtimeregister/Detail/Content/components/OvertimeregisterDetail';
import Accessory from  '../../routes/Overtimeregister/Accessory/components/Accessory';
import Confirm from "../../components/Dialog/Confirm";
export class OvertimeregisterDetailLayout extends Component{
    constructor(props) {
        super(props);
        this.state={
            paddingTop:115,
            id:this.props.location.query.billId,
            getOne:{},
            value:{},
            curentId:DetailCommon.saleOrder[this.props.location.query.id] || this.props.location.query.index  || 'detail',
            isDetail:false
        };
        this.handleResize=this.handleResize.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }
        DetailCommon.saleOrder[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    onCancel(){
        this.setState({
            showDilaog: false
        });
    }

    handleResize(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
        this.setState({scrollHeight:sch+'px'});
    };
    componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
        this.setState({scrollHeight:sch+'px'});

    };
    componentWillUnmount() {
        // window.removeEventListener('resize', this.handleResize);
    };
    render(){
        let children=Object.assign({},this.props.children,{});
        let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,getOne:this.state.getOne,id:this.state.id,value:this.state.value});
        children.props=newProps;
        return (

            <div className='container-body'>
                <SODetailsHead   id={this.state.id}
                                curentId ={this.state.curentId}
                                onClickLink ={this.onClickLink}
                                />
                <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
                    <div className={this.state.curentId == 'detail' ?"":"none"}>
                        <Detail {...newProps} isDetail ={this.state.isDetail} detail ={no => this.detail = no}/>
                    </div>
                    <div className={this.state.curentId == 'accessory' ?"":"none"}>
                        <Accessory {...newProps}  isDetail={true} accessory={no => this.accessory = no} />
                    </div>
                </div>
                <Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader={this.state.showHeader}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}
OvertimeregisterDetailLayout.propTypes = {
    children : React.PropTypes.element.isRequired
}

export default OvertimeregisterDetailLayout

