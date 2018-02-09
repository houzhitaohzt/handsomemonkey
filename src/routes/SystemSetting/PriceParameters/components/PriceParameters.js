import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm} from "../../../../components/Form";

//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Select, {ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉

import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_MAIL,API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import FilterHeader from "./FilterHeader";
//复选框
import Checkbox from '../../../../components/CheckBox';
import WebData from "../../../../common/WebData";

//翻译
const Translation = {
    "CGJ":i18n.t(201207/*采购价*/),
    "BZF":i18n.t(201208/*包装费*/),
    "DGF":i18n.t(201209/*到港运费*/),
    "TPF":i18n.t(200724/*托盘费*/),
    "JYF":i18n.t(201210/*检验费*/),
    "JZF":i18n.t(200722/*监装费*/),
    "GZF":i18n.t(200716/*港杂费*/),
    "YSF":i18n.t(200719/*运输费*/),
    "ZSF":i18n.t(201211/*证书费*/),
    "BXF":i18n.t(201212/*保险费*/),
    "XBF":i18n.t(200720/*信保费*/),
    "YJF":i18n.t(201213/*佣金费*/),
    "ZJF":i18n.t(200717/*资金费*/)
}


const isArray = (obj) => {
        return Array.isArray(obj) ||
            (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');
}
//判断在不在里面
const isSingleInArray = (key,array) => {
    let bol = false;
    if(!key || !isArray(array) || !array.length) bol = false;
    for(var kv of array){
        if(kv === key){
            bol = true;
            break;
        }
    }
    return bol;
}


// 自动推广报价 页面
class PriceDIV extends Component {

    constructor(props) {
        super(props);

        // state init 
        this.state = {
            data:{}, // 
            action: true, // 编辑true 保存false
        };
    }

    componentDidMount() {
        this.getPages();
    };

    componentWillUnmount() {
    }    

    // 切换 
    changeHandle = (key)=> {
        let that = this;
        let {data} = this.state;
        this.setState({data: Object.assign(data,{num:0})},function(){
            this.setState({data: Object.assign(data,{type:key,num:1})});
        });
    }

    //初始化拉取所有的数据
    getPages = () => {

        apiGet(API_FOODING_ERP, '/promotesetting/getOne',{}, 
            (response) => {
                this.setState({
                    data: response.data || {},
                });
            },(error) => {
                errorTips(error.message)
        });

    }

    // 保存 
    saveHandle = (key)=>{
        let that = this;
        let {action} = this.state;
        let param = this.props.form.getFieldsValue();

        if(action) { // 编辑
            this.setState({action:false});            
        } else{ // 保存 
            apiPost(API_FOODING_ERP, '/promotesetting/save',param, 
                (response) => {
                    that.setState({action:true});  
                    ServiceTips({text:response.message,type:'success'});
                    that.getPages();
                },(errors) => {
                    ServiceTips({text:errors.message,type:'error'});
            });
        }
    }

    render(){
        let {data,action} = this.state;
		const {getNFieldProps,getFieldError} = this.props.form;
        
        // 控制数据刷新 
        if(!data['num']) return <b></b>;

        // 周 | 月 
        let date = data['type'] == 1 ? 
            [{id:1,name:i18n.t(400172/*星期一*/)},{id:2,name:i18n.t(400173/*星期二*/)},{id:3,name:i18n.t(400174/*星期三*/)},{id:4,name:i18n.t(400175/*星期四*/)},{id:5,name:i18n.t(400176/*星期五*/)},{id:6,name:i18n.t(400177/*星期六*/)},{id:7,name:i18n.t(400178/*星期日*/)}]
            : 
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(o=>{ return {id:o,name:o} })

        return <div>
            <div className={'system-staff-list-header'} style={{padding:"0 20px"}}>
                <div style={{fontSize:"18px",lineHeight:"48px",height:"48px",borderTop:"1px solid #ccc",borderBottom:"1px solid #ccc",textIndent:"10px"}}>
                    {i18n.t(600192/*自动推广报价*/)}
                </div>
                <div className={'system-staff-list-header-key'}>
                    <i onClick={this.saveHandle.bind(this,action)} className={ action ? "foddingicon fooding-alter_icon2" : "foddingicon fooding-save bg"} title={ action ? i18n.t(100439/*编辑*/) : i18n.t(100430/*保存*/) }></i>
                </div>                  
            </div>
            <div style={{padding:'10px'}}>  
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>{i18n.t(600193/*定期推广*/)}</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <Select
                    {...getNFieldProps('type',{
                        initialValue: String(data['type'])							
                    })}  
                    disabled={action}
                    style={{width:100}}
                    allowClear={false}
                    optionLabelProp="children"
                    onSelect={this.changeHandle}	   						
                >   
                    <Option key={1} value={'1'} title={i18n.t(600189/*每周*/)}>{i18n.t(600189/*每周*/)}</Option>
                    <Option key={2} value={'2'} title={i18n.t(600190/*每月*/)}>{i18n.t(600190/*每月*/)}</Option>
                </Select>  
                <span>&nbsp;&nbsp;&nbsp;</span>
                <Select
                    {...getNFieldProps('num',{
                        initialValue: {s_label:String(data['num']-1),num:data['num']}							
                    })}  
                    disabled={action}                    
                    style={{width:100}}
                    allowClear={false}
                    optionLabelProp="children"
                    optionFilterProp="children"	    						
                >                   
                    { date.map((o,i)=><Option key={i} objValue={{s_label:o['name'],num:o['id']}} title={o['name']}>{o['name']}</Option>) }
                </Select>  
                <span style={{marginLeft:'50px',paddingRight:'20px'}}>{i18n.t(600191/*接收报价客户等级*/)}</span>
                <ConstVirtualSelect
                    style={{position:'absolute',width:758,height:200}}
                    apiType={apiPost}
                    form={this.props.form} 
                    fieldName='cstmLevels'
                    apiParams={{obj:'com.fooding.fc.ds.entity.CstmLevel'}}
                    multi={true}
                    disabled={action}
                    valueKeys={ da => da}   
                    initialValue={(data['cstmLevels'] || []).map(o=>Object.assign(o,{s_label:o['localName']}))}                                    
                />                          
            </div>            
        </div>
    }
}

// 自动推广报价 页面
let PriceDIVForm = createForm()(PriceDIV);


class PriceParameters extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();

    }

    initState() {
       return {
            data:[], // 价格所有的
            selectedArr:[],//选中的，
            isDetail:true, //默认每次进来都是详情页面
            valueone:{} //对象里面的值
       }
    }

    componentDidMount() {
        this.getPages();
        this.searchObj(WebData.user.data.staff.ccid);
    };

    componentWillUnmount() {
    }    

    //初始化拉取所有的数据
    getPages = () => {

        // 价格参数
        apiGet(API_FOODING_ERP, '/calculationmode/getModes',{}, 
        (response) => {

            this.setState({
                data: response.data || [],
            });
        },(error) => {
            errorTips(error.message)
        });

    };

    //查询某一个数据
    searchObj = ccId => {
        apiGet(API_FOODING_ERP,"/calculationmode/getOne",{ccId:ccId},response => {
            let data = response.data || {ccId:WebData.user.data.staff.ccid,ccLcName:WebData.user.data.staff.company.localName,ccEnName:WebData.user.data.staff.company.name};
            let newArr = data && data.modes?data.modes:[];
            let arr = Array.from(new Set(newArr));
            this.setState({selectedArr:arr,valueone:data});
        },error => ServiceTips({text:error.message,type:"error"}))
    }

    //选择与不选中
    onCheckChange = (data,e) => {
        let arr = this.state.selectedArr;
        let bol = isSingleInArray(data,arr)
        if(bol){
            arr.remove(data);
        }else{
            arr.push(data);
        }
        this.setState({
            selectedArr:arr
        })
    }

    //保存和编辑
    onSaveClickAndEdit = data => {
        let that = this;
        //保存或者编辑
        if(that.state.isDetail){//表示当前页面是详情 按钮应该就是编辑
            that.setState({isDetail:false},() => that.searchObj(data.ccId));
        }else{//表示当前是编辑，按钮就是保存
            if(!(data && data.ccId)) return false;
            let params = Object.assign({},data,{modes:that.state.selectedArr})
            apiPost(API_FOODING_ERP,'/calculationmode/save',params,response => {
                that.setState({isDetail:true},() => that.searchObj(data.ccId) )
            },error => ServiceTips({text:error.message,type:"error"}) ) 
        }
    }




    render() {

        let dom = this.state.data.map((e,i) => {
            return (<li className={'price-parameters-content-single'} key={e}>
                        <Checkbox
                            onChange={this.onCheckChange.bind(this,e)}
                            checked={isSingleInArray(e,this.state.selectedArr)}
                            class="rc-checkbox-input"
                            disabled={this.state.isDetail}
                        />
                        <span className={'price-parameters-content-single-text'}>{Translation[e]}</span>
                    </li>)
        });


        return (<div>
            <FilterHeader searchObj={ this.searchObj} onSaveClickAndEdit={this.onSaveClickAndEdit} isDetail={this.state.isDetail} valueone={this.state.valueone}/>
            <div style={{padding:"0 20px"}}>
                <div style={{fontSize:"18px",lineHeight:"48px",height:"48px",borderTop:"1px solid #ccc",borderBottom:"1px solid #ccc",textIndent:"10px"}}>
                    价格参数
                </div>
            </div>
            <ul className={'price-parameters-content'}>
                {dom}
            </ul>
        </div>)
    }
}


// export
class Page extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollHeight:0,
        }
    } 

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }    

    handleResize = ()=> {
        let sch = document.body.offsetHeight - 80- 86;
        let scroll = sch - 80;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }


    render() {
        return (<div className={'system-mailserver'}>
            <div className={'system-mailserver-content'}>
                <div className={'system-mailserver-content-main'} style={{height: this.state.scrollHeight}}>
                    <PriceParameters />
                    <PriceDIVForm />                   
                </div>
            </div>
        </div>)        
    }       
}

export default Page;
