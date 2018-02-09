import React, {Component} from 'react';
import SalesOrderList from '../../../SalesOrder/List/components/SalesOrderList';

export class Order extends Component {
    constructor (props) {
        super(props);
        this.state ={
        	id:this.props.location.query.id
        };
        props.order && props.order(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.order.getPage();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList id = {this.props.id} height = {120} order ={no => this.order = no}
                             router={this.props.router} isDetail = {true}
             />
         	</div>
        )
    }
}


export default Order;
