import React,{Component,PropTypes} from 'react';
import SalesOrderList from '../../../Annotation/components/Annotation';
export class Order extends Component {
    constructor (props) {
        super(props);
        props.annotation && props.annotation(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        let that = this;
        this.annotation.getPage();
    }
    render() {
        return (
        	<div>
         	 <SalesOrderList permissions="servbecontact.notes" businessType={'servcon'}
                             isDetail ={true}
                             annotation ={no => this.annotation = no}
                             location={this.props.location}/>
         	</div>
        )
    }
}
export default Order;
