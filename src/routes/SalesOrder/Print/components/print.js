import React, { Component,PropTypes } from 'react';

import {Print} from "../../../../components/Print";


export class ProductDetail extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
            <div>
				{/* 销售订单 */}
                <Print page={'market'}/>
            </div>
        );
	}

}
export default ProductDetail;


