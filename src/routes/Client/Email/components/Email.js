import React, {Component} from 'react';
import EmailList from '../../../Email/List/components/EmailList';

export class Order extends Component {
    constructor (props) {
        super(props);
        this.state ={
        	id:this.props.location.query.id
        };
        props.email && props.email(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        let that = this;
        if( !this.props.value.emailList ) return;        
        if(this.props.value && this.props.value.emailList.length>0){
            this.email.getPage(this.props.value);
        }else if(this.props.value&&this.props.value.billId){
            this.email.getPage(this.props.value);
        }
    }
    render() {
        return (
        	<div>
         	 <EmailList id = {this.props.id}
             value ={this.props.value} isDetail ={true}
             height = {120} email ={no => this.email = no}
             router={this.props.router}/>
         	</div>
        )
    }
}


export default Order;
