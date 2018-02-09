import React,{Component,PorpTypes} from "react"

//引入按钮键
import  Confirm from  '../../../../components/button/confirm'

class FunctionKeys extends Component{
    constructor(props){
        super(props)
    }

    render(){
        let that = this;
        const {addClick,partyClick,deleteClick,cancalClick,updateClick,onClickLink}=this.props;
        // let  iconArray = [{type:'add',onClick:addClick},{type:'delete',onClick:deleteClick},{type:'cancal',onClick:cancalClick},{type:'update',onClick:updateClick}];
        let  iconArray = [];

        return (
            <Confirm iconArray ={iconArray} that={that}/>
        )
    }
}

export default FunctionKeys

