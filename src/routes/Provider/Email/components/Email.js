import React,{Component,PropTypes} from 'react';
import EmailList from '../../../Email/List/components/EmailList';
export class Order extends Component {
    constructor (props) {
        super(props);
        props.email && props.email(this);
        this.state ={
        	id:this.props.location.query.id
        }
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
             value ={this.props.value}
             height = {120}
             router={this.props.router}
             email ={no => this.email = no} isDetail ={true}
             />
         	</div>
        )
    }
}


export default Order;
