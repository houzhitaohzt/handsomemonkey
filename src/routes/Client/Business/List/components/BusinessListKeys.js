import React, {Component, PorpTypes} from "react";
//引入按钮键
import Confirm from "../../../../../components/button/confirm";
//引入分页
import Page from "../../../../../components/Page";

class FunctionKeys extends Component{
	constructor(props){
		super(props)
	}
	
	render(){
		let that = this;
		const {addClick,deleteClick, page, getPages}=this.props;
		let  iconArray = [{type:'add',onClick:addClick},{type:'delete',onClick:deleteClick}]
		return (
			<div className="action-buttons">
				<div className="key-page">
					<Confirm iconArray ={iconArray} that={that}/>

                    <Page totalPages={page.totalPages}
                          currentPage={page.currentPage}
                          totalRecords={page.totalRecords}
                          sizeList={[20, 50, 200]}
                          currentSize={page.size}
                          pageSizeChange={(value) => {
                              if (page.size == value) {
                                  return;
                              }
                              getPages(page.currentPage, value);
                          }} backClick={(v) => {
                        if (page.currentPage == v) {
                            return;
                        }
                        getPages(v);
                    }} nextClick={(v) => {
                        if (page.currentPage == v) {
                            return;
                        }
                        getPages(v);
                    }}
                          goChange={(v) => {
                              if (page.currentPage == v) {
                                  return;
                              }
                              getPages(v);
                          }}
                    />
				</div>
			</div>
		)
	}
}

export default FunctionKeys
