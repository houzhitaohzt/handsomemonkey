import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react'
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from "../../../../components/Dialog/Dialog";
//引入select插件
import Select, {Option } from 'rc-select';
//引入单选按钮
import Radio from "../../../../components/Radio";


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框



class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initialState();
		this.handleChange=this.handleChange.bind(this);
		this.allChecked=this.allChecked.bind(this);
		this.mainSelect=this.mainSelect.bind(this);


		// init ajax	
		// this.getInit = this.getInit.bind(this);
		this.priorityChange = this.priorityChange.bind(this);
		this.minorChange = this.minorChange.bind(this);


	}

	static propTypes={
		mainRecord:PropTypes.object,
		subRecord:PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	static defaultProps={
		mainRecord:{},
		subRecord:{},		
	}
	initialState(){
		return {
			mainRecord:{供应商代码:'',国家:'',名称:'',英文名称:'',供应商类型:"",供应商等级:"",供应商来源:"",描述:"",地址:"",邮箱:"",网址:"",电话:"",传真:""},
			subRecord:{供应商代码:'',国家:'',名称:'',英文名称:'',供应商类型:"",供应商等级:"",供应商来源:"",描述:"",地址:"",邮箱:"",网址:"",电话:"",传真:""},
			

			// 保存 回传属性
			saveData1:{id:'',optlock:'',slaveId:''}, 
			selectMain:{}, // 主记录
			selectMinor:{}, // 从记录  
			
			
			targetRecord:{},
			radioState:[],
			checkAll:-1,
			mainCheck:0,


			initSelect: [{id:1,name:''}],	// 主记录 下拉		

		}
	}
	componentDidMount(){
		this.getInit();
		this.mainSelect(0);
	}
	componentWillReceiveProps(nextProps) {
		//用于给默认值
	}
	mainSelect(mainType){
		let {mainCheck} = this.state;
		if(mainType==0){
			mainCheck = mainType;
		}
		if(mainType == 1){
			mainCheck= mainType;
		}
		this.setState({
			mainCheck: mainCheck
		})
	}

	// 全选
	allChecked(type){

		// 切换 选中 状态
		// const saveData2 = this.state.saveData2;
		// const saveData3 = this.state.saveData3;
		// const saveData4 = this.state.saveData4;
		
		// for(let key of Object.keys(saveData2)){
		// 	saveData2[key] = type;
		// }
		// for(let key of Object.keys(saveData3)){
		// 	saveData3[key] = type;
		// }
		// for(let key of Object.keys(saveData4)){
		// 	saveData4[key] = type;
		// }

		// this.setState({ saveData2:saveData2, saveData3:saveData3, saveData4:saveData4 });


 		let {radioState} = this.state;
 		if(type==0){
 			for(let item in this.state.mainRecord){
 				radioState[item]={main:true,sub:false};
 			}
 		}
 		if(type==1){
 			for(let item in this.state.mainRecord){
 				radioState[item]={main:false,sub:true};
 			}
 		}
 		this.setState({radioState,checkAll:type})
 	}

	// radio 单选
	handleChange(itemSource){

		
		let source = itemSource.type, item = itemSource.item;
		let {mainRecord,subRecord,targetRecord,radioState,checkAll}=this.state;
		let isAllcheckecLeft = "",isAllcheckecRight = "";



		if(source==0){
			targetRecord[item]=mainRecord[item];
			radioState[item]={main:true,sub:false};			
		}
		if(source==1){
			targetRecord[item]=subRecord[item];
			radioState[item]={main:false,sub:true};			
		}
		for(item in mainRecord){
			if(radioState[item] == undefined|| !radioState[item].main ){
				isAllcheckecLeft = "left";
				break;
			}
		}
		for(item in mainRecord){
			if(radioState[item] == undefined || !radioState[item].sub ){
				isAllcheckecRight = "right";
				break;
			}
		}
		if(isAllcheckecLeft != "left" && isAllcheckecRight == "right"){
			checkAll = 0;
		}else if(isAllcheckecLeft == "left" && isAllcheckecRight != "right"){
			checkAll = 1;
		}else{
			checkAll = -1;
		}
		this.setState({radioState,checkAll:checkAll});
	}

	onSaveAndClose(){

		let that = this;
		let {mainCheck,radioState,selectMain,selectMinor}=this.state;
		let json = {供应商代码:'code',国家:'country',名称:'name',英文名称:'enName',供应商类型:"cstmType",供应商等级:"cstmLevel",供应商来源:"cstmCrsekt",描述:"description",地址:"address",邮箱:"defaultEmail",网址:"defaultWeb",电话:"defaultPhone",传真:"defaultFax"};
		let data = {id:'',slaveId:'',fields:[]};

		// 未选择 主记录|从记录 
		 
		if(!selectMain['id'] || !selectMinor['id']) {
			ServiceTips({text:'未选择合并记录！',type:'info'});
			return;
		}
		if(mainCheck == -1) {
			ServiceTips({text:'未选择主记录！',type:'info'});
			return;
		}

		// 回传数据 
		if(!mainCheck){
			data = {
				id: selectMain['id'],
				slaveId: selectMinor['id'],
				fields: Object.entries(radioState).filter(o=>o[1].sub).map(o=>{ let key=o[0]; return json[key] })
			}
		} else{
			data = {
				id: selectMinor['id'],
				slaveId: selectMain['id'],
				fields: Object.entries(radioState).filter(o=>o[1].main).map(o=>{ let key=o[0]; return json[key] })
			}			
		}
		
		
		apiPost(API_FOODING_DS,'/vendor/merge',data,
			(response)=>{							
				ServiceTips({text: response.message,type:'success'});	
				that.onCancel();		
				that.props.getPage();			
			},(errors)=>{
				ServiceTips({text:errors['message'],type:'error'});
		});


 	}

 	onCancel(){
 		const { onCancel } = this.props;
 		if(onCancel){
 			onCancel();
 		}
 	}

 	elementRender(){
 		let checkEles=[];
 		for(let item in this.state.mainRecord){

			// 多语言 
			switch(item) {
				case i18n.t(200964/*供应商代码*/) :
					item = i18n.t(200964/*供应商代码*/);
				break;
				case i18n.t(100087/*国家*/) :
					item = i18n.t(100087/*国家*/);
				break;
				case i18n.t(100001/*名称*/) :
					item = i18n.t(100001/*名称*/);
				break;
				case i18n.t(100226/*英文名称*/) :
					item = i18n.t(100226/*英文名称*/);
				break;
				case i18n.t(200966/*供应商类型*/) :
					item = i18n.t(200966/*供应商类型*/);
				break;
				case i18n.t(200468/*供应商等级*/) :
					item = i18n.t(200468/*供应商等级*/);
				break;
				case i18n.t(200967/*供应商来源*/) :
					item = i18n.t(200967/*供应商来源*/);
				break;
				case i18n.t(100002/*描述*/) :
					item = i18n.t(100002/*描述*/);
				break;
				case i18n.t(100481/*地址*/) :
					item = i18n.t(100481/*地址*/);
				break;
				case i18n.t(100229/*邮箱*/) :
					item = i18n.t(100229/*邮箱*/);
				break;
				case i18n.t(200444/*网址*/) :
					item = i18n.t(200444/*网址*/);
				break;
				case i18n.t(100478/*电话*/) :
					item = i18n.t(100478/*电话*/);
				break;
				case i18n.t(100479/*传真*/) :
					item = i18n.t(100479/*传真*/);
				break;																												
			} 

 			let lebal= <label>{item}</label>;
 			let mitem={item:item,type:0},sitem={item:item,type:1};
 			let source=(
				<div className='common-merge-operation-left'>
					<Radio value ={this.state.mainRecord[item]}
						name={item}
						onChange={()=>{this.handleChange(mitem)}}
						checked = {null==this.state.radioState[item]?false:this.state.radioState[item].main}
					/>
					<p>{this.state.mainRecord[item] || i18n.t(200583/*空*/)}</p>
				</div>
			 );
 			let sub=(<div className='common-merge-operation-right'>
 				<Radio value ={this.state.subRecord[item]}
									name={item}
									onChange={()=>this.handleChange(sitem)}
									checked = {null==this.state.radioState[item]?false:this.state.radioState[item].sub}
								/>
								<p>{this.state.subRecord[item] || i18n.t(200583/*空*/)}</p>
 			</div>);
 			checkEles.push(<div className='common-merge-only' key={item+'only'}>{lebal}{source}{sub}</div>)
 		}
 		return checkEles;
 	}

	// 主要 联系人
	priorityChange(ID){

		let that = this;
		apiGet(API_FOODING_DS,'/vendor/merge/getVendor',{id:ID},
			(response)=>{
				const data = response.data;
				let mainRecordData = {供应商代码: data.code || '',国家: data.country ? data.country.localName : '',名称: data.name || '',英文名称: data.enName || '',供应商类型: data.cstmType ? data.cstmType.name : '',供应商等级:data.cstmLevel ? data.cstmLevel.name : '',供应商来源:data.cstmCrsekt ? data.cstmCrsekt.name : '',描述:data.description || '',地址: data['address'] ? data.address['fullAddress'] : '',邮箱:data.email ? data.email['name'] : '',网址:data.web ? data.web['name'] : '',电话:data.phone ? data.phone['name'] : '',传真:data.fax ? data.fax['name'] : ''};
				

				that.allChecked(0);								
				that.setState({
					mainRecord: mainRecordData,
					selectMain: data,
					checkAll:0,
					saveData1: Object.assign(that.state.saveData1,{id:data.id, optlock:data.optlock})
				});

			},(errors)=>{
		});
	}

	// 次要 联系人
	minorChange(ID){

		let that = this;
		apiGet(API_FOODING_DS,'/vendor/merge/getVendor',{id:ID},
			(response)=>{
				const data = response.data;
				let minorData = {供应商代码: data.code || '',国家: data.country ? data.country.localName : '',名称: data.name || '',英文名称: data.enName || '',供应商类型: data.cstmType ? data.cstmType.name : '',供应商等级:data.cstmLevel ? data.cstmLevel.name : '',供应商来源:data.cstmCrsekt ? data.cstmCrsekt.name : '',描述:data.description || '',地址: data['address'] ? data.address['fullAddress'] : '',邮箱:data.email ? data.email['name'] : '',网址:data.web ? data.web['name'] : '',电话:data.phone ? data.phone['name'] : '',传真:data.fax ? data.fax['name'] : ''};
				
				that.setState({
					subRecord: minorData,
					selectMinor: data,
					saveData1: Object.assign(that.state.saveData1,{slaveId:data.id})					
				});
			},(errors)=>{
		});		
	}

	// 页面初始化
	getInit(){
		let that = this;
		apiGet(API_FOODING_DS,'/vendor/getInitMerge',{},
			(response)=>{	
				that.setState({
					initSelect: response.data.vendors
				});
			},(errors)=>{
		});
	}


 	render(){
 		const {form, data} =this.props;
 		const {getFieldProps, getFieldError } = this.props;
 		const disabled = form.isFieldValidating() || form.isSubmitting();
 		let checkElms=this.elementRender();

 		return (
 			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
					 <div className="common-merge scroll form-horizontal">
						<div className="common-merge-instructions">{i18n.t(200447/*主记录和字段选择*/)}<span>(选择主记录，然后选择其中所要合并的字段)</span></div>
						<div className="common-merge-records">
							<label>{i18n.t(200448/*主记录*/)}</label>
							<div className="common-merge-operation-left">
								<Radio 
									onChange={()=>this.mainSelect(0)}
									checked = {this.state.mainCheck===0}
								/>
								<Select 
									placeholder=""
									style={{width:300}}
									className ='currency-btn select-from-currency'
									optionLabelProp="children"
									optionFilterProp='children'
									onSelect={this.priorityChange}
								>
								{this.state.initSelect.map((o,i)=><Option key={i} value={String(o.id)} title={o.localName}>{o.localName}</Option>)}
								</Select>
							</div>
							<div className="common-merge-operation-right">
								{/*<Radio 
									onChange={()=>this.mainSelect(1)}
									checked = {this.state.mainCheck===1}
								/>*/}
								<Select 
									placeholder=""
									style={{width:300}}
									className ='currency-btn select-from-currency'
									optionLabelProp="children"
									optionFilterProp='children'
									onSelect={this.minorChange}
									>
									{this.state.initSelect.map((o,i)=><Option key={i} value={String(o.id)} title={o.localName}>{o.localName}</Option>)}								
								</Select>
							</div>
						</div>
						<div className="common-merge-all">
							<label></label>
							<div className="common-merge-operation-left">
								<Radio 
									onChange={() => this.allChecked(0)}
									checked = {this.state.checkAll === 0}
								/>
								<p>{i18n.t(200449/*选择此节点中的所有字段*/)}</p>
							</div>
							<div className="common-merge-operation-right">
								<Radio 
									onChange={() => this.allChecked(1)}
									checked = {this.state.checkAll === 1}
								/>
								<p>{i18n.t(200449/*选择此节点中的所有字段*/)}</p>
							</div>
						</div>
						{checkElms}
					</div>
 			</FormWrapper>
 		)
 	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
