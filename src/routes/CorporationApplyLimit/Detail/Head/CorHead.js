import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import FormerNameDailog from "../../../Client/Detail/FormerName/FormerNameDialog";

function getActiveTab(pathname,navTabs){
    let currents,activeTab=0;
    currents= navTabs.filter((item,index)=>(item.url==pathname));
    if(currents&&currents.length>0){
        activeTab=currents[0].id;
    }
    return activeTab;
}
export  class  PDetailsHead extends Component{
    constructor(props) {
        super(props);
        this.array =[];
        let navTabs=[
            {name:i18n.t(100097/*详情*/),url:'/corporationapplylimit/detail',id:0},
            {name:i18n.t(100136/*附件*/),url:'/corporationapplylimit/accessory',id:1},

        ];
        let activeTabId= getActiveTab(props.location.pathname,navTabs)
        this.state = { visible: false ,isUp:false,activeTab:activeTabId,
            isShow:false,
            navContent:navTabs
        };
        this.onClickLink=this.onClickLink.bind(this);
    }

    onClickLink(e,v){
        // this.setState({
        // 	activeTab:v.id
        // });
        let tab={id:this.props.navigate.currentTab,url:v.url};
        this.props.updateTab(tab);
        browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,dataTyId:v.dataTyId}});
    }

    componentWillReceiveProps(nextProps){
        // console.log(nextProps);
    }
    componentDidMount(){
        let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
        this.setState({activeTab:activeId});
    }
    render(){
        //从ProviderLayout 传过来的数据
        let {value = {} } = this.props;
        let array_name=this.state.navContent;
        return  (<div className = 'cdetails' style={{height:'37px'}}>
            <ul className="box2">
                {
                    array_name.map((item,i)=>{
                        return (<li key={i}><a onClick ={()=>this.onClickLink(i,item)} className={this.state.activeTab== item.id ?'heghtL':''}>{item.name} </a></li>);
                    })
                }
            </ul>
        </div>);
    }
}
export default LocationConnect(withRouter(PDetailsHead));

