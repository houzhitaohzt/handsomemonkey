import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import OnlineOrderBuyerDetailsHead from '../../routes/CorporationApplyLimit/Detail/Head/CorHead';
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框
export class OOBuyerLayout extends Component{
    constructor(props) {
        super(props);
        this.state={
            billId: null,
            paddingTop:120,
            businessOne: {},
            productData: [],
            cardData: [],
            shipData: [],
            testData: [],
        };
        this.handleResize=this.handleResize.bind(this);
    }
    handleResize(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
        this.setState({scrollHeight:sch+'px'});
    };
    componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
        this.setState({scrollHeight:sch+'px'});
        window.addEventListener('resize', this.handleResize);
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    };
    componentWillReceiveProps(nextProps) {

    }
    render(){
        let children=Object.assign({},this.props.children,{});
        children.props =Object.assign({},children.props, this.state, {refreshDetail: this.refreshDetail});
        return (

            <div className='container-body'>
                <OnlineOrderBuyerDetailsHead  onPackUp={this.onPackUp}  {...this.state} refreshDetail={this.refreshDetail}/>
                <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}
OOBuyerLayout.propTypes = {
    children : React.PropTypes.element.isRequired
}

export default OOBuyerLayout

