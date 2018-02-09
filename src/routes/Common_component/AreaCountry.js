import React,{Component,PropTypes} from 'react';

import {I18n} from '../../lib/i18n';//国际化

// ajax
import Select, { ConstVirtualSelect,Option } from '../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../services/apiCall'; // ajax
import ServiceTips from '../../components/ServiceTips'; // 提示框

import './assets/index.less' 
import {ButtonDIV} from "../Mail/Home/components/Common.js"; // 公共库

import {Transfer,Radio } from 'antd';
const RadioGroup = Radio.Group;



class PageDIV extends Component{ 
	
	constructor(props){
		super(props);

		// this state 
		this.state = {
			actionBOX:false, // box
			getTime:new Date().getTime(), // 时间戳

			clientWidth:0, // 位置
			areaKeys:[], // 区域
			countrytKeys:[], // 国家
			valueRadio: 1,	
			areaData:[], // 区域 data
			countrytData:[], // 国家 data	
			countryList:undefined, // 国家列表

		}

	}

	componentDidMount(){
		let that = this;
		
		setTimeout(function(){
			that.setState({clientWidth:that.refs.select.getBoundingClientRect().top+30});
		},700);
			
    }

	componentWillMount(){
	
	}

	componentWillUnmount() {
	}

	// radio change
	onChange = (e) => {
		let key =  e.target.value;

		if( key == 1 ) this.getArea(); // 区域
		if( key == 2 ) this.getCountry(); // 国家
		
		this.setState({valueRadio:key});
	}
	
	//选择地区 
	areaHandleChange = (nextTargetKeys, direction, moveKeys) => this.setState({areaKeys:nextTargetKeys});

	//选择国家
	countrytHandleChange = (nextTargetKeys, direction, moveKeys) => this.setState({countrytKeys:nextTargetKeys});




	// open 
	openHandle = ()=> {
		let {actionBOX} = this.state;
		let {disabled=false} = this.props;

		if(!actionBOX && !disabled) {
			this.getArea();
			this.setState({actionBOX:true});
		}
	}

	// get area
	getArea = ()=> {
		let that = this;
		apiGet(API_FOODING_DS,'/saleArea/getList',{},
			(response)=>{	
				let list = (response['data']||[]).map(o=>({key:o['id'],title:o['localName']}));
				that.setState({areaData:list});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});			
	}

	// get area
	getCountry = ()=> {
		let that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{	
				let list = (response['data']||[]).map(o=>({key:o['id'],title:o['localName']}));
				that.setState({countrytData:list});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// confirm 
	confirmHandle = ()=> {
		let that = this;
		let {areaKeys,countrytKeys} = this.state;

		apiPost(API_FOODING_DS,'/saleArea/getCountry',{saleAreaId:areaKeys,cntryId:countrytKeys},
			(response)=>{	
				that.setState({countryList:undefined},()=>{
					that.setState({getTime:new Date().getTime(),countryList:response['data']},()=>{
						that.cancelHandle();
					});
					
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}

	// cancel 
	cancelHandle = ()=> {
		this.setState({actionBOX:false});
	}


	render(){
		let that = this;
		let {countryList,areaData,countrytData,valueRadio,areaKeys,countrytKeys,clientWidth,getTime,actionBOX} = this.state;
		let {defaultValue=[],disabled=false,form,fieldName,rules=false} = this.props;


		return <div ref="select" onClick={this.openHandle} className="select-area-country">
				<ConstVirtualSelect
					form={form}
					style={{width:'100%'}}
					fieldName={fieldName}
					refreshMark={getTime}
					isRequest={false}
					pageSize={0}
					initialValue={(countryList ? countryList : defaultValue).map(o=>o['id'])}										
					initValueOptions={(countryList ? countryList : defaultValue).map(o=>({name:o['localName'],id:o['id']}))}										
					multi={true}
					rules={rules}
					disabled={disabled}
				/>
				{ actionBOX ? 
					<div className='areaBox' style={{top:clientWidth}}>
						<div>
							<RadioGroup onChange={this.onChange} value={valueRadio}>
								<Radio value={1}>按销售区域</Radio>
								<Radio value={2}>按国家</Radio>
							</RadioGroup>							
						</div>
						<div className={`transfer ${valueRadio==1 ? 'on':''}`}>
							<Transfer
								showSearch
								titles={[I18n.t(600297/*未选*/), I18n.t(600296/*已选*/)]}
								listStyle={{width:250,height:300,}}
								dataSource={areaData}
								targetKeys={areaKeys}
								onChange={this.areaHandleChange}
								render={item => item.title}
							/>
						</div>
						<div className={`transfer ${valueRadio==2 ? 'on':''}`}>
							<Transfer
								showSearch
								titles={[I18n.t(600297/*未选*/), I18n.t(600296/*已选*/)]}
								listStyle={{width:250,height:300,}}
								dataSource={countrytData}
								targetKeys={countrytKeys}
								onChange={this.countrytHandleChange}
								render={item => item.title}
							/>
						</div>						
						<br/>				
						<ButtonDIV confirmHandle={this.confirmHandle} cancelHandle={this.cancelHandle} />
					</div>:''
				}	

		</div>	
	}
}
export default PageDIV;

