import React,{PropTypes, Component} from 'react';
import Enterprise from "../../../Client/Enterprise/components/EnterpriseCommon";
class ForwardwarEntrprise extends Component{
	constructor(props){
		super(props);
        props.enterprise && props.enterprise(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.enterprise.getPages();
    }
	render() {
		let id = this.props.location.query.id;
		return (<Enterprise pageIdent='forwarder' dataTyId={80} id={id}
							enterprise ={no => this.enterprise = no}  isDetail ={true}
		/>);
	}
}
export default ForwardwarEntrprise;