import React,{Component,PropTypes} from 'react';
import SalesOrderList from '../../../Accessory/components/Accessory';
export class Order extends Component {
    constructor (props) {
        super(props);
        props.accessory && props.accessory(this);
        this.getPages = this.getPages.bind(this);
    }
    getPages(){
        let that = this;
        this.accessory.getPages();
    }
    render() {
        return (
        	<div>
         	 <SalesOrderList pageIdent='product' businessType={'product'} location={this.props.location}
                             accessory ={no => this.accessory = no} isDetail ={true}
             />
         	</div>
        )
    }
}


export default Order;
