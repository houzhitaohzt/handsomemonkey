import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import SalesOrderList from '../../../SalesOrder/List/components/SalesOrderList';
import {permissionsBtn} from "../../../../services/apiCall";

export class Order extends Component {
    constructor (props) {
        super(props);
        props.salesOrder && props.salesOrder(this);
        this.state ={
        	id:this.props.location.query.no
        };
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.order.getPage();
    }
    renderButton = () => {
        let buttons = [];
        let businessNo = this.props.value.no;

        if (businessNo){//草稿
            buttons.push(
                <SalesOrderList businessNo = {this.props.value.no} height = {120} order ={no => this.order = no} isDetail ={true} router={this.props.router}/>
            );
        }
        return buttons;
    }
    render() {


        return (
        	<div style={{marginTop:10}}>
                {this.renderButton()}



         	</div>
        )
    }
}


export default Order;
