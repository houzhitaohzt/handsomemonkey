import i18n from './../../../lib/i18n';
/*注释*/
import React,{Component,PorpTypes} from "react";
const {Table} = require("../../../components/Table");
import Page from "../../../components/Page";
export class History extends Component{
			constructor(props){
				super(props);
				this.columns = [{
						dataIndex : "sign",
						key : "type",
						width : "10%",
						className:'text-center',
						render(data,row,index){
							return (<div>{data}</div>)
						}
					},{
						dataIndex : "time",
						key : "time",
						width : "90%",
						render(data,row,index){
							return <div className={data.isShowdelete ?'content delete-line':'content'}>
								{data.time} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								{data.people}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								{data.name}
							</div>;
						}
					}];
				this.state = {
					rodalShow:false ,
					title:'',
					paddingTop:false,
					contentTemplate:<div></div>,
					data : [
						{id : "583290f945cedf0decaf64bf",sign :"200+",time:{people:"修改人 it012",name:"Shanghai Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"200-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"199+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"199-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"198+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"198-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"197+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"197-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"196+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"196-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"195+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"195-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"199+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"199-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"198+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"198-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"197+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"197-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"196+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"196-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"195+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"195-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}},
						{id : "583290f945cedf0decaf64bf",sign :"194+",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:false}},
						{id : "583290f945cedf0decaf64bf",sign :"194-",time:{people:"修改人 it012",name:"FOOD Hong Hao Chemical Co Ltd",time:"2017-1-18  12:33",isShowdelete:true}}
					]
				}
				this.handleResize = this.handleResize.bind(this);
			}
			handleResize(height){
				this.setState({
		  			paddingTop:!this.state.paddingTop
		  		});
		  		let padding = this.state.paddingTop ? 173:262;
				let sch=document.body.offsetHeight-height-padding;
				let scroll = sch - 135;
				this.setState({scrollHeight:sch+'px',scroll:scroll});
			}
			componentDidMount(){
		        this.handleResize(0);
				window.addEventListener('resize', this.handleResize(0));
		    };
			componentWillUnmount() {
		    	window.removeEventListener('resize', this.handleResize(0));
		  	}
			componentWillReceiveProps(nextProps){
		  		this.handleResize(0);
				window.addEventListener('resize', this.handleResize(0));
		  	}
			render(){
				return (
					<div className="contact-fluid">
						<div className='content-margin'></div>
						<div className="contact-body" style = {{height:this.state.scrollHeight}}>
						<span className="title">{i18n.t(200633/*客户历史记录*/)}</span>
							<Page />
							<div className="action-buttons">
								<Table
										columns={this.columns}
										data={this.state.data}
										scroll={{x:true,y:this.state.scroll}}
										checkboxConfig={{show:false}}
										colorFilterConfig={{show : false}}
										followConfig={{show:false}}
										style={{width:'100%'}}
								/>
							</div>
						</div>
					</div>
				)
			}
}
export default History;
