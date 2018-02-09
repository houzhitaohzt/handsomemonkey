import i18n from './../../../lib/i18n';
import React, { Component,PropTypes} from 'react';
import Table from '../../Table';
import '../assets/_productselect.less';
import xt from '../../../common/xt';
import Select, {Option,ConstMiniSelect} from '../../Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
export  class AddSelect extends Component{
    static defaultProps = {
        apiType:apiGet,
        apiHost:API_FOODING_DS,
        params:{keyWord:''},
        required: true,
        className: 'currency-btn select-from-currency ',
        titleClass: 'col-xs-8 col-md-8',
        disabled:false
    };
    constructor (props) {
        super(props);
        this.state={
            visbled:false,
            value:props.value,
        };
        this.productClick = this.productClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.showClick = this.showClick.bind(this);
    }
    showClick(id){
        this.setState({visbled:false});
    }
    //点击产品
    productClick(){
        this.setState({visbled:true});
    }

    onRowClick(row){
        let that = this;
        this.setState({visbled:false,value:row.localName || ""});
        let {fieldName} = this.props;
        this.props.form.setFieldsValue({[fieldName]: (row.id)});
        if(this.props.onChange){
            this.props.onChange(row);
        }
    }

    render(){
        let that = this;
        let {getNFieldProps,getFieldError} = this.props.form;
        let {fieldName, initialValue} = this.props;
        let field = getNFieldProps(fieldName, {
            initialValue: initialValue
        });
        if(this.props.fieldName=='customerFiltrateId'){
            var root1 =(
                <ul className="my-list" style={{width:'160px'}}>客户新建
                    {[      {localName:"今天新到客户",id:"31"},
                            {localName:"昨天新到客户",id:"32"},
                            {localName:"本周新到客户",id:"33"},
                            {localName:"上周新到客户",id:"34"},
                            {localName:"本月新到客户",id:"35"},
                            {localName:"上月新到客户",id:"36"}].map((e,i) => {
                            return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>

            );
            var root2 =(
                <ul className="my-list" style={{width:'160px',marginTop:'39px'}}>
                    {[
                            {localName:"本周要采购的客户",id:"42"},
                            {localName:"下周要采购的客户",id:"41"},
                            {localName:"无关注产品客户",id:"51"},
                            {localName:"无联系人客户",id:"52"},
                            {localName:"无接收自动报价客户",id:"53"}].map((e,i) => {
                        return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>

            );
            var root3 =(
                <ul className="my-list" style={{width:'160px'}}>客户最近联系时间
                    {
                        [{localName:"过去一周内无互动客户",id:"61"},
                            {localName:"过去两周内无互动客户",id:"62"},
                            {localName:"过去三周内无互动客户",id:"63"},
                            {localName:"过去30天内无互动客户",id:"64"},
                            {localName:"过去60天内无互动客户",id:"65"},
                            {localName:"过去90天内无互动客户",id:"66"}].map((e,i) => {
                            return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>

            );
            var root4 =(
                <ul className="my-list" style={{width:'160px'}}>商机
                    {
                        [{localName:"过去一周内无商机客户",id:"1"},
                            {localName:"过去二周内无商机客户",id:"2"},
                            {localName:"过去三周内无商机客户",id:"3"},
                            {localName:"过去30天内无商机客户",id:"4"},
                            {localName:"过去60天内无商机客户",id:"5"},
                            {localName:"过去90天内无商机客户",id:"6"}].map((e,i) => {
                            return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>

            );
            var root5 =(
                <ul className="my-list" style={{width:'160px'}}>订单产品
                    {
                        [{localName:"过去一周内无订单客户",id:"21"},
                            {localName:"过去二周内无订单客户",id:"22"},
                            {localName:"过去三周内无订单客户",id:"23"},
                            {localName:"过去30天内无订单客户",id:"24"},
                            {localName:"过去60天内无订单客户",id:"25"},
                            {localName:"过去90天内无订单客户",id:"26"}].map((e,i) => {
                            return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>

            );
            var root6 =(
                <ul className="my-list" style={{width:'180px'}}>客户及联系人邮件
                    {
                        [{localName:"过去一周内未收到邮件客户",id:"11"},
                            {localName:"过去二周内未收到邮件客户",id:"12"},
                            {localName:"过去三周内未收到邮件客户",id:"13"},
                            {localName:"过去30天内未收到邮件客户",id:"14"},
                            {localName:"过去60天内未收到邮件客户",id:"15"},
                            {localName:"过去90天内未收到邮件客户",id:"16"}].map((e,i) => {
                            return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>

            );
        }
        return <div style={{padding: 0}} className={getFieldError(fieldName)?' error-border product-select ' + this.props.titleClass:'product-select ' + this.props.titleClass}>
            <input type="text"  className='text-input-nowidth' placeholder={i18n.t(500350/*全部*/)} ref={field.ref}   onClick={this.productClick}  readOnly
                   style={{width:"100%",marginLeft:'70px'}} value={this.state.value} />
            <i className='foddingicon fooding-clear yashi clear' style={{position: 'absolute',right: '-55px',top: '0px', cursor: 'pointer',color:'#ccc',fontSize: '14px'}} onClick={that.onRowClick.bind(that,{})}></i>
            <div className={this.state.visbled?"dialog":"none"} tabIndex="-1" id={'dialog'} style={{width:'600px',minWidth:'300px',maxHeight:'350px',marginLeft:'500px',overflowY: 'auto', overflowX: 'hidden',borderColor:'#ccc',boxShadow:'0px 2px 0px #dadada'}}>
                <i className='foddingicon fooding-clear yashi clear'
                   style={{position: 'absolute',right: '-40px',top: '0px', cursor: 'pointer',
                       fontSize: '16px'}}
                   onClick={this.showClick}
                >
                    <span className ='path1'/>
                    <span className ='path2'/>
                </i>
                {root1}
                {root2}
                {root3}
                {root4}
                {root5}
                {root6}

            </div>
        </div>
    }
}
export  default AddSelect;
