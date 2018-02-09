import React,{Component,PropTypes} from 'react';
import SalesOrderList from '../../Quotation/List/components/QuotationList';
export class Order extends Component {
    constructor (props) {
        super(props);
        this.state ={
        	id:this.props.location.query.id
        };
        props.salePrices && props.salePrices(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.salePrices.getPage();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList id = {this.props.id} customer ={this.props.customer} height = {120} isDetail ={true}
                 router={this.props.router} salePrices ={no => this.salePrices = no}
             />
         	</div>
        )
    }
}
export default Order;