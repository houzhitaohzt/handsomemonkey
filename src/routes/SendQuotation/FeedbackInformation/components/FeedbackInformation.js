/*反馈信息*/
import React, {Component} from "react";
import Confirm from '../../../../components/Dialog/Confirm';
import Edit from './Edit';
import Fix from './Fix';
import Record from './Record';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet} from "../../../../services/apiCall";
import i18n from '../../../../lib/i18n';

class Annotation extends Component{
	constructor(props){
		super(props);
        props.feedback && props.feedback(this);
        this.filterData = {};
		this.state = this.initState();
		this.scrollHeight=this.scrollHeight.bind(this);
		this.deleteSingle=this.deleteSingle.bind(this);
	}

	initState(){
		return {
			paddingTop:false,
			showEditor:true,
            record: [],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch - 135 ;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize();
		// window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		// window.addEventListener('resize', this.handleResize(0));
		if(nextProps.businessOne !== this.props.businessOne){
		    this.filterData['enquiryNo'] = nextProps.businessOne.enquiryNo;
		    if(!this.props.isDetail){
                this.getPages();
			}
        }
  	}
  	scrollHeight(e){
  		if(e.target.scrollTop>=250){
  			this.setState({showEditor:false})
  		}else{
  			this.setState({showEditor:true})
  		}
  	}

  	deleteSingle(item){
  		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/),{
  			done:() => {
                apiForm(API_FOODING_ERP, '/feedback/delete', {
                    id: item.billDtlId
                }, response => {
                    successTips(response.message);
                    this.getPages();
                }, error => {
                    errorTips(error.message);
                })
  			}
  		})
  	}

    getPages =(currentPage, size, filter, order) => {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        order = order || {column: 'billDtlId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({isPagable: false, isPlatform: true}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ERP, '/feedback/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    };

	render(){
  	    let len = this.state.record.length;
		 let editor=null,
		 editorFix=null,
		 single = <Record arr={this.state.record} deleteSingle={this.deleteSingle}/>;
		 if(this.state.showEditor){
		 	editorFix=<Fix bol={this.state.showEditor} len={len}/>
		 }else{
		 	editor=<Fix bol={this.state.showEditor} len={len}/>
		 }
		return(
			<div className={'annotation'}>
				<div className="content-margin"></div>
				<div className={'annotation-content scroll'}  style={{height:this.state.scrollHeight}} onScroll={this.scrollHeight}>
					<Edit businessOne={this.props.businessOne} getPages={this.getPages}/>
					{editor}
					<div className={'annotation-content-comment'}>
						{editorFix}
						{single}
					</div>
				</div>

			</div>
		)
	}
}
export default Annotation;
