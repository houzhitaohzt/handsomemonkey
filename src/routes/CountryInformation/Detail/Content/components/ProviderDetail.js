import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from "../../../../../lib/i18n";
export class ProviderDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.state=this.initState();
        this.state = {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id //列表頁传过来的id
        }
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(I18n.t(100460/*确认*/), {
				  done: () => {
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    onSaveAndClose(value,data){
        let that = this;
        if(data.title == "countryinformation-detail-normal"){//表示编辑常规
            //表示编辑职员常规
            value = Object.assign({},data,value);
            apiPost(API_FOODING_DS,'/country/save',value, response => {
                ServiceTips({text:response.message,type:'success'})
                that.props.getDetailData();
                 this.setState({visible:false});
            }, error => {
                ServiceTips({text:error.message,type:'error'})
            })
        }
        
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        // window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        // window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        // window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
        let data = this.props.data;
        let that = this;
		return (
			  <div>
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflowY:'auto',overflowX:'hidden'}}>
		               <div className = 'col'>
		               		<Template1 
                                menuList={[
                                    {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                                ]}                               
                                onCancel ={this.onCancel}
		               		width={107}
                            DialogTempalte={require('./NormalDialog').default}
		               		isShowMenu={true}
                            upload={that.props.getDetailData}
		               		openDialog={this.handleClick}
		               		AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                            onSaveAndClose={this.onSaveAndClose}
                            portname={'/country/getOne'}
                            params={{id:this.state.id}}

		                    id={'product-detail-11'} title={I18n.t(100138/*常规*/)} tempArray={[
		                    	{key:I18n.t(100096/*美国制裁*/),value:data.sacInUsMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)},
		                    	{key:I18n.t(100084/*电话区号*/),value:data.cntrycode},
		                    	{key:I18n.t(100095/*语言分类*/),value:data.locale},

		                    ]}/>
                        </div>
                        <div className = 'col'>
		                    <Template1 title={I18n.t(100139/*注册信息*/)} id ={'31'} 
                                isShowIcon={false}
		                    tempArray={[{key:I18n.t(100143/*创建人*/),value:data.createUserName},
                                {key:I18n.t(100144/*修改人*/),value:data.updateUserName},
                                {key:I18n.t(100145/*创建时间*/),value:new Date(data.createDate).Format('yyyy-MM-dd hh:mm:ss')},
                                {key:I18n.t(100146/*修改时间*/),value:new Date(data.updateDate).Format('yyyy-MM-dd hh:mm:ss')}]}/>
		               </div>
	               </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               </div>
			);
	}

}
export default ProviderDetail;
