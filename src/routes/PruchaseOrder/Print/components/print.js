import React, { Component,PropTypes } from 'react';

import {Print} from "../../../../components/Print";


export class ProductDetail extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
            <div>
				{/* 采购订单 */}
                <Print page={'procurement'}/>
            </div>
        );
	}

}
export default ProductDetail;


