import React, {Component, PropTypes} from "react";
import "../assets/_twosinglecontent.less";
import i18n from './../../../lib/i18n';
import {Link,browserHistory} from 'react-router';

class TwoSingleContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 12 //限制数量为12个
        }
    }

    onMoreClick = () => {
        let num = 12;
        if (this.state.num == 12) {
            num = 999999999999999;
        }
        this.setState({num})
    }
    //点击某一个数据时，调整到下一个页面
    onLinkClick = (obj,mtlObj, e) => {
        browserHistory.push({pathname:"/user/loginlist",query:{id:obj.id,dataMulDiv2Id:mtlObj.id,inputvalue:""}});
    }

    render() {
        let that = this;
        let {num} = this.state;
        let {list} = this.props;
        return (<ul className="twosinglecontent">
            <h3>{list.localName}</h3>
            <li className="twosinglecontent-one">
                {
                    list.mtlTypes && list.mtlTypes.map((e, i) => {
                        if (i < num)
                            return (<span className="twosinglecontent-one-leftright" key={i}
                            ><span onClick={that.onLinkClick.bind(that, e,list)} className={'twosinglecontent-one-leftright-link'}>{e.localName}</span></span>)
                    })
                }
            </li>
            {
                list.mtlTypes && list.mtlTypes.length > 12 ? (num === 12 ?
                    <span className="twosinglecontent-more" onClick={this.onMoreClick}>{i18n.t(200634/*更多*/)}<i
                        className="foddingicon fooding-jiantou_icon" style={{fontSize: '12px'}}></i></span> :
                    <span className="twosinglecontent-more" onClick={this.onMoreClick}>{i18n.t(400195/*收起*/)} <i
                        className="foddingicon fooding-up_icon" style={{fontSize: '12px'}}></i></span>) : ""
            }

        </ul>)
    }
}

export default TwoSingleContent;