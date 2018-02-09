import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import SalesOrderList from '../../../Quotation/List/components/QuotationList';

export class Order extends Component {
    constructor (props) {
        super(props);
        props.price && props.price(this);
        this.state ={
        	id:this.props.location.query.no
        };
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
       this.salePrices.getPage();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList businessNo = {this.props.value.no} height = {120}
                             salePrices ={no => this.salePrices = no} isDetail ={true}
                             router={this.props.router}/>
         	</div>
        )
    }
}
export default Order;