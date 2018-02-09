import React,{PropTypes, Component} from 'react';
import SalesOrderList from '../../../Booking/List/components/Booking';
export class Shiporder extends Component {
    constructor (props) {
        super(props);
        props.shiporder && props.shiporder(this);
        this.state={
        	forwarderBeId:this.props.location.query.id
        };
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.shiporder.getPage();
    }
    render() {
        return (
            <div style={{marginTop:'10px'}}>
            	<SalesOrderList router={this.props.router} isShowHead={true} forwarderBeId={this.state.forwarderBeId}
                                shiporder ={no => this.shiporder = no}  isDetail ={true}
                />
			</div>
        )
    }
}


export default Shiporder;
