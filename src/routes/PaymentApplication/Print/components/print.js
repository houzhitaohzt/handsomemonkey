import React, { Component,PropTypes } from 'react';

import {Print} from "../../../../components/Print";


export class ProductDetail extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
            <div>
				{/* 付款申请 */}
                <Print page={'payment'}/>
            </div>
        );
	}

}
export default ProductDetail;


