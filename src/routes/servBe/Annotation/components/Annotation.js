import React,{Component,PropTypes} from 'react';
import SalesOrderList from '../../../Annotation/components/Annotation';
export class Order extends Component {
    constructor (props) {
        super(props);
        props.annotation && props.annotation(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.annotation.getPage();
    }
    render() {
        return (
        	<div style={{marginTop:10}}>
         	 <SalesOrderList permissions="servbe.notes" businessType={'servbe'}
                             annotation ={no => this.annotation = no} isDetail ={true}
                             location={this.props.location}/>
         	</div>
        )
    }
}
export default Order;