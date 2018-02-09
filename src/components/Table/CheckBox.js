import React ,{Component,PropTypes} from 'react'

export class CheckboxColumn extends Component{
	constructor(props){
		super(props);
		this.state={
			classname:'glyphicon glyphicon-ok-circle'
		}
	}
	onCheckClick=(sender)=>{
		this.props.allSelect();
	}
	render(){
		return({
			title:(
				<div>
					<span className={this.state.classname}> </span>
				</div>
			),
			dataIndex:'checked',
			key:'checked'
		})
	}

}
CheckboxColumn.PropTypes={
	//allSelect:PropTypes.func.isRequired
}
export class TDCheckbox extends Component{
	render(){
		return (
			<td>

			</td>
		);
	}
}
