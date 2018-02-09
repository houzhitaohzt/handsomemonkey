import i18n from './../../../lib/i18n';
import React, { Component,PropTypes} from 'react';
import Select, { Option } from 'rc-select';
import '../asset/_addradio.less';
import Checkbox from '../../CheckBox';
export  class AddRadio extends Component{
	constructor (props) {
	    super(props);
	    this.state={
	    	array:this.props.dataArray
	    }
	}
	selectChange(k,value){
		this.state.array[k].select=value;
		this.state.array[k].radio.type = value;

		var  selectArray =[];
		var  selectCheckd =[];
		for(var i=0;i < this.state.array.length;i++){
			if(this.state.array[k].radio.type == this.state.array[i].radio.type){
					selectArray.push(this.state.array[i]);
			}
		}
		for(var j = 0; j < selectArray.length;j++){
				if(selectArray[j].radio.checked){
					selectCheckd.push(selectArray[j]);
				}
				selectArray[0].radio.checked = true;
		}
		for(var k = 0; k < selectCheckd.length;k++){
				selectCheckd[k].radio.checked = false;
				selectCheckd[0].radio.checked = true;
		}
		this.setState({
    	})
	}
	handleChange(k,e) {
    	this.state.array[k].radio.checked = true;
 		for(var i = 0 ; i < this.state.array.length;i++){
 				if((i != k) && (this.state.array[k].radio.type == this.state.array[i].radio.type)){
 					this.state.array[i].radio.checked = false;
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
  	defaultAction(){
  	}
  	addAction(){
  		if(this.state.array.length > this.props.addLength){
  				return  false;
  		}
  	    var clone = require('clone');
  	    this.state.array.push(clone(this.props.addobj));
  		this.setState({

  		});
  	}
  	removeAction(index){
  		var  selectArray =[];
		for(var i=0;i < this.state.array.length;i++){
			if(this.state.array[index].radio.type == this.state.array[i].radio.type){
					selectArray.push(this.state.array[i]);
			}
		}
		for(var j = 0; j < selectArray.length;j++){
				if(selectArray[j].radio.checked){
					break;
				}
				selectArray[0].radio.checked = true;
		}
		this.state.array.splice(index,1);
		this.setState({
    	})
  	}
  	getDate(){
  		var that = this;
  		this.props.getData(this.state.array,that);
  	}
  	render(){
  		this.getDate();
		return (
			<div>
				{this.state.array.map((value,i)=>{
						return (<div className='addradio' key={i}>
							<CheckBox
								value = {value.radio.type}
								onChange={this.handleChange.bind(this,i)}
								checked ={value.radio.checked}
							/>
							<span className={this.props.isShowMus ? '':'none'} style={{paddingRight:10,color:'red',verticalAlign: 'middle'}}>*</span>
							<Select
								style={{ width: 80}}
								onChange={this.selectChange.bind(this,i)}
								value={value.select}
								getPopupContainer={this.getPopupContainer}
						    >
							    {
							    	this.props.selectArray.map((e,i)=>{
							    			return (<Option value={e} key={i}>{e}</Option>);
							    	})
							    }
							</Select>
							<input type="text" onChange= {this.onChange.bind(this,i)} style={{width:this.props.width}} className="textInput shuru" value = {value.inputValue}  />
							<i className={this.props.showAdd ?'foddingicon fooding-add-icon2 mg':'none'} onClick={this.addAction.bind(this)}></i>
							<i className={i>0 ?'fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i)}></i>
						</div>)
				})}
			</div>
			);
	}
}
AddRadio.propTypes= {
    dataArray:PropTypes.array,
    selectArray:PropTypes.array,
    defaultSelect:PropTypes.string,
    addobj:PropTypes.object,
    addLength:PropTypes.number,
    isShowMus:PropTypes.bool,
    width:PropTypes.number
}
AddRadio.defaultProps={
	dataArray:[{radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/),inputValue:''}],

	selectArray:[i18n.t(300009/*手机*/),i18n.t(100229/*邮箱*/),'sky'],
	defaultSelect:i18n.t(300009/*手机*/),
	addobj:{radio:{type:i18n.t(300009/*手机*/),checked:false},select:i18n.t(300009/*手机*/),inputValue:''},
	addLength:10,
	isShowMus:false,
	width:200
}
export  default AddRadio;

