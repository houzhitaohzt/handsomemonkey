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
        var bussiness =(
                <ul className="my-list">
                    {
                        [{localName:"今天要结束的商机",id:"1"},
                            {localName:"明天要结束的商机",id:"2"},
                            {localName:"本周要结束的商机",id:"3"},
                            {localName:"下周要结束的商机",id:"4"},
                            {localName:"已过期未关闭的商机",id:"5"}].map((e,i) => {
                            return <li onClick={that.onRowClick.bind(that,e)} key={e.id}>{e.localName}</li>
                        })
                    }
                </ul>
            );

        return <div style={{padding: 0}} className={getFieldError(fieldName)?' error-border product-select ' + this.props.titleClass:'product-select ' + this.props.titleClass}>
            <input type="text"  className='text-input-nowidth' placeholder={i18n.t(500350/*全部*/)} ref={field.ref}   onClick={this.productClick}  readOnly
                   style={{width:"100%",marginLeft:'70px'}} value={this.state.value} />
            <i className='foddingicon fooding-clear yashi clear' style={{position: 'absolute',right: '-55px',top: '0px', cursor: 'pointer',color:'#ccc',fontSize: '14px'}} onClick={that.onRowClick.bind(that,{})}></i>
            <div className={this.state.visbled?"dialog scroll":"none"} tabIndex="-1" id={'dialog'} style={{width:'10%',minWidth:'200px',maxHeight:'190px',marginLeft:'500px',overflowY: 'auto',borderColor:'#ccc',boxShadow:'0px 2px 0px #dadada',overflowX: 'hidden'}}>
                <i className='foddingicon fooding-clear yashi clear'
                   style={{position: 'absolute',right: '-40px',top: '0px', cursor: 'pointer',
                       fontSize: '16px'}}
                   onClick={this.showClick}
                >
                    <span className ='path1'/>
                    <span className ='path2'/>
                </i>

                {bussiness}
            </div>
        </div>
    }
}
export  default AddSelect;
