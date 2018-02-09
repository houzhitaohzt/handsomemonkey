import React,{Component,PropTypes} from 'react';
import SalesOrderList from '../../../SalesOrder/List/components/SalesOrderList';
export class Order extends Component {
    constructor (props) {
        super(props);
        this.state ={
        	id:this.props.location.query.id
        }
        props.salesOrder && props.salesOrder(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.salesOrder.getPages();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList offerId = {this.props.location.query.id} height = {120} router={this.props.router}
                             salesOrder ={no => this.salesOrder = no} isDetail ={true}
             />
         	</div>
        )
    }
}


export default Order;
