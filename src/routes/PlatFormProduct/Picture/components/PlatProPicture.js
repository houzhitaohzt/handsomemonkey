import React, {Component, PropTypes } from "react";
import Picture from "../../../Product/Picture/components/Picture";
class PlatProPicture extends Component{
    constructor(props){
        super(props);
        props.picture && props.picture(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        let that = this;
        this.proPicture.initList();
    }
    render(){
        let id = this.props.location.query.id;
        return(
            <Picture businessId={id} businessType={'platformMaterial--picture'}  proPicture ={no => this.proPicture = no} isDetail ={true} />
        )
    }
}
export default PlatProPicture;