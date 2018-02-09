import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import SalesOrderList from '../../../Accessory/components/Accessory';

export class Order extends Component {
    constructor (props) {
        super(props);
        props.accessory && props.accessory(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.accessory.getPages();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList pageIdent='businessOpportunity' 
             businessType={'businessOpportunity'}
             isDetail ={true}
             accessory ={no => this.accessory = no}
             location={this.props.location}/>
         	</div>
        )
    }
}


export default Order;