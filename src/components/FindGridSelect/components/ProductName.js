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
            columns_party:[{
                title : i18n.t(100000/*代码*/),
                dataIndex : 'code',
                key : "code",
                width : '15%',
                render(data,row,index){
                    return <div>{data}</div>;
                }
            },{
                title : i18n.t(100001/*名称*/),
                dataIndex : "localName",
                key : "localName",
                width : "35%",
                render(data,row,index){
                    return <div className={'text-ellipsis shenglue'}>{data}</div>;
                }
            },{
                title : i18n.t(100226/*英文名称*/),
                dataIndex : "nameValues",
                key : "nameValues",
                width : "50%",
                render(data,row,index){
                    return <div>{data?data.en:''}</div>;
                }
            }],
            data:[],
            value:this.props.value,
            searchValue:'',
            isSearch:this.props.isSearch || true
        };
        this.productClick = this.productClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.showClick = this.showClick.bind(this);
        this.onBiput = this.onBiput.bind(this);
        this.clear = this.clear.bind(this);
        this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
    }
    onRowDoubleClick(record,index,checked,e){
    }
    clear(initAjax){
        let that = this;
        this.setState({
            value:undefined
        },function(){
            if(initAjax){
                initAjax({});
            }
        });
    }
    showClick(id){
        this.setState({
            visbled:false
        });
    }
    //回调回来的函数
    outClick = data => {
        //undefined 时，表示没有供应商，data为真时，表示有供应商
        if(!data){
            this.setState({isSearch:true},() => this.searchAjax() )
        }else{
            this.setState({
                isSearch:false,
                visbled:true,
                data:data
            },() => {
                document.getElementById("dialog").focus();
            })
        }
    }
    //点击产品
    productClick(){
        if(this.props.disabled) return false;
        let that = this;
        if(that.props.productClick){
            if(this.state.visbled){
                that.setState({
                    isSearch:true,
                    visbled:false
                })
            }else{
                that.props.productClick(this.outClick.bind(this))
            }
        }else{
            if(this.state.visbled){
                that.setState({
                    visbled:false
                });
            }else{
                this.searchAjax();
            }
        }
    }

    //搜索时拉取到的数据
    searchAjax = () => {
        let that = this;
        const {apiHost, apiType,params} = this.props;
        apiType(apiHost,this.props.apiUri,params,(response)=>{
            that.setState({
                visbled:true,
                data:response.data || []
            },()=>{
                document.getElementById("dialog").focus();
            });
        },(error)=>{

        })
    }
    onRowClick(row){
        let that = this;
        this.setState({
            visbled:false,
            value:row
        });
        let {fieldName} = this.props;
        this.props.form.setFieldsValue({[fieldName]: (row.id)});
        if(this.props.onChange){
            this.props.onChange(row);
        }
    }
    onChange(e){
        this.setState({
            searchValue:e.target.value
        });
    }
    search(){
        let that = this;
        const {apiHost, apiType,params} = this.props;
        let value = Object.assign({},params,{keyWord:this.state.searchValue});
        apiType(apiHost,this.props.apiUri,value,(response)=>{
            that.setState({
                data:response.data
            });
        },(error)=>{

        })
    }

    /**
     * 获取验证规则
     * @param props
     * @returns {*}
     */
    getValidateRules = (props) =>{
        let validate = props.required;
        return validate && xt.isObject(this.props.initialValue) ?
            (rule, value, callback, source, options)=>{
                let errors = [];
                if( xt.isEmpty(value)){
                    errors.push(rule.field + " is required");
                } else if(xt.isObject(value)){
                    if(xt.isEmpty(value.s_label)){
                        errors.push(rule.field + ".s_label is required");
                    }
                }
                callback(errors);
            }: {required: validate}
    };

    onBiput(){
        let that = this;
        that.setState({
            visbled:true
        })
    }

    _onKeyUpEvent = event =>{
        if(event.keyCode === 13){
            this.search();
        }
    };

    render(){
        let {getNFieldProps,getFieldError} = this.props.form;
        let {fieldName, initialValue} = this.props;
         let required = this.props.required;
        let field = getNFieldProps(fieldName, {
            validateFirst: true,
            rules: [this.getValidateRules(this.props)],
            initialValue: initialValue
        });
        let data = this.state.value || this.props.value;
        return <div style={{padding: 0}}
                    className={getFieldError(fieldName)?' error-border product-select ' + this.props.titleClass:'product-select ' + this.props.titleClass}>
            <input type="text" className='text-input-nowidth' placeholder=""
                   ref={field.ref} value={data && data.localName || ''} onChange={field.onChange}
                   onClick={this.productClick}
                   readOnly
                   style={{width:"100%"}}
            />
            <i className={data && !this.props.required ?'foddingicon fooding-clear yashi clear':'none'}
               style={{position: 'absolute',right: '32px',top: '9px', cursor: 'pointer',
                   color:'#ccc',
                   fontSize: '14px'}}
               onClick={()=>{
                   this.setState({
                       value:undefined
                   });
                   this.props.form.setFieldsValue({[fieldName]:undefined})
               }}
            >
                <span className ='path1'></span>
                <span className ='path2'></span>
            </i>
            <i className="foddingicon fooding-search_icon search-icon" onClick={this.productClick}/>
            <div className={this.state.visbled?"dialog":"none"} tabIndex="-1" id={'dialog'}>
                <i className='foddingicon fooding-clear yashi clear'
                   style={{position: 'absolute',right: '10px',top: '10px', cursor: 'pointer',
                       color:'#ccc',
                       fontSize: '24px'}}
                   onClick={this.showClick}
                >
                    <span className ='path1'></span>
                    <span className ='path2'></span>
                </i>
                <div className={this.state.isSearch?'search-head':'none'}>
                    <label>{i18n.t(200041/*内容*/)}</label>
                    <input  className={"text-input"}
                            id = 'btn'
                            value={this.state.searchValue}
                            onKeyUp={this._onKeyUpEvent}
                            onBlur={this.onBiput}
                            onChange={this.onChange}/>
                    <span onClick={this.search}>模糊查询</span>
                </div>
                <div className="common-party-table">
                    <Table
                        columns={this.state.columns_party}
                        data={this.state.data}
                        checkboxConfig={{show:false}}
                        onRowClick={this.onRowClick}
                        colorFilterConfig={{show:false}}
                        onRowDoubleClick ={this.onRowDoubleClick}
                        followConfig={{show:false}}
                        prefixCls={"rc-confirm-table"}
                        scroll={{x:true, y:250}}
                    />
                </div>
            </div>
        </div>
    }
}
export  default AddSelect;
