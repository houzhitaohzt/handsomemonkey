import i18n from './../../../lib/i18n';
/***
新闻热点tabs
*/
import React, { Component,PropTypes } from 'react';
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';
import TabsCommon from './TabsCommon'
class Press extends Component {
	render() {
	    const count = [1, 1, 1, 1,1,1,1];// new Array(4) skip forEach ....
	    const els = count.map((c, i) => {
	      return <Link className="box_space" key ={i}>
	                <label>总理点赞的赣南脐fdgdfg橙已被抢购一空</label>
	                <span>9/29</span>
	              </Link>;
	    });
	    return (<div className = 'box i-news'>
	          <div className ='news-list-box'>
	            {els}
	          </div>
	          <div className ='more'><Link>{i18n.t(200634/*更多*/)}<i className="foddingicon fooding-arrow_more_16"></i></Link></div>
	    </div>);
  	}
}
export class PressView extends Component{
	constructor(props) {
		super(props);
		this.state ={
			start:0
		}
	}
	render(){
		const start = this.state.start;
		let tabs = [{title:i18n.t(200638/*新闻*/),content:<Press id={start} />},{title:i18n.t(500283/*在线调查*/),content:<Press id={start+1} />},{title:'意见箱',content:<Press id={start+2} />},{title:'电子公告',content:<Press id={start+3} />}];
    	return (
    		<div style = {{marginTop:10}}>
    			<TabsCommon tabs = {tabs}/>
    		</div>
    	)
	}

};

export default PressView;

