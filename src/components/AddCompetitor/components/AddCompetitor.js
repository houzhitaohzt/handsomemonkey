import i18n from './../../../lib/i18n';
import React, { Component,PropTypes} from 'react';
import Select, { Option } from 'rc-select';
import "../asset/_addcompetitor.less";
let array=[];
export  class AddCompetitor extends Component{
	constructor (props) {
	    super(props);
	    let clone = require('clone');
	    let objArray= clone(this.props.dataArray);
	    array.push(objArray);
	    this.state={
	    	array:array
	    }
	}
  	competitorClick(k,num,e){//竞争对手
  		this.state.array[num][k].competitorValue=e.target.value;
  		this.setState({

  		})
  	}
  	priceClick(k,num,e){//报价

  		this.state.array[num][k].priceValue=e.target.value;
  		this.setState({

  		})
  	}
  	strikepriceClick(k,num,e){//成交价
  		this.state.array[num][k].strikepriceValue=e.target.value;
  		this.setState({

  		})
  	}
  	strikenumberClick(k,num,e){//成交数量
  		this.state.array[num][k].strikenumberValue=e.target.value;
  		this.setState({

  		})
  	}
  	currencyChange(k,num,value){//币种
  		this.state.array[num][k].currencyValue=value;
  		this.setState({

  		})
  	}
  	unitChange(k,num,value){//单位
  		this.state.array[num][k].unitValue=value;
  		this.setState({

  		})

  	}
  	addAction(num){
  		let array = this.state.array;
  		if(array[num].length > this.props.addLength){
  				return  false;
  		}
  		 let clone = require('clone');
  		 let addobj = clone(this.props.addobj);
  	    array[num].push(addobj);
  		this.setState({
  			array:array
  		});
  	}
  	removeAction(index,num){
		this.state.array[num].splice(index,1);
		this.setState({
    	})
  	}
  	defaultAction(){
  	}
  	getDate(){
  		var that = this;
  		this.props.getData(this.state.array,that);
  	}
  	render(){
  		this.getDate();
		return (
			<div>
				{this.state.array[this.props.num].map((value,i)=>{
						return (<div className='addcompetitor' key={i}>
								<div className={'row'}>
									<label className={'col-sm-1'}>{i18n.t(100449/*竞争对手*/)}</label>
									<input type="text" className='text-input-nowidth col-sm-10' onChange={this.competitorClick.bind(this,i,this.props.num)} value={value.competitorValue}/>
									<div className={'col-sm-1'} style={{padding:'0px',textAlign:'left'}}>
									<i className='fooding-add-icon2' onClick={this.addAction.bind(this,this.props.num)}></i>
									<i className={i>0 ?'fooding-delete_icon2':'none'} onClick={this.removeAction.bind(this,i,this.props.num)}></i></div>
								</div>
								<div className={'row'}>
									<div className={'col-sm-6'}>
										<div className={'row'}>
											<label className={'col-sm-2'}>{i18n.t(200116/*报价*/)}</label>
											<input type="text" className='text-input-nowidth col-sm-4' onChange={this.priceClick.bind(this,i,this.props.num)} value={value.priceValue} />
											<label className={'col-sm-2'}>{i18n.t(500066/*成交价*/)}</label>
											<input type="text" className='text-input-nowidth col-sm-4' onChange={this.strikepriceClick.bind(this,i,this.props.num)} value={value.strikepriceValue} />
										</div>
									</div>
									<div className={'col-sm-6'}>
										<div className={'row'}>
											<label className={'col-sm-1'}></label>
											<Select
												onChange={this.currencyChange.bind(this,i,this.props.num)}
												value={value.currencyValue}
												className ='currency-btn select-from-currency col-sm-2'
											>
											{
												this.props.currencySelectValue.map((e,i) => {
													return (<Option value={e} key={i}>{e}</Option>)
												})
											}
											</Select>
											<label className={'col-sm-2'}>成交数量</label>
											<input type="text" className='text-input-nowidth col-sm-4' onChange={this.strikenumberClick.bind(this,i,this.props.num)} value={value.strikenumberValue} />
											<label className={'col-sm-1'}></label>
											<Select
												onChange={this.unitChange.bind(this,i,this.props.num)}
												value={value.unitValue}
												className ='currency-btn select-from-currency col-sm-2 '
											>
											{
												this.props.unitSelectValue.map((e,i) => {
													return (<Option value={e} key={i}>{e}</Option>)
												})
											}
											</Select>
										</div>
									</div>
								</div>
						</div>)
				})}
			</div>
			);
	}
}
AddCompetitor.propTypes= {
    dataArray:PropTypes.array,
    addobj:PropTypes.object,
    addLength:PropTypes.number,
    currencySelectValue:PropTypes.array,
    unitSelectValue:PropTypes.array
}
AddCompetitor.defaultProps={
	dataArray:[{competitorValue:'',priceValue:'',strikepriceValue:'',strikenumberValue:'',currencyValue:'',
unitValue:''}],
	addobj:{competitorValue:'',priceValue:'',strikepriceValue:'',strikenumberValue:'',currencyValue:'',
unitValue:''},
	addLength:10,
	currencySelectValue: ['CNY','RMB'],
	unitSelectValue : ["台","个","包","袋","斤"]

}
export  default AddCompetitor;

