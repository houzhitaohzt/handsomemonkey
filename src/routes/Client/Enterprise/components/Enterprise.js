import React, {Component} from 'react';
import Enterprise from "./EnterpriseCommon";

class ClientEntrprise extends Component{
	constructor(props){
		super(props)
        props.enterprise && props.enterprise(this);
		this.getPages = this.getPages.bind(this);
	}
    getPages(){
		this.enterprise.getPages();
	}
	render() {
		let id = this.props.location.query.id;
		return (<Enterprise pageIdent='client' dataTyId={30} id={id} enterprise={no => this.enterprise = no} />);
	}
}
export default ClientEntrprise;