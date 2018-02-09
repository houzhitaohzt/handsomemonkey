import React, { Component,PropTypes} from 'react';
import ServiceTips from '../../ServiceTips';
import i18n from '../../../lib/i18n';
export  class AddSplitNumber extends Component{
	constructor (props) {
	    super(props);
	    this.state={
	    	array:[this.props.totalValue],

	    }
	}
  	NumberValueClick(k,e){//值
      //判断一个数为非负数 
      let reg = new RegExp(/^\d+(\.\d{0,8})?$/);
      let inputValue = e.target.value;
      if(!reg.test(Number(inputValue))){
        ServiceTips({text:i18n.t(400160/*请输入最多保留8位小数的非负数*/) + '!!',type:'error'});
        return false;
      }
      this.state.array[k] = e.target.value;
      let total = 0;
      this.state.array.map((e,i)=>{
      	 if(i != 0){total +=parseFloat(e)}
	  });
      if(e.target.value > this.props.totalValue || total >= this.props.totalValue){
        return false;
      }
        let clone = require('clone');
  		let temp = clone(this.props.totalValue);
  		for(let i=0,length=this.state.array.length;i<length;i++){
  			temp = temp - this.state.array[i];
  		}
  		this.state.array[0] = parseFloat((temp + this.state.array[0]).toFixed(8));
  		this.setState({

  		});
  	}
  	addAction(){
  		let array = this.state.array;
  		if(array.length > this.props.addLength){
  				return  false;
  		}
  	    array.push(0);
  		this.setState({
  			array:array
  		});
  	}
  	removeAction(index,e){
		this.state.array.splice(index,1);
		this.state.array[0]= parseFloat((Number(this.state.array[0]) + Number(e)).toFixed(8));
		this.setState({
    	})
  	}
  	defaultAction(){
  	}
  	getDate(){
  		var that = this;
  		this.props.getData(this.state.array,that);
  	}
  	componentWillReceiveProps(nextPorps){
		if(nextPorps.totalValue !== this.props.totalValue){
			this.setState({array:[nextPorps.totalValue]})
		}
	}
 	//  toNumber(v) {
	//   if (v === undefined) {
	//     return v;
	//   }
	//   if (v === '') {
	//     return undefined;
	//   }
	//   if (v && v.trim() === '') {
	//     return NaN;
	//   }
	//   return Number(v);
	// }
  	render(){
  		this.getDate();
  		return (
  			<div className={'row'}>
  				{this.state.array.map((value,i)=>{
  						return (<div className="form-group col-xs-12 col-md-12" key={i} style={{margin:'5px 0'}}>
  									<label className={'col-md-2 col-xs-2'}>{i18n.t(500065/*需求数量*/)}&nbsp;&nbsp;{i+1}</label>
  									<input type="text" className='text-input-nowidth col-sm-6' onChange={this.NumberValueClick.bind(this,i)} value={value} disabled={i === 0}
  									/>
  									<div className={'col-xs-2 col-md-2'} style={{padding:'0px',textAlign:'left'}}>
  										<i className='foddingicon fooding-add-icon2' onClick={this.addAction.bind(this)} style={{margin:'0 20px',cursor: 'pointer'}}></i>
  										<i className={i>0 ?'foddingicon fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i,value)} style={{cursor: 'pointer'}}></i>
  									</div>
  								</div>)
  				})}
  			</div>
  			);
	 }
}
AddSplitNumber.propTypes= {
    dataArray:PropTypes.array,
    addobj:PropTypes.object,
    addLength:PropTypes.number,
}
AddSplitNumber.defaultProps={
	dataArray:[{NumberValue:0}],
	addobj:{LanValue:''},
	addLength:10,

}
export default AddSplitNumber;

