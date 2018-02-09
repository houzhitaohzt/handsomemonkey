import React,{Component,PorpTypes} from "react"
//引入按钮键
import  Confirm from  '../../../../../components/button/confirm'
class FunctionKeys extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let that = this;
      const {updateClick}=this.props;
    let  iconArray = [{type:'sendprice',onClick:updateClick}]
    return (
      <div className="action-buttons">
        <div className="key-page">
        <Confirm iconArray ={iconArray} that={that}/>
        </div>
      </div>
    )
  }
}

export default FunctionKeys