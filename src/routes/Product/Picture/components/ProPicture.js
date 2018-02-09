import React, {Component, PropTypes } from "react";
import Picture from "./Picture";
class ProPicture extends Component{
    constructor(props){
        super(props);
        props.proPicture && props.proPicture(this);
        this.initList = this.initList.bind(this);
    }
    initList(){
        let that = this;
        this.proPicture.initList();
    }
    render(){
        let id = this.props.location.query.id;
        return(
            <Picture businessId={id} businessType={'material--picture'}
                     proPicture ={no => this.proPicture = no}  isDetail ={true}
            />
        )
    }
}
export default ProPicture;