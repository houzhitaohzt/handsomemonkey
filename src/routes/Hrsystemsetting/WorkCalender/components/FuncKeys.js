import React, {Component, PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let that = this;
        const {addClick, deleteClick} = this.props;
        //let iconArray = [{type: 'add', onClick: addClick,permissions:'userauthority.add'}, {type: 'delete', onClick: deleteClick,permissions:'userauthority.del'}];
        let iconArray = [{type: 'add', onClick: addClick, permissions:'workcalender.add'}, {type: 'delete', onClick: deleteClick, permissions:"workcalender.del"}];
        return (
            <Confirm iconArray={iconArray} that={that}/>
        )
    }
}

export default FunctionKeys;

