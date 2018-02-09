import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
import Dialog from "../../../../components/Dialog/Dialog";
import Table from "../../../../components/Table";
import Checkbox from "../../../../components/CheckBox";

class SendEmail extends Component{
	constructor(props){
		super(props);
		this.columns={left:[{
			title:i18n.t(300016/*联系人名称*/),
			dataIndex : 'linkname',
			key : 'linkname',
			width : "90%",
			render(data,row,index){
				var reg = /[\u4e00-\u9fa5]/;
				let words = data.match(reg);
				return (<div className="text-ellipsis">{data}</div>);
			}
		}],
		right:[{
			title:i18n.t(200462/*已选择联系人*/),
			dataIndex:'linkname',
			key:"linkname",
			width:'90%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		}]}
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onLeftHeaderCellClick=this.onLeftHeaderCellClick.bind(this);
		this.onRightHeaderCellClick=this.onRightHeaderCellClick.bind(this);
		this.onLeftRowClick=this.onLeftRowClick.bind(this);
		this.onRightRowClick=this.onRightRowClick.bind(this);
		this.tableLeftSearch=this.tableLeftSearch.bind(this);
		this.state=this.initState()
	}
	static PropTypes={
		selectProducts:PropTypes.func,
		data:PropTypes.object,
		form:PropTypes.object,
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func,
	}

	static defaultProps={
		selectProducts(){},
		onSaveAndClose(){},
		onCancel(){}
	}

	initState(){
		return{
			leftCheckedRows:[],
			rightCheckedRows:[],
			leftChoised : false,
			rightChoised : false,
			leftSelectedRecords : [],
			rightSelectedRecords : [],
			selectValue:'',
			left:[{id:0,linkname:""}],
			right:[{id:7,linkname:""}]
		}
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(null == errors){
				if(onSaveAndClose){
					onSaveAndClose(form.getFieldsValue());
				}
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel()
		}
	}
	onLeftHeaderCellClick(e,data){
		let records = this.state.leftSelectedRecords || [];
		let checkedRows = this.state.leftCheckedRows;
		if(data.checkedAll){
			records=records.concat(this.state.left);
			checkedRows=this.state.left.map((value,index)=>index);
		}else{
			records=[];
			checkedRows=[];
		}
		this.setState({leftSelectedRecords:records,leftChoised:data.checkedAll,leftCheckedRows:checkedRows});
	}
	onRightHeaderCellClick(e,data){
		let records = this.state.rightSelectedRecords || [];
		let checkedRows = this.state.rightCheckedRows;
		if(data.checkedAll){
			records=records.concat(this.state.right);
			checkedRows=this.state.right.map((value,index)=>index);
		}else{
			records=[];
			checkedRows=[];
		}
		this.setState({rightSelectedRecords:records,rightCheckedRows:checkedRows,rightChoised:data.checkedAll});
	}
	onLeftRowClick(record,index,checked){
		let records = this.state.leftSelectedRecords || [];
		let checkedRows = this.state.leftCheckedRows;
		if(checked){
			records.push(record);
			checkedRows.push(index);
		}else{
			records.remove(record);
			checkedRows.remove(index);
		}
		this.setState({leftSelectedRecords:records});
	}
	onRightRowClick(record,index,checked){
		let records = this.state.rightSelectedRecords || [];
		let checkedRows=this.state.rightCheckedRows;
		if(checked){
			records.push(record);
			checkedRows.push(index);
		}else{
			for(var i = 0; i < records.length; i++){
				if(records[i].id==record.id){
					records.remove(record);
				}
			}
			checkedRows.remove(index);
		}
		this.setState({rightSelectedRecords:records});
	}
	rightClick(){
		let {left,right}=this.state;
		for(var i = 0; i < this.state.leftSelectedRecords.length; i++){
			left.remove(this.state.leftSelectedRecords[i]);
		}
		right = right.concat(this.state.leftSelectedRecords);
		this.setState({left:left,right:right,leftChoised:false,leftSelectedRecords:[],
			leftCheckedRows:[]});
		this.props.selectProducts(right);
	}
	leftClick(){
		let {left,right}=this.state;
		for(var i = 0; i < this.state.rightSelectedRecords.length; i++){
			right.remove(this.state.rightSelectedRecords[i]);
		}
		left = left.concat(this.state.rightSelectedRecords);

		this.setState({left:left,right:right,rightChoised:false,rightSelectedRecords:[],rightCheckedRows:[]});
		this.props.selectProducts(right);
	}
	tableLeftSearch(e){
		this.setState({
	      selectValue:e.target.value
	    });
	}
	render(){
		const {dataMain} = this.props;
		const {getFieldProps, getFieldError,form} = this.props.form;
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
			<div className="send-email-common scroll" style={{maxHeight:'344px',overflowY:'auto'}}>
				<div className="row">
					<div className="col-xs-6 send-email-common-main">
						<p className="send-email-common-main-linker">{i18n.t(100372/*主联系人*/)}</p>
						<Checkbox
							name="my-checkbox"
		  					defaultChecked
						/>
						<p className="send-email-common-main-linker">{i18n.t(200463/*徐东*/)}<span style={{marginLeft:'8px'}}>{dataMain.contacts}</span></p>
					</div>
				</div>
				<div className="send-email-common-table">
					<div className="table-left">
						<Table
							columns={this.columns.left}
							data={this.state.left}
							checkboxConfig={{show:true,checkedAll:this.state.leftChoised,checkedRows:this.state.leftCheckedRows}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:260}}
							onHeaderCellClick={this.onLeftHeaderCellClick}
							onRowClick={this.onLeftRowClick}
						/>
						<a className={'send-email-common-table-search'} href="javascript:;">
	                      	<input type= 'text' onChange ={this.tableLeftSearch}  value={this.state.selectValue} />
	                      	<i className='foddingicon fooding-search_32'></i>
						</a>
					</div>
					<div className="content-button">
		               <i className='foddingicon fooding-arrow-right_16 move-right' onClick={this.rightClick.bind(this)}></i>
		               <i className='foddingicon fooding-arrow_left_16 move-left' onClick={this.leftClick.bind(this)}></i>
					</div>
					<div className="table-right">
						<Table
							columns={this.columns.right}
							data={this.state.right}
							checkboxConfig={{show:true,checkedAll:this.state.rightChoised,checkedRows:this.state.rightCheckedRows}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							prefixCls={"rc-confirm-table"}
							scroll={{x:false, y:260}}
							onHeaderCellClick={this.onRightHeaderCellClick}
							onRowClick={this.onRightRowClick}
						/>
					</div>
				</div>
			</div>
		</FormWrapper>);
	}
}

SendEmail=createForm()(SendEmail);

export default SendEmail;

