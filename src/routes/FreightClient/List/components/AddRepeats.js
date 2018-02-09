import React, {PropTypes} from 'react'
import Page from "../../../../components/Page";

const {Table} = require("../../../../components/Table");

export class AddRepeats extends React.Component{
	render(){
		let dom;
		let {columns,data,searchClick,customerRechecking,labelWord}=this.props;
	if(customerRechecking === "add-label-active-table-show"){
		dom=(<div>
			<div className="common-add-table col-xs-12">
				<label className={customerRechecking} onClick={searchClick}>{labelWord}</label>
				<Table
					columns={columns}
					data={data}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show:false}}
					followConfig={{show:false}}
					prefixCls={"rc-confirm-table"}
					scroll={{x:false, y:false}}
				/>
			</div>
			<div className={'col-xs-12'}>
				<Page totalPages={10} />
			</div>
		</div>)
	}else{
		dom=(<div className="common-add-table col-xs-12">
			<label className={customerRechecking} onClick={searchClick}>{labelWord}</label>
			</div>)
	}
return (<div className="row">
		{dom}
	</div>)
	}
}

export default AddRepeats;
