import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Table  from  "../../../../components/Table";
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getData=this.getData.bind(this);
        this.state=this.initState();
    }
    getData(){
    	return this.refs.mainTable.getSelectArr();
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
				  done: () => {
				    console.log('ok, got it');
				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	showDilaog:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    onSaveAndClose(values){
        console.log(values);
        this.setState({showDilaog:false});
    }
	onCancel(){
        this.setState({showDilaog:false});
	}
    initState(){
        return {
            showDilaog:false,
            dialogTitle:'',
            data:[],
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		let that = this;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8'}}>
		               <div style={{marginTop:'10px',backgroundColor:'#fff',borderRadius:'6px'}} className='product-measurement'>
		         			<Table ref = "mainTable"
							showHeader ={false}
							columns={	[{
										title : i18n.t(100181/*款项类型*/),
										dataIndex : 'fundTy'+language,
										key : "fundTy"+language,
										width : '10%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(200841/*申请付款金额*/),
										dataIndex : "periodNum",
										key : "periodNum",
										width : "10%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(200829/*已付*/),
										dataIndex : "predictReceDate",
										key : "predictReceDate",
										width : "20%",
										render(data,row,index){
											return new Date(data).Format('yyyy-MM-dd');
										}

									}]}
							data={this.props.checkedData}
						/>
		                </div>
	               </div>
	                <Dialog visible={this.state.showDilaog} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               </div>
			);
	}

}
export default ProductDetail;
