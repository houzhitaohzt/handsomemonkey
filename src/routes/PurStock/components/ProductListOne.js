import React, {Component, PropTypes} from "react";
import Page from "../../../components/Page";//分页
const {Table} = require("../../../components/Table");//Table表格
class ProductOne extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
	}

	initState(){
		return {
		}
	}
	render(){
		const {columns,data} = this.props;
		return(<div>
			<div className={'client-body-single'}>
				<Table 
					columns={columns}
					data={data}
					checkboxConfig={{show:false}}
					followConfig={{show:false}}
					scroll={{x:false,y:false}}
				/>
			</div>
		</div>)
	}
}
export default ProductOne;