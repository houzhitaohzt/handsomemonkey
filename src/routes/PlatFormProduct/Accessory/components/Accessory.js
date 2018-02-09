import React,{Component,PropTypes} from 'react';
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
        	<div>
         	 <SalesOrderList pageIdent='platformProduct' businessType={'platformProduct'}
                             isDetail ={true}
                             accessory ={no => this.accessory = no}
                             location={this.props.location}/>
         	</div>
        )
    }
}


export default Order;
