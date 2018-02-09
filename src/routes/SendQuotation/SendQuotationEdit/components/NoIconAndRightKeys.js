import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';

const {Table} =  require("../../../../components/Table");

export class MeasureCommon extends Component{
	constructor(props) {
		super(props);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.state=this.initState();
	}
	initState(){
		this.datat = [];
		return{
			checkedRows:[],
			selectArr:[],
			choised:false,
			data:[]
		}
	}
	 onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr))
			checkedRows=this.state.data.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
		this.setState({selectArr : selectArr,
			checkedRows:checkedRows, choised:data.checkedAll})
  	}
  	onRowClick(record,index,checked){
		let {checkedRows,selectArr}=this.state;
  		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
  		}else{
  			selectArr.splice(index,1);
				checkedRows.remove(index);
  		}
  		this.setState({
  			selectArr : selectArr,
			checkedRows:checkedRows
  		})
  		let clone =require('clone');
		this.datat = clone(this.props.checkedRowsArray);

		this.datat = selectArr;
  	}
	handleResize(height){
		let sch=document.body.offsetHeight-360-height;
        let scroll = sch-20;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}
	render(){
		let {array,title}= this.props;
		if(this.props.data.length == 0){
			return (
				<div style={{width: '100%',overflow:'hidden',borderRadius: '6px'}} className='menuset-measurement nodata'>
					<div>
						<div className='item-title-one'><span className='title'>{title}</span><span className='icon'></span></div>
					</div>
				</div>)
		}else{
			return (
			<div style={{width: '100%',borderRadius: '6px',zIndex:this.props.Zindex,position:"relative"}} className='menuset-measurement'>
				<div style={{borderBottom:'1px solid #eeeeee'}}>
					<div className='item-title-one'>
						<span className='title'>{title}</span>
					</div>
				</div>
				<Table showHeader ={this.props.showHeader}
					columns={this.props.columns}
					data={this.props.data}
					checkboxConfig={{show:this.props.showCheckbox,checkedAll:this.state.choised,
						checkedRows:this.state.checkedRows,position:'first'}}
					colorFilterConfig={{show:false}}
					followConfig={{show:false}}
					scroll={{x:true,y:this.state.scrollHeight}}
					onHeaderCellClick={this.onHeaderCellClick}
					onRowClick={this.onRowClick}
					onRowDoubleClick={this.onRowDoubleClick}
				/>
			</div>
			)
		}
	}
}

export default MeasureCommon;
