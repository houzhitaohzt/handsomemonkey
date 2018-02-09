import i18n from './../../../lib/i18n';
import React, { Component,PropTypes} from 'react';
import Select, { Option } from 'rc-select';
import Radio from '../../Radio'
export  class AddSelect extends Component{
	constructor (props) {
	    super(props);
	    this.selectThree =this.selectThree.bind(this);
	    this.state={
	    	array:this.props.dataArray
	    }
	}
	selectChange(k,value){
		if(this.props.template == 2 || this.props.template == 5){
			this.state.array[k].select1.select=value;
		}
		else if(this.props.template ==6){
			this.state.array[k].select.select=value;
		}
		else{
			this.state.array[k].select=value;
			this.state.array[k].radio.type = value;
		}
		this.setState({
    	});
	}
	selectChangeTwo(k,value){
		this.state.array[k].select2.select=value;
		this.setState({
    	})
	}
	handleChange(k,e) {
    	this.state.array[k].radio.checked = e.target.value;
    	if(e.target.value){
			for(var i = 0 ; i < this.state.array.length;i++){
			 	if(i != k){
			 		this.state.array[i].radio.checked = false;
			 	}
			}
    	}
    	this.setState({
    	})
  	}
  	onChange(i,e){
  			this.state.array[i].inputValue=e.target.value;
  			this.setState({

  			});
  	}
  	selectThree(k,string,value){
  		if(string == 'fax'){
  			this.state.array[k].value.fax.select = value;
  		}else if(string == 'nation'){
  			this.state.array[k].value.nation.select = value;
  		}else if(string == 'genre'){
  			this.state.array[k].value.genre.select = value;
  		}else if(string == 'genre_1'){
  			this.state.array[k].value.genre_1.select = value;
  		}else if(string == 'centre'){
  			this.state.array[k].value.centre.select = value;
  		}
  		this.setState({

  		});
  	}
  	addAction(){
  		if(this.state.array.length <= this.props.addLength){
  			var clone = require('clone');
  			this.state.array.push(clone(this.props.addobj));
  		}
  		this.setState({
  		});
  	}
  	removeAction(index){
  		var  selectArray =[];
		this.state.array.splice(index,1);
		this.setState({
    	})
  	}
  	getDate(){
  		var that = this;
  		this.props.getData(this.state.array,that);
  	}
  	clientChange(k,e){
  		this.state.array[k].value =e.target.value;
  		this.setState({

  		});
  	}
  	render(){
  		this.getDate();
  		this.state={
	    	array:this.props.dataArray
	    }
  		if(this.props.template == 1){
  				return (
				<div>
					{this.state.array.map((value,i)=>{
							return (<div className='addradio' key={i}>
								<Radio
									value = {true}
									onChange={this.handleChange.bind(this,i)}
									checked ={value.radio.checked}
								/>
								<span className='span1' style ={{marginRight:15}}>
									<i style ={{marginLeft:0}} className={ value.isMus ? '':'none'}>*</i>
									{value.title}
								</span>
								<Select
									style={{width: this.props.width}}
									onChange={this.selectChange.bind(this,i)}
									value={value.select}
									getPopupContainer={this.getPopupContainer}
							    >
								    {
								    	this.props.selectArray.map((e,i)=>{
								    			return (<Option value={""+i} key={i}>{e}</Option>);
								    	})
								    }
								</Select>
								<i className={this.props.showAdd ?'fooding-add-icon2 foddingicon mg':'none'} onClick={this.addAction.bind(this)}></i>
								<i className={i>0 ?'foddingicon fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i)}></i>
							</div>)
					})}
				</div>
			);
  		}else if(this.props.template == 2){
  			return (
				<div>
					{this.state.array.map((value,i)=>{
							return (<div className='addradio' key={i}>
								<Radio
									value = {true}
									onChange={this.handleChange.bind(this,i)}
									checked ={value.radio.checked}
								/>
								<span className='span1'>
									<i style ={{marginLeft:0}} className={ value.isMus ? '':'none'}>*</i>
									{value.select1.title}
								</span>
								<Select
									placeholder={''}
									value ={value.select1.select}
									style={{width: 100,marginRight:10}}
									onChange={this.selectChange.bind(this,i)}
									getPopupContainer={this.getPopupContainer}
							    >
								    {
								    	value.select1.array.map((e,i)=>{
								    			return (<Option value={""+i} key={i}>{e}</Option>);
								    	})
								    }
								</Select>
									{value.select2.title}
								<Select
									placeholder={''}
									value ={value.select2.select}
									onChange={this.selectChangeTwo.bind(this,i)}
									style={{width:320,marginLeft:20,marginRight:10}}
									className ='currency-btn select-from-currency'>
									 {
								    	value.select2.array.map((e,i)=>{
								    			return (<Option value={""+i} key={i}>{e}</Option>);
								    	})
								    }
								</Select>
								<i className={this.props.showAdd ?'fooding-add-icon2 foddingicon mg':'none'} onClick={this.addAction.bind(this)}></i>
								<i className={i>0 ?'fooding-delete_icon2 foddingicon':'none'} onClick={this.removeAction.bind(this,i)}></i>
							</div>)
					})}
				</div>
			);
  		}else if(this.props.template == 3){
  			return (
	  				<div>
						{this.state.array.map((value,i)=>{
								return (<div className='addradio' key={i}>
									<span className='span1'>
										<i style ={{marginLeft:0}} className={ value.isMus ? '':'none'}>*</i>
									</span>
									<Select
										placeholder={''}
										value ={value.value.fax.select}
										style={{width: 80,marginRight:20}}
										onChange={this.selectThree.bind(this,i,'fax')}
										getPopupContainer={this.getPopupContainer}
								    >
									    {
									    	value.value.fax.array.map((e,i)=>{
									    			return (<Option value={""+i} key={i}>{e}</Option>);
									    	})
									    }
									</Select>
										{i18n.t(100087/*国家*/)}
									<Select
										placeholder={''}
										value ={value.value.nation.select}
										onChange={this.selectThree.bind(this,i,'nation')}
										style={{width:100,marginLeft:10,marginRight:20}}
										className ='currency-btn select-from-currency'>
										 {
									    	value.value.nation.array.map((e,i)=>{
									    			return (<Option value={""+i} key={i}>{e}</Option>);
									    	})
									    }
									</Select>
									{i18n.t(100224/*运输方式*/)}
									<Select
										placeholder={''}
										value ={value.value.genre.select}
										onChange={this.selectThree.bind(this,i,'genre')}
										style={{width:100,marginLeft:10,marginRight:10}}
										className ='currency-btn select-from-currency'>
										 {
									    	value.value.genre.array.map((e,i)=>{
									    			return (<Option value={""+i} key={i}>{e}</Option>);
									    	})
									    }
									</Select>
									<Select
										placeholder={''}
										value ={value.value.genre_1.select}
										onChange={this.selectThree.bind(this,i,'genre_1')}
										style={{width:100,marginLeft:0,marginRight:20}}
										className ='currency-btn select-from-currency'>
										 {
									    	value.value.genre_1.array.map((e,i)=>{
									    			return (<Option value={""+i} key={i}>{e}</Option>);
									    	})
									    }
									</Select>
									{'码头'}
									<Select
										placeholder={''}
										value ={value.value.centre.select}
										onChange={this.selectThree.bind(this,i,'centre')}
										style={{width:100,marginLeft:10,marginRight:10}}
										className ='currency-btn select-from-currency'>
										 {
									    	value.value.centre.array.map((e,i)=>{
									    			return (<Option value={""+i} key={i}>{e}</Option>);
									    	})
									    }
									</Select>
									<i className={this.props.showAdd ?'fooding-add-icon2 foddingicon mg':'none'} onClick={this.addAction.bind(this)}></i>
									<i className={i>0 ?'fooding-delete_icon2 foddingicon':'none'} onClick={this.removeAction.bind(this,i)}></i>
								</div>)
						})}
					</div>
  				);
  		}else if(this.props.template == 4){
  			return (
	  				<div>
						{this.state.array.map((value,i)=>{
								return (<div className='addradio' key={i}>
									<span className='span1'>
										<i style ={{marginLeft:0}}>*</i>
									</span>
									{value.title}
									<input
										type ='text'
										value={value.value}
										style={{width:220,marginLeft:10,marginRight:10}}
										onChange={this.clientChange.bind(this,i)}
										className ='text-input' />
									<i className={this.props.showAdd ?'foddingicon fooding-add-icon2 mg':'none'} onClick={this.addAction.bind(this)}></i>
									<i className={i>0 ?'foddingicon fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i)}></i>
								</div>)
						})}
					</div>
  				);
  		}else if(this.props.template == 5){
  			return(
  				<div>
  					{this.state.array.map((value,i)=>{
							return (<div className='addradio product' key={i}>
								<span className='title'>
									<i style ={{marginLeft:0}} className={ value.isMus ? '':'none'}>*</i>
									{value.title}
								</span>
								<Select
									placeholder={''}
									style={{width: 200}}
									onChange={this.selectChange.bind(this,i)}
									value={value.select1.select}
									getPopupContainer={this.getPopupContainer}
							    >
								    {
								    	value.select1.array.map((e,i)=>{
								    			return (<Option value={""+i} key={i}>{e}</Option>);
								    	})
								    }
								</Select>
							    <span className='padding-left padding-right'>{value.text}</span>
							    <input type='text' className='text-input margin-right' />
							    <Select
									placeholder={''}
									style={{width: 80}}
									onChange={this.selectChangeTwo.bind(this,i)}
									value={value.select2.select}
									getPopupContainer={this.getPopupContainer}
							    >
								    {
								    	value.select2.array.map((e,i)=>{
								    			return (<Option value={""+i} key={i}>{e}</Option>);
								    	})
								    }
								</Select>
								<i className={this.props.showAdd ?'foddingicon fooding-add-icon2 mg':'none'} onClick={this.addAction.bind(this)}></i>
								<i className={i>0 ?'foddingicon fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i)}></i>
							</div>)
					})}
  				</div>
  				)
  		}else if(this.props.template == 6){
			return(
  				<div>
  					{this.state.array.map((value,i)=>{
							return (<div className='addradio' key={i}>
								<span className='title'>
									<i style ={{marginLeft:0,color:'red'}}>{'*'}</i>
									{value.title}
								</span>
								<Select
									placeholder={''}
									style={{width: 200}}
									onChange={this.selectChange.bind(this,i)}
									value={value.select.select}
									getPopupContainer={this.getPopupContainer}
							    >
								    {
								    	value.select.array.map((e,i)=>{
								    			return (<Option value={""+i} key={i}>{e}</Option>);
								    	})
								    }
								</Select>
							    <span className='padding-left padding-right'>{value.text}</span>
							    <input type='text' className='text-input margin-right'
							     value= {value.inputValue}
							     onChange = {this.onChange.bind(this,i)}
							      />
							    <span className='title'>
									<i style ={{marginLeft:0,color:'red'}}>*</i>
									{value.title1}
								</span>
								<Radio
									value = {true}
									onChange={this.handleChange.bind(this,i)}
									checked ={value.radio.checked}
								/>
								<i className={this.props.showAdd ?'foddingicon fooding-add-icon2 mg':'none'} onClick={this.addAction.bind(this)}></i>
								<i className={i>0 ?'foddingicon fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i)}></i>
							</div>)
					})}
  				</div>
  				)
  		}
	
	}
}
AddSelect.propTypes= {
    dataArray:PropTypes.array,
    selectArray:PropTypes.array,
    defaultSelect:PropTypes.string,
    addobj:PropTypes.object,
    width:PropTypes.number,
    template:PropTypes.number,
    showAdd:PropTypes.bool
}
AddSelect.defaultProps={
	dataArray:[{title:'指定包装',isMus:true,radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/)}],
	selectArray:[i18n.t(300009/*手机*/),i18n.t(100229/*邮箱*/),'sky'],
	defaultSelect:i18n.t(300009/*手机*/),
	addobj:{title:'指定包装',isMus:true,radio:{type:i18n.t(300009/*手机*/),checked:false},select:i18n.t(300009/*手机*/)},
	addLength:10,
	width:320,
	template:1,
	showAdd:true
}
export  default AddSelect;
