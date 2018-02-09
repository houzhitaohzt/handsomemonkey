import React, { Component,PropTypes } from 'react';

import {Print} from "../../../../components/Print";


export class ProductDetail extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
            <div>
				{/* 报销单 */}
                <Print page={'expenseaccount'}/>
            </div>
        );
	}

}
export default ProductDetail;


