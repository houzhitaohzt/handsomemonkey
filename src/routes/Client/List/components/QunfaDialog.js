import React from 'react'
import ServiceTips from "../../../../components/ServiceTips";//提示框
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from '../../../../components/Form';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_MAIL_SERVER,API_FOODING_DS,
    API_FOODING_MAIL,language,commonAjax,getQueryString} from '../../../../services/apiCall';
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";
import Checkbox from "../../../../components/CheckBox";
import MassTemplate from  '../../../Mail/MassWrite/components/MassTemplate';
import i18n from './../../../../lib/i18n';
export class MassWrite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            shoujianArray:[]
        };
        this.close = this.close.bind(this);
        this.searchCustomer = this.searchCustomer.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.isAll = undefined;
    }
    close(){
        let that = this;
        that.props.navCloseCurrentTab();
    }
    onSaveClick(){
        //发送
        let that = this;
        that.normalRef.sendMail();
    }
    searchCustomer(){
        let that = this;
        that.props.form.validateFields((error, value) => {
            if(error){
                console.log(error, value);
            }else{
                if(this.props.selectArray.length == 0){
                    let {data} = this.props;
                    if(!data["cntryId"]&&!data["code"]&&!data["color"]&&!data["contactor"] &&
                        !data["cstmLvId"] && !data["cstmSrcId"] && !data["email"] && !data["endTime"] && !data["mtlTyId"]&&
                        !data["name"] && !data["staffId"] && !data["startTime"] && !data["taxIdenSN"] && !data["tradMark"]
                    ){
                        //都是空的搜索条件均为空
                        value = Object.assign({},value,{isDefault:false,isAll:true,dataTyId:30});

                    }else{
                        // delete data.mtlTyLocalName;
                        // delete data.cntryLocalName;
                        // delete data.cstmLvLocalName;
                        // delete data.cstmSrcLocalName;
                        // delete data.staffLocalName;
                        // delete data.tradMarkLocalName;
                        value = Object.assign({},value,data,{isDefault:false,isAll:false,dataTyId:30});
                    }
                }else{ //选了客户
                    let array =[];
                    this.props.selectArray.map((e)=>{array.push(e.id)});
                    value = Object.assign({},value,{isDefault:false,isAll:false,ids:array,dataTyId:30});
                }

                apiGet(API_FOODING_DS,'/contact/getEnterpriseEmailList',value,(respose)=>{
                    this.setState({
                        shoujianArray:respose.data||[]
                    });
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                })
            }

        });
    }
    render(){
        let that = this;
        let {data,selectArray} = that.props;
        let common =<div></div>;
        if(selectArray.length == 0){ //没有勾选客户
            console.log(data);
            if(!data["cntryId"]&&!data["code"]&&!data["color"]&&!data["contactor"] &&
                    !data["cstmLvId"] && !data["cstmSrcId"] && !data["email"] && !data["endTime"] && !data["mtlTyId"]&&
                    !data["name"] && !data["staffId"] && !data["startTime"] && !data["taxIdenSN"] && !data["tradMark"]
            ){
                common = <div className="col-xs-2">
                    <p className="client-price-content-show" style={{marginRight:'10px'}}>{i18n.t(500264/*全部客户*/)}</p>
                    <Checkbox
                        checked={true}
                    />
                </div>

                this.isAll = true;
            }else{
                //有条件的时候
                common = <div className="row">
                    {data.code?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100354/*客户代码*/)}</p>:''}
                    {data.code?<span className="col-xs-2 col-md-2">{data.code}</span>:''}
                    {data.mtlTyId?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}} >{i18n.t(100350/*关注产品*/)}</p>:''}
                    {data.mtlTyId?<span className="col-xs-2 col-md-2">{data.mtlTyLocalName}</span>:''}
                    {data.name?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100355/*客户名称*/)}</p>:''}
                    {data.name?<span className="col-xs-2 col-md-2">{data.name}</span>:''}
                    {data.cntryId?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100087/*国家*/)}</p>:''}
                    {data.cntryId?<span className="col-xs-2 col-md-2">{data.cntryLocalName}</span>:''}
                    {data.email?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100229/*邮箱*/)}</p>:''}
                    {data.email?<span className="col-xs-2 col-md-2">{data.email}</span>:''}
                    {data.cstmLvId?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100359/*客户等级*/)}</p>:''}
                    {data.cstmLvId?<span className="col-xs-2 col-md-2">{data.cstmLvLocalName}</span>:''}
                    {data.cstmSrcId?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100362/*客户来源*/)}</p>:''}
                    {data.cstmSrcId?<span className="col-xs-2 col-md-2">{data.cstmSrcLocalName}</span>:''}
                    {data.staffId?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100361/*分管人*/)}</p>:''}
                    {data.staffId?<span className="col-xs-2 col-md-2">{data.staffLocalName}</span>:''}
                    {data.contactor?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(200450/*客户联系人*/)}</p>:''}
                    {data.contactor?<span className="col-xs-2 col-md-2">{data.contactor}</span>:''}
                    {data.taxIdenSN?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(100358/*税号*/)}</p>:''}
                    {data.taxIdenSN?<span className="col-xs-2 col-md-2">{data.taxIdenSN}</span>:''}
                    {data.tradMark?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(200451/*是否下单*/)}</p>:''}
                    {data.tradMark?<span className="col-xs-2 col-md-2">{data.tradMarkLocalName}</span>:''}
                    {data.startTime?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(200453/*最新修改日期*/)}</p>:''}
                    {data.startTime?<span className="col-xs-2 col-md-2">{new Date(data.startTime).Format('yyyy-MM-dd')+'~'+new Date(data.endTime).Format('yyyy-MM-dd')}</span>:''}
                    {data.color?<p className="col-xs-1 col-md-1" style={{textAlign:'right',marginBottom:0}}>{i18n.t(400132/*颜色*/)}</p>:''}
                    {data.color?<span style={{width: '14px', height: '14px', padding: '8px !important', marginBottom: '3px', backgroundColor: data.color,
                        display: 'inline-block',marginTop:'5px'}}></span>:''}
                </div>
            }
        }else{
            //有勾选客户
        }
        return (
            <FormWrapper showFooter={true} onCancel={this.props.onCancel} buttonLeft ={i18n.t(200427/*发送*/)} onSaveAndClose={this.onSaveClick}>
            <div className='write-page  srcoll' style={{height:document.body.offsetHeight-380,overflowY:'auto'}}>
                <div className="row">
                    <div className={'col-xs-12'}>
                        {common}
                        <label className={'add-label'} style={{float:'left',marginRight:'10px'}}>{i18n.t(200457/*接受对象*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName='positionIds'
                            apiHost={API_FOODING_DS}
                            multi={true}
                            apiType={apiPost}
                            apiParams={'com.fooding.fc.ds.entity.Positn'}
                            className={'col-xs-8 col-md-8'}
                        />
                        <span  onClick={this.searchCustomer} style={{fontSize:'19px',paddingLeft:'10px',display:'inline-block',
                            paddingTop:'4px',color:'#888'}}>
                            <i className="foddingicon fooding-search_icon"/></span>
                    </div>
                </div>
                <MassTemplate shoujianArray ={this.state.shoujianArray} onCancel={this.props.onCancel} normalRef={no => this.normalRef = no} type={'client'}/>
            </div>
            </FormWrapper>
        )
    }
}
export default createForm()(NavConnect(MassWrite));
