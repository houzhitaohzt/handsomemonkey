import React, {PropTypes, Component} from "react";
import {createForm,FormWrapper} from '../../../components/Form';


import Select, { Option } from '../../../components/Select'; // 下拉

import {getQueryString,apiGet,apiPost,apiForm,API_FOODING_OA,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';


import {UploadImg} from '../../../components/Upload/Img'; // 上传图片
import i18n from '../../../lib/i18n';









class RegisterDetails extends Component{
	constructor(props){
		super(props)
		this.state=this.initState()
		this.fileChange=this.fileChange.bind(this);
		this.onSubmit=this.onSubmit.bind(this);

		// init Func 
		this.getOne = this.getOne.bind(this);
		this.handleState = this.handleState.bind(this);
		this.handleCity = this.handleCity.bind(this);
		this.handleTown = this.handleTown.bind(this);
		
		

		this.changeState = this.changeState.bind(this);
		this.changeCity = this.changeCity.bind(this);
		
		
		
		

	}
	initState(){
		return{
			scrollHeight:0,
			scroll:0,
			imgsArr:[],//装图片的空数组

			data:{}, // init data
			province: [{id:1,name:''}], // 省、州
			city: [{id:1,name:''}], // 市
			town: [{id:1,name:''}], // 区
			

			provinceID:'', // 州 ID
			cityID:'', // 市 ID
			
			uploadBtn:true, // 控制 图片上传按钮
			fileListReturn:[], // 图片信息
			resultSubmit: true, // 控制提交 

		}
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		this.getOne();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}

	fileChange(e){//文件改变
		var that = this;
		let inputDom  = e.target;//获取目标节点
		let tempArr = this.state.imgsArr;
		if(tempArr.length >=3){

			return false;
		}
		var reg = /.jpg|.png|.JPG|.PNG|.jpeg|.JPEG|.bmp|.BMP/g;
		if(typeof FileReader=="undefined"){
			return tempArr.push(i18n.t(600125/*抱歉，您的浏览器不支持FileReader,请换浏览器执行！*/))
		}else {
			for(let i=0; i<inputDom.files.length; i++){
				if(!inputDom.files[i].name.match(reg)){
					alert(i18n.t(600126/*上传的不是图片，请上传图片！！！*/))
				}else{
					var reader = new FileReader();   
                	reader.readAsDataURL(inputDom.files[i]);
                	reader.onload=function () {
                		tempArr.push(reader.result);
                		that.setState({
							imgsArr:tempArr
						})
                	}
				}
			}
		}
	}

	onDelClick(num,e){

		let imgsArr = this.state.imgsArr;
		imgsArr.splice(num,1);
		this.setState({
			imgsArr:imgsArr
		})
	}


	handleResize(height){
		let sch=document.body.offsetHeight-height;
        let scroll = sch-100;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}

	// 省、州
	handleState(){

		let {register={}} = this.state.data;
		apiGet(API_FOODING_ES,'/fc/audit/getAreasByParentId',{parentId:register['countryId'] },
			(response)=>{							
				this.setState({	
					province: response.data,					
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		}); 		
	}

	// 省、州 切换 
	changeState(e){

		let that = this;	

		this.setState({
			provinceID:'', 			
		},function(){
			that.setState({	
				provinceID:e, 
			},function(){
				that.props.form.resetFields(['cityId','districtId']);
			});
		});


	}

	// 市
	handleCity(){
		
		let {provinceID} = this.state;
		apiGet(API_FOODING_ES,'/fc/audit/getAreasByParentId',{parentId:provinceID },
			(response)=>{							
				this.setState({	
					city: response.data,	 					
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		}); 
	}

	// 市 切换 
	changeCity(e){

		let that = this;
		this.setState({
			cityID:'',
		},function(){
			that.setState({	
				cityID:e, 
			},function(){
				that.props.form.resetFields(['districtId']);
			});
		});

	}	

	// 区县
	handleTown(){ 
		let {cityID} = this.state;
		apiGet(API_FOODING_ES,'/fc/audit/getAreasByParentId',{parentId:this.state.cityID },
			(response)=>{							
				this.setState({	
					town: response.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		}); 		
	}	


	// init data 
	getOne(){
		let that = this;
		apiGet(API_FOODING_ES,'/fc/register/getInit',{token:getQueryString('token'),registerId:getQueryString('rId') },
			(response)=>{
				that.setState({ data:response['data'] });
			},(errors)=>{
				//ServiceTips({text:errors.message,type:'error'});
				//window.location.pathname='/user/login';
				//document.write('链接已失效！')
			}
		);
	}

	// 上传 图片
	onChangeImg = (option={})=>{

		let that = this;
		let fileReturn = option.fileReturn;
		let fileListReturn = option.fileListReturn;
		
		if(option['type'] == 'error'){
			ServiceTips({text:fileReturn['message'],type:'error'});
			return;
		} 

		if( fileListReturn.length > 2 ){
			that.setState({ uploadBtn:false });
			ServiceTips({text:'上传数量已达上限！',type:'info'});			
		} else{
			that.setState({ uploadBtn:true });			
		}

		let Data = [];
		fileListReturn.map( (o)=> Data.push({fileName:o.response.data['fileName'],originalFileName:o.response.data['originalFileName'],state:o.response.data['state'],url:o.response.data['url'] }) );
		this.setState({ fileListReturn:Data });
	}

	// 删除图片 
	onRemove = (o)=>{
		
		let ID = o.response.data[0].id;

		// 后面改成 同步
		apiForm(API_FOODING_OA,'/fc/fastdfs/delete',{id:ID},
			(response)=>{
			},(errors)=>{
				//ServiceTips({text:errors.message,type:'error'});
		}); 
		
		return true;
	}

	// 提交
	onSubmit(){
		let that = this;
		let {resultSubmit,fileListReturn} = this.state;		
		const {form, onSaveAndClose} = this.props;

		if(!resultSubmit) return;

		form.validateFields((errors, value) => {
			if(errors){
				//ServiceTips({text:'带‘*’号必填！',type:'info'});
			}else{

				// 拼接电话
				value['staffPhone'] = value['phone1'] + '-' + value['phone2'];
				value['partyTel'] = value['tel1'] + '-' + value['tel2'] + '-' + value['tel3'];

				// 验证图片上传
				// if( !this.state.fileListReturn.length ){
				// 	ServiceTips({text:i18n.t(600127/*未上传证件！*/),type:'info'});			
				// 	return;
				// }

				let Data = Object.assign({},value,{partyFileInfos:that.state.fileListReturn});
				
				// ajax
				that.setState({ resultSubmit: false });
				apiPost(API_FOODING_ES,'/fc/audit/savePerfect',Data,
					(response)=>{						
						ServiceTips({text:i18n.t(600128/*注册成功！</br> 3秒后跳转至登录页！*/),type:'success'});						
						setTimeout(function(){ 
							window.location.pathname='/user/login';
						},3000)					
					},(errors)=>{
						that.setState({ resultSubmit: true });
						ServiceTips({text:errors.message,type:'error'});
					} 
				);
			}
		});
	}




	render(){

		let {register={},businessList=[],sexList=[]} = this.state['data'];
		let {data,resultSubmit,fileListReturn} = this.state;
		let {getNFieldProps,getFieldProps,getFieldError} = this.props.form;

		const imageUrl = this.state.imageUrl;


		// 强制 增加的字段 
		getNFieldProps('staffEmail',{	// 职员名称
			initialValue: register['enterpriseEmail']								
		});

		getNFieldProps('partyCountryId',{	// 国家
			initialValue: register['countryId']								
		});
		getNFieldProps('registerId',{	// 注册表 ID 
			initialValue: register['id']								
		});
		getNFieldProps('userId',{	//  ID    
			initialValue: register['userId']								
		});






		getNFieldProps('enterpriseEmail',{	// 邮箱 
			initialValue: register['enterpriseEmail']								
		});		
		getNFieldProps('enterpriseTaxId',{	// 税号
			initialValue: register['enterpriseTaxId']								
		});	
		getNFieldProps('enterpriseWeb',{	// 网站 
			initialValue: register['enterpriseWeb']								
		});	
		getNFieldProps('enterpriseName',{	// 名称 
			initialValue: register['enterpriseName']								
		});	
		getNFieldProps('countryId',{	// 国家 
			initialValue: register['countryId']								
		});	











		return(<div className={'registerdetails'} style={{height:this.state.scrollHeight}}>
			<div className={'retrievepassword-head'} style={{boxShadow:'2px 0 5px #ccc',position:'fixed',top:'0px',left:'0px',zIndex:'3'}}>
				<span className={'nooh'}>Noohle</span>					
			</div>
			<div className={'registerdetails-content'}>
				<h3>{i18n.t(600129/*欢迎您*/)},{register['enterpriseName']}:{i18n.t(600130/*请补全以下信息,让商业伙伴能够及时联系到您*/)}</h3>
				<div className={'registerdetails-content-input'}>
					<span className={'must'} style={{color:'#990000'}}>*</span>
					<input type='text'
						placeholder={i18n.t(600131/*请输入真实姓名*/)} 
						style={{width:'620px'}}
						{...getNFieldProps('staffName',{
							rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('staffName')?'error-border':''}					
					/>					
				</div>
				<div className={'registerdetails-content-select'}>
					<span className={'must'} style={{color:'#990000'}}>*</span>
					<Select
						{...getNFieldProps('sexId',{
							rules: [{required:true}],
							initialValue: undefined
						})}					
						animation='slide-up'
						placeholder={i18n.t(100239/*性别*/)} 
						className ={getFieldError('sexId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						style={{width:620}}
						>
						{sexList.map((o,i)=><Option key={i} objValue={{s_label:o.name,sexId:o.id}} title={o.name}>{o.name}</Option>)}						
					</Select>
				</div>
				<div className={'registerdetails-content-email'}>
					<span className={'must'}>&nbsp;&nbsp;</span>
					<span>{i18n.t(200773/*企业邮箱*/)}：</span>
					<span>{register['enterpriseEmail'] || ''}</span>
				</div>
				<div className={'registerdetails-content-input'} style={{width:'636px',margin:'16px auto',textAlign:'left'}}>
					<span className={'must'}>&nbsp;&nbsp;</span>
					<input type='text' 
						placeholder={i18n.t(600132/*国家代码*/)} 
						style={{width:'130px',marginRight:'10px'}}
						{...getNFieldProps('phone1',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('phone1')?'error-border':''}																	
					/>
					<input type='text'
						placeholder={i18n.t(600133/*请输入手机号码*/)} 					
						style={{width:'270px'}}
						{...getNFieldProps('phone2',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('phone2')?'error-border':''}					
					/>
				</div>
				<div className={'registerdetails-content-email'}>
					<span className={'must'}>&nbsp;&nbsp;</span>
					<span>{i18n.t(200771/*企业名称*/)}：</span>
					<span>{register['enterpriseName'] || ''}</span>
				</div>
				<div className={'registerdetails-content-email'}>
					<span className={'must'}>&nbsp;&nbsp;</span>					
					<span>{i18n.t(200772/*企业税号*/)}：</span>
					<span>{register['enterpriseTaxId'] || ''}</span>
				</div>
				<div className={'registerdetails-content-input'}>
					<span className={'must'}></span>
					<input type='text'
						placeholder={i18n.t(100562/*请输入法人代表*/)} 										
						style={{width:'620px'}}
						{...getNFieldProps('leglpsn',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('leglpsn')?'error-border':''}
					/>
				</div>
				<div className={'registerdetails-content-input'} style={{width:'636px',margin:'16px auto',textAlign:'left'}}>
					<span className={'must'}>&nbsp;&nbsp;</span>
					<input type='text' 
						placeholder={i18n.t(600132/*国家代码*/)} 
						style={{width:'130px',marginRight:'10px'}}
						{...getNFieldProps('tel1',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('tel1')?'error-border':''}
					/>
					<input type='text' 
						placeholder={i18n.t(600135/*区号*/)} 
						style={{width:'130px'}}
						{...getNFieldProps('tel2',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('tel2')?'error-border':''}					
					/>
					<span className={'must'} style={{marginRight:'0'}}>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
					<input type='text'
						placeholder={i18n.t(600136/*请输入企业固话*/)} 					
						style={{width:'330px'}}
						{...getNFieldProps('tel3',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('tel3')?'error-border':''}					
					/>
				</div>
				<div className={'registerdetails-content-email'}>
					<span className={'must'}>&nbsp;&nbsp;</span>					
					<span>{i18n.t(200781/*企业网址*/)}：</span>
					<span>{register['enterpriseWeb'] || ''}</span>
				</div>
				<div className={'registerdetails-content-select'}>
					<span className={'must'} style={{color:'#990000'}}>*</span>
					<Select
						{...getNFieldProps('businessId',{
							rules: [{required:true}],
							initialValue: undefined
						})}					
						animation='slide-up'
						placeholder={i18n.t(600137/*请选择经营模式*/)} 					
						className ={getFieldError('businessId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						style={{width:620}}
						>
						{businessList.map((o,i)=><Option key={i} objValue={{s_label:o.name, businessId:o.id}} title={o.name}>{o.name}</Option>)}						
					</Select>
				</div>
				<br/><br/><br/>	
				<div className={'registerdetails-content-select'}>
					<span className={'must'} style={{color:'#000033'}}>{register.country ? register.country['localName'] : ''}</span>
					<span className={'must-right'}></span>
					<span className={'must'}>{i18n.t(100535/*省/州*/)}</span>
					<Select
						animation='slide-up'
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						name='type'
						placeholder={i18n.t(100536/*请选择省州*/)} 											
						style={{width:170}}
						{...getNFieldProps('provinceId',{
							//rules: [{required:true,}],								
							initialValue: undefined																
						})} 
						className ={getFieldError('provinceId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}						
						onClick={this.handleState}	
						onSelect={this.changeState}					
					>
						{this.state.province.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName,provinceId:o.id}} title={o.localName}>{o.localName}</Option>)}
					</Select>
					<span className={'must-right'}></span>
					<span className={'must'}>{i18n.t(100248/*市*/)}</span>
					<Select
						animation='slide-up'
						placeholder=''
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						name='type'
						placeholder={i18n.t(100538/*请选择市*/)} 																	
						style={{width:170}}
						{...getNFieldProps('cityId',{
							//rules: [{required:true,}],								
							initialValue: undefined																
						})} 
						className ={getFieldError('cityId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}						
						onClick={this.handleCity}	
						onSelect={this.changeCity}							
						>
						{this.state.city.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName,cityId:o.id}} title={o.localName}>{o.localName}</Option>)}
					</Select>
					<span className={'must-right'}></span>
					<span className={'must'}>{i18n.t(100249/*区县*/)}</span>
					<Select
						animation='slide-up'
						placeholder={i18n.t(100540/*请选择区县*/)} 																	
						choiceTransitionName="rc-select-selection__choice-zoom"
						optionLabelProp="children"
						name='type'
						style={{width:170}}
						{...getNFieldProps('districtId',{
							//rules: [{required:true,}],								
							initialValue: undefined																
						})} 
						className ={getFieldError('districtId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}						
						onClick={this.handleTown}	
					>
						{this.state.town.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName,districtId:o.id}} title={o.localName}>{o.localName}</Option>)}
					</Select>
				</div>
				<div className={'registerdetails-content-input'}>
					<span className={'must'}>&nbsp;&nbsp;</span>					
					<input type='text'
						placeholder={i18n.t(100542/*请输入详细地址*/)} 																						
						style={{width:'620px'}}
						{...getNFieldProps('descAddress',{
							//rules: [{required:true}],
							initialValue: ''								
						})}	
						className ={getFieldError('descAddress')?'error-border':''}					
					/>
				</div>
			</div>
			<div className={'registerdetails-fileup'}>
				<div
					style={{width:'327px',margin:'10px auto'}}
				>
					<UploadImg 
						ID={data.register ? data.register['id'] : ''}
						label={i18n.t(600139/*上传企业有效证件*/)}				
						action={API_FOODING_OA + '/fc/fastdfs/upload'}
						onChange={this.onChangeImg}
						showBtn={this.state.uploadBtn}
						onRemove={this.onRemove}
					/>
				</div>
			</div>
			<div className={'registerdetails-submit'}>
				{/*<button className={(resultSubmit ? fileListReturn.length : resultSubmit) ? 'active' : ''} onClick={this.onSubmit}>{i18n.t(600140*//*确认提交*//*)}</button>*/}
				<button className={resultSubmit ? "active" :''} onClick={this.onSubmit}>{i18n.t(600140/*确认提交*/)}</button>
			</div>
		</div>)
	}
}
const RegisterDetailsForm =createForm()(RegisterDetails);
export default RegisterDetailsForm;


// export default RegisterDetails;
