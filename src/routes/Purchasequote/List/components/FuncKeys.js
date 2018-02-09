import React, {Component, PorpTypes} from "react"

//引入按钮键
import Confirm from '../../../../components/button/confirm'

class FunctionKeys extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let that = this;
        const {addClick, partyClick, deleteClick, cancalClick, updateClick} = this.props;
        let iconArray = [{
            type: 'add',
            onClick: addClick,
            permissions: 'purquotation.add'
        }, {
            type: 'delete',
            onClick: deleteClick,
            permissions: 'purquotation.del'
        }, {
            type: 'cancal',
            onClick: cancalClick,
            permissions: 'purquotation.tovoid'
        }, {
            permissions: 'purquotation.updateprice',
            type: 'update',
            onClick: updateClick
        },{
            permissions: 'purquotation.updateprice',
            type: 'relese',
            onClick: updateClick
        },{
            permissions: 'purquotation.updateprice',
            type: 'update',
            onClick: updateClick
        }]
        return (
            <Confirm iconArray={iconArray} that={that}/>
        )
    }
}

export default FunctionKeys

