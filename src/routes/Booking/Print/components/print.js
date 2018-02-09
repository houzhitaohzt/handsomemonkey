import React, { Component,PropTypes } from 'react';

import {Print} from "../../../../components/Print";


export class ProductDetail extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
            <div>
				{/* 物流订单 */}
                <Print page={'flow'}/>
            </div>
        );
	}

}
export default ProductDetail;


