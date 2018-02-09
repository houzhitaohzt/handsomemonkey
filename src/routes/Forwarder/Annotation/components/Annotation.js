import React,{Component,PropTypes} from 'react';
import SalesOrderList from '../../../Annotation/components/Annotation';
export class Order extends Component {
    constructor (props) {
        super(props);
        props.annotation && props.annotation(this);
        this.getPages = this.getPages.bind(this);
    }
    getPages(){
        this.annotation.getPage();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList permissions="forwarder.notes" businessType={'forwarder'}
                             annotation ={no => this.annotation = no}  isDetail ={true}
                             location={this.props.location}/>
         	</div>
        )
    }
}
export default Order;