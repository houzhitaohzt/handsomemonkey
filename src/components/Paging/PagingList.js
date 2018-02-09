/**
 * 分页列表组件
 * @flow
 * @author tangzehua
 * @sine 2018-01-22 11:57
 */
import React from 'react';
import {observer} from 'mobx-react';
import i18n from '../../lib/i18n';
import Table from '../Table';
import Page from '../Page';
import ButtonGroup from  '../button/confirm'

@observer
export default class PagingList extends React.Component {

    componentDidMount() {
        let paging = this.props.paging;
        paging.handleResize();
        window.addEventListener("resize", paging.handleResize);
        paging.fetchPages();
    }

    componentWillUnmount() {
        let paging = this.props.paging;
        window.removeEventListener("resize", paging.handleResize);
    }

    /**
     * 渲染表格数据
     * @returns {*}
     */
    renderTable = () =>{
        let paging = this.props.paging;
        let {
            checkboxConfig, colorConfig, followConfig, rowDoubleClick,
            sortPages, getTableCols, pageData, scrollHeight,
            contextMenuConfig, singleSelect,
        } = paging;

        return (
            <Table ref={tb => paging.tableDom = tb}
                   columns={getTableCols}
                   data={pageData}
                   checkboxConfig={checkboxConfig}
                   colorFilterConfig={colorConfig}
                   followConfig={followConfig}
                   scroll={{x: true, y: scrollHeight - 90}}
                   onRowDoubleClick={rowDoubleClick}
                   onHeaderSortClick={sortPages}
                   singleSelect={singleSelect}
                   contextMenuConfig={contextMenuConfig}
            />
        )
    };

    /**
     * 渲染分页工具条
     * @returns {*}
     */
    renderPageBar = ()=> {
        let paging = this.props.paging;
        let {page, fetchPages} = paging;
        return (
            <Page totalPages={page.totalPages}
                  currentPage={page.currentPage}
                  totalRecords={page.totalRecords}
                  currentSize={page.pageSize}
                  pageSizeChange={value => page.pageSize !== value && fetchPages(1, value)}
                  backClick={value => page.currentPage !== value && fetchPages(value)}
                  nextClick={value => page.currentPage !== value && fetchPages(value)}
                  goChange={value => page.currentPage !== value && fetchPages(value)}
            />
        )
    };

    render() {
        let that = this;
        let paging = that.props.paging;
        let { scrollHeight, barGroupConfig } = paging;

        return (
            <div>
                <div className='content-margin'/>
                <div className="contact-body" style={{height: scrollHeight + "px"}}>
                    <div className="client-body-single">
                        <div className="action-buttons">
                            <div className="key-page">
                                <ButtonGroup iconArray = {barGroupConfig}/>
                                {that.renderPageBar()}
                            </div>
                        </div>
                        {that.renderTable()}
                    </div>
                </div>
                {that.props.children}
            </div>
        );
    }
}
