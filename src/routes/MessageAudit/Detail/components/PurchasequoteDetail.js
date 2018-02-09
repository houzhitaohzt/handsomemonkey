import i18n from '../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import MeasureCommon from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import {createForm,FormWrapper} from "../../../../components/Form";


// ajax
import {permissionsBtn,apiGet,apiPost,API_FOODING_OA,apiForm,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

// css 
// import '../css/index.less';


export class SalesOrderDetail extends Component{
	constructor(props) {
        super(props);
        this.state=this.initState();
        this.getInit = this.getInit.bind(this);

    }

    //查询单条数据
    getInit(){
        var that = this;
        apiGet(API_FOODING_ES,'/audit/getOne',{id:this.state.id},(response)=>{
            that.setState({
                data:response.data
            },function(){
                that.getImg();
            })
        },(error)=>{

        })
    }

    // img list 
    getImg = ()=>{
        let that = this;
        let {data} = this.state;

        apiGet(API_FOODING_OA,'/fc/fastdfs/getList',{businessType:'register--picture',businessId:data['registerId']},(response)=>{
            that.setState({imgURL:response['data']});
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })       
    }

    initState(){
        return {
            visible:false,
            dialogTitle:'',
            data:{},
            imgURL:[], // 图片 url
            id:this.props.location.query.id,
            dilogTelmp:<div></div>,
            mingxiArray:[]
        }
    }

    componentDidMount(){
        this.handleResize();
        this.getInit();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

    // 同意 | 驳回 
    onSaveAndClose = (option={})=>{

        let that = this;
        let type = option.target.getAttribute('data-type');
        let title = option.target.getAttribute('title');
        let fromData = this.props.form.getFieldsValue();

        Confirm(i18n.t(200043/*确定*/)+" '"+title+"' "+i18n.t(200098/*操作*/), {
                done: () => {   
                    apiPost(API_FOODING_ES,"/audit/auditInfo",Object.assign({},this.state['data'],{auditStateId:type},fromData),
                        response => {
                            ServiceTips({text:response.message,type:'success'}); 
                            that.getInit();
                        },error => {
                            ServiceTips({text:error.message,type:'error'});
                    });
                },
                close:() => {
                        
                }
                });
    }

	render(){
        let {data,imgURL} = this.state;
		const {getNFieldProps, getFieldProps, getFieldError } = this.props.form;

		return (
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
                <div className={'addnormal'} style={{marginBottom:'10px'}}>
                    <div style={{padding:'30px 0px 10px 0px'}}>    
                        <h2 style={{textAlign:'center'}}>{i18n.t(600158/*审核信息*/)} &nbsp;&nbsp;<span className="label label-success">{data.business ? data.business['name'] : ''}</span></h2>
                        <p style={{textAlign:'right',}}>
                            <span>{i18n.t(200777/*审核时间*/)}：</span>
                            <span>{new Date(data.auditDate || '').Format('yyyy-MM-dd hh:mm:ss') || i18n.t(200576/*无*/)}</span>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{i18n.t(200776/*审核状态*/)}：</span>
                            <span>{data.auditState ? data.auditState['name'] : 20}</span>						
                        </p>
                    </div>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200775/*注册时间*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{new Date(data.createDate || '').Format('yyyy-MM-dd hh:mm:ss')}</p>

                                </div>
                            </div>	
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200780/*所在国家*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.country ? data.country['localName'] : ''}</p>
                                </div>
                            </div>                            					
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200771/*企业名称*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.enterpriseName || ''}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200772/*企业税号*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.enterpriseTaxId || ''}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                                <div className="form-group col-md-3 col-lg-3">
                                    <label className={'col-md-3 col-lg-3'}>{i18n.t(200781/*企业网址*/)}</label>
                                    <div className={'col-md-9 col-lg-8'}>
                                        <p className={'paragraph'}>{data.enterpriseWeb || ''}</p>
                                    </div>
                                </div>
                                <div className="form-group col-md-3 col-lg-3">
                                    <label className={'col-md-3 col-lg-3'}>{i18n.t(200773/*企业邮箱*/)}</label>
                                    <div className={'col-md-9 col-lg-9'}>
                                        <p className={'paragraph'}>{data.enterpriseEmail || ''}</p>
                                    </div>
                                </div>
                                <div className="form-group col-md-3 col-lg-3">
                                    <label className={'col-md-3 col-lg-3'}>{i18n.t(100231/*姓名*/)}</label>
                                    <div className={'col-md-9 col-lg-9'}>
                                        <p className={'paragraph'}>{data.staffName || ''}</p>
                                    </div>
                                </div>
                                <div className="form-group col-md-3 col-lg-3">
                                    <label className={'col-md-3 col-lg-3'}>{i18n.t(100239/*性别*/)}</label>
                                    <div className={'col-md-9 col-lg-9'}>
                                        <p className={'paragraph'}>{data.sex ? data.sex['name'] : ''}</p>
                                    </div>
                                </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200782/*手机号码*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.staffPhone || ''}</p>
                                </div>
                            </div>						
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(100561/*法人代表*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.leglpsn || ''}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200774/*企业固话*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.partyTel || ''}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200783/*经营模式*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.business ? data.business['name'] : ''}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(200784/*企业地址*/)}</label>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p className={'paragraph'}>{data.descAddress || ''}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'view-img'}>
                                <h3>{i18n.t(200785/*提交企业证件*/)}</h3>
                                { imgURL.map( (o,i)=>  <a href={o['fullPath']} target="_blank" key={i}><img src={o['fullPath']} alt={o['originalFileName']}/></a> ) }
                            </div>
                        </div>       
                        <br/>   
                        {(data.auditState ? (data.auditState['id'] == 10 ? true : false) : false) ?
                            <div>            
                                <div className={'row'}>
                                    <div className="form-group col-md-3 col-lg-3">
                                        <label className={'col-md-3 col-lg-3'}>{i18n.t(200786/*审批意见*/)}</label>
                                    </div>
                                </div>                        
                                <div className={'row'}>
                                    <textarea name="" rows="5" style={{width:'100%'}}
                                        {...getFieldProps('description',{
                                            initialValue:''
                                        })}
                                    ></textarea>
                                </div>
                                <br/>
                                <br/>
                                <div className={'row'} style={{textAlign:'center'}}>
                                    <div className={'btn-group'}>
                                        {   permissionsBtn('registration_pass') ?
                                            <button onClick={this.onSaveAndClose} data-type='20' type="button" className="btn btn-success" title={i18n.t(200787/*同意*/)}>{i18n.t(200787/*同意*/)}</button>
                                            :
                                            ''
                                        }
                                        {   permissionsBtn('registration_nopass') ?
                                            <button onClick={this.onSaveAndClose} data-type='30' type="button" className="btn btn-warning" title={i18n.t(200788/*驳回*/)}>{i18n.t(200788/*驳回*/)}</button>
                                            :
                                            ''
                                        }                                        
                                    </div> 
                                </div>
                            </div>
                            :
                            <div className={'row'}>
                                <div className="form-group col-md-3 col-lg-3">
                                    <label className={'col-md-3 col-lg-3'}>{i18n.t(200786/*审批意见*/)}</label>
                                    <div className={'col-md-9 col-lg-9'}>
                                        <p className={'paragraph'}>{data.auditState ? data.auditState['name'] : ''}</p>
                                    </div>
                                </div>
                            </div>                            
                        }  
   
                    </div>
                </div>               
               </div>
			);
	}

}

export default NavConnect(createForm()(SalesOrderDetail));
