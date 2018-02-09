import React,{Component,PorpTypes} from "react";
import {createForm,FormWrapper} from "../../../../components/Form";
import IFrame from '../../../../components/IFrame';
import {apiGet,apiPost,apiForm,API_FOODING_OA,language,pageSize,sizeList} from '../../../../services/apiCall';
export class Accessoryplug extends Component{
	constructor(props){
		super(props);
	}
	render(){
		let that = this;
		console.log(API_FOODING_OA+"/resources/plugins/flexpaper/swfFile/"+this.props.filename);
		return (

					<FormWrapper showFooter={true}
					showSaveClose ={false}
					onSaveAndClose={this.props.onSaveAndClose}
					onCancel={this.props.onCancel.bind(this,that)}>
									<div className="client-add scroll" style={{height:'350px',overflowY:'auto'}}>
										<IFrame frameBorder={1} style={{width:'100%',height:'350px'}}
										src={this.props.filename}></IFrame>
								   </div>
					</FormWrapper>
		)
	}
}
export default Accessoryplug;
