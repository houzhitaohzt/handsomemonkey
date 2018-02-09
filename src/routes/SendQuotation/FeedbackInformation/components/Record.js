import React, {Component} from 'react';
import moment from 'moment';
import i18n from '../../../../lib/i18n';
export class Record extends Component{
	constructor(props){
		super(props);
		this.deleteSingle=this.deleteSingle.bind(this);
		this.state={
			ShowtextIndex:-1,
			activeShow:-1,
		}
	}
	deleteSingle(index){
		const {deleteSingle} = this.props;
		if(deleteSingle){
			deleteSingle(index);
		}
	}
	render(){
		let {arr} = this.props;
		return (
			<div>
				{
					arr.map((item,index)=>{
						return (
							<div className={'annotation-content-comment-single'}  key={index}>
								<div className={'annotation-content-comment-single-left'}>
									<p></p>
								</div>
								<div className={'annotation-content-comment-single-right'}>
									<div className={'right-name'} style={{color:'#0066cc'}}><span>{item.staffLcName}</span>&nbsp;&nbsp;
                                        <span>{moment(item.createDate).fromNow()}</span></div>
									<div className={'right-theme'}>
										<h5>{item.context}</h5>
										<div className={'right-key'}>
											<a href="javascript:void(0);" onClick={this.deleteSingle.bind(this, item)}>{i18n.t(100437/*删除*/)}</a>

										</div>
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
		)
	};
}
export default Record;
