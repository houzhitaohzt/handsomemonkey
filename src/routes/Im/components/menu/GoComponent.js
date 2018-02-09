import React from "react";
import "../../assets/_go.less"
let defaultAvatar = require('../../assets/default.png');
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_OA} from '../../../../services/apiCall';
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
import i18n, {I18n} from "../../../../lib/i18n";

import WebData from '../../../../common/WebData';

class GoComponent extends React.Component {
    static propTypes = {
        onChange : React.PropTypes.func,
        selectedArr: React.PropTypes.array
    };

    static defaultProps = {
      onChange:() => {},
      selectedArr : []
    };

    constructor(props) {
        super(props);
        this.renderCompany = this.renderCompany.bind(this);
        this.renderNav = this.renderNav.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            activeKey: 0,
            activeCompany: true,
            header: [
                {title: WebData.user.data.staff.cluster.localName, key: 0, id:WebData.user.data.staff.cluster.id},
                {title: "群组", key: 1},
                // {title: "内部联系人", key:2},
                // {title: "外部联系人", key:3}
            ],
            company: [], //显示公司
            party: [], //显示部门
            staff: [], //显示职员
            nav: [],  //导航条
            //选中数据
            selectedArr: props.selectedArr
        }
    }

    /**
     * 给两条数据
     * 做数据查重的时候,, 采用 uniquedentify 做区分
     * */
    assignOrg = (party) => {
        if(!party ) return [];
        party.map( (e,i) => {e.isOrg = 1, e.uniquedentify = (e.id + i)});
        return party;
    };

    assignUsr = (staff) => {
      if(!staff) return [];
      staff.map( (e,i) => {e.isUser = 1, e.uniquedentify = (String(e.id)+ i)});
      return staff;
    };

    /**
     * 根据集团拉取公司
     * /party/getLoginCompanies
     * */
    getCompanies = () => {
      let that = this;
      apiGet(API_FOODING_ES,"/party/getLoginCompanies",{clusId: WebData.user.data.staff.clusId}, response => {
          that.setState({company: response.data || []})
      }, error => {})
    };

    /**
     * 从company 开始,去除下一级
     * */
    getNextNodeData = (parentId, cb) => {
        let that = this;
        apiGet(API_FOODING_ES,"/party/getChildrenAndUsers",{parentId}, response => {
            let {partys, users} = response.data;
            let party = that.assignOrg(partys);
            let staff = that.assignUsr(users);
            cb(party, staff);
        }, error => {cb([], [])})
    };

    /**
     * onChange 返回选中的数组
     * @return array
     * */
    onChange = array => {
        this.props.onChange && this.props.onChange(array);
    };

    /**
     * 头部
     * renderTitle
     * */
    renderTitle = (item, index) => {
        return (
            <div className={item.key == this.state.activeKey ? 'go-com-h-td active' : 'go-com-h-td'} key={index}
                 onClick={this.onHandleClick.bind(this, item)}>
                <span className={'go-com-h-com-wo'}>{item.title}</span>
            </div>
        )
    };

    onHandleClick = (item, e) => {
        e.stopPropagation && e.stopPropagation();
        this.setState({activeKey: item.key});
    };

    renderCompany = (item, index) => {
        return (<div className="go-com-b-cp" key={index} onClick={this.onCompanyClick.bind(this, item)}>
            <span className="name">{item.localName}</span>
            <i className="foddingicon fooding-arrow_more_16"></i>
        </div>)
    };

    /**
     * 点击公司的跳转
     * */
    onCompanyClick = (item, e) => {
        let that = this;
        e.stopPropagation && e.stopPropagation();
        let {nav = []} = this.state;
        nav.push({localName: item.localName, id:item.id,level:1});
        this.getNextNodeData(item.id, (party,staff) => {
            that.setState({activeCompany: false, nav, party, staff});
        });
    };

    //导航条
    renderNav = () => {
        let {nav = []} = this.state;
        let len = nav.length;
        return (
            <div className="go-com-b-nav">
                {this.state.nav.map((da, di) => {
                    return <span className={di == (len - 1) ? "nav-wrd current" : 'nav-wrd'}
                                 onClick={di == (len -1) ? (() => {}) : this.onNavclick.bind(this,da,di)}
                                 key={di}>{da.localName || da.staffLocalName} {di == (len - 1) ? "" :
                        <b>&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;</b>}</span>
                })}
            </div>
        )
    };

    //导航条的点击da
    onNavclick = (da, index, e) => {
        let that = this;
        e.stopPropagation && e.stopPropagation();
        let nav = this.state.nav.splice(0, index + 1);
        this.getNextNodeData(da.id, (party,staff) => {
            that.setState({nav, party, staff});
        });
    };

    //部分系列
    renderSection = () => {
        let {party, staff, selectedArr} = this.state;
        let allArr = party.concat(staff);
        let checkedAll = this.isCheckAll(allArr);
        return (
            <div className="go-com-b-selection">
                <div className="single">
                    <span><span className={checkedAll ? 'sss ssschecked' : "sss"}
                                onClick={this.onCompanyCheckedAllClick.bind(this, checkedAll)}></span>{I18n.t(500350/*全部*/)}</span>
                </div>
                {
                    party.map((e, i) => {
                        let checked = selectedArr.findIndex(item => item.uniquedentify == e.uniquedentify) !== -1;
                        return (<div className="single" key={e.uniquedentify + i} onClick={this.onItemClick.bind(this,e,checked)}>
                            <span><span className={checked ? 'sss ssschecked' : "sss"}
                                        onClick={this.onCompanyCheckedClick.bind(this, e, checked)}></span>{e.localName}</span>
                            <span className={'ren'}>{e.count || 0}人</span></div>)
                    })
                }
                {
                    staff.map((da, di) => {
                        let checked = selectedArr.findIndex(item => item.uniquedentify == da.uniquedentify) !== -1;
                        return (<div className={'single'} key={da.uniquedentify + di} onClick={this.onStaffCheckedClick.bind(this, da, checked)}>
                            <span className={'single-staff'}>
                                <span className={checked ? 'fff fffchecked' : "fff"}>
                                    <img className='im-avatar' src={defaultAvatar}/>
                                </span>{da.staffLocalName}</span>
                        </div>)
                    })
                }
            </div>
        )
    };

    /**
     * 点击公司,进入员工页面
     * onItemClick
     * */
    onItemClick = (item, checked, e) => {
        let that = this;
        e.stopPropagation && e.stopPropagation();
        if(checked) return false;
        let nav = Array.from(this.state.nav);
        nav.push({id:item.id,localName:item.localName,level:1});
        this.getNextNodeData(item.id, (party,staff) => {
            that.setState({nav, party, staff});
        });
    };

    /**
     * 点击公司前面checkbox框 判断是否选中
     * onCompanyCheckedClick
     * */
    onCompanyCheckedClick = (item, checked, e) => {
        e.stopPropagation && e.stopPropagation();
        e.defaultPrevented && e.defaultPrevented();
        let selectedArr = Array.from(this.state.selectedArr);
        if (checked) {
            let idx = selectedArr.findIndex(e => e.uniquedentify == item.uniquedentify);
            selectedArr.splice(idx, 1);
        } else {
            selectedArr.push(item);
            selectedArr.concat(selectedArr)
        }
        this.setState({selectedArr}, this.onChange(selectedArr))
    };

    /**
     * 点击公司上面的全选按钮 实现全选与反选
     * onCompanyCheckedAllClick
     * */
    onCompanyCheckedAllClick = (checkedAll, e) => {
        e.stopPropagation && e.stopPropagation();
        e.defaultPrevented && e.defaultPrevented();
        let { party, staff} = this.state;
        let arrArr = Array.from(party.concat(staff));
        let selectedArr = Array.from(this.state.selectedArr);
        if (checkedAll) {
            for (let i = 0; i < arrArr.length; i++) {
                for (let j = 0; j < selectedArr.length; j++) {
                    if (arrArr[i].uniquedentify == selectedArr[j].uniquedentify) {
                        let idx = selectedArr.findIndex(e => e.uniquedentify == selectedArr[j].uniquedentify);
                        selectedArr.splice(idx, 1);
                        j--;
                    }
                }
            }
        } else {
            for (let i = 0; i < arrArr.length; i++) {
                let idx = selectedArr.findIndex(e => e.uniquedentify == arrArr[i].uniquedentify);
                if (idx == -1) {
                    selectedArr.push(arrArr[i]);
                }
            }
        }
        this.setState({selectedArr}, this.onChange(selectedArr))
    };

    //员工 单个选中
    onStaffCheckedClick = (item, checked, e) => {
        e.stopPropagation && e.stopPropagation();
        e.defaultPrevented && e.defaultPrevented();
        let selectedArr = Array.from(this.state.selectedArr);
        if (checked) {
            let idx = selectedArr.findIndex(e => e.uniquedentify == item.uniquedentify);
            selectedArr.splice(idx, 1);
        } else {
            selectedArr.push(item);
            selectedArr.concat(selectedArr);
        }
        this.setState({selectedArr}, this.onChange(selectedArr))
    };


    /**
     * 判断是否前部选中 返回一个bool值
     * @param Array
     * @return bool
     * */
    isCheckAll = (list) => {
        let {selectedArr = []} = this.state;
        if (!list.length || !selectedArr.length) return false;
        let bol = true;
        for (let i = 0; i < list.length; i++) {
            if (selectedArr.findIndex(e => e.uniquedentify == list[i].uniquedentify) == -1) {
                bol = false;
                break;
            }

        }
        return bol;
    };

    renderComp = () => {
        let that = this;
        let {activeKey, activeCompany, company} = this.state;
        switch (activeKey) {
            case 0 :
                return <div className={'go-com-b'} key={activeKey}>
                    {
                        activeCompany ?
                            <div>{company.map(that.renderCompany)}</div> :
                            <div className={"go-com-b-all"}>
                                <div className="go-com-b-cp" onClick={this.backClick}>
                                    <span className="name"><i className="foddingicon fooding-arrow_left_16"></i>&nbsp;&nbsp;{I18n.t(100431/*返回*/)}</span>
                                </div>
                                {that.renderNav()}
                                {that.renderSection()}
                            </div>
                    }
                </div>;
                break;
            case 1 :
                return <div className={'go-com-b'} key={activeKey}></div>;
                break;
        }
    };

    //返回点击
    backClick = () => {
        this.setState({nav : [], activeCompany: true})
    };

    componentDidMount(){
        this.getCompanies();
    }

    componentWillReceiveProps(nextProps){
        let {selectedArr} = nextProps;
        this.setState({selectedArr})
    }

    render() {
        return (<div className={'go-com'}>
            <div className={'go-com-h'}>
                {this.state.header.map(this.renderTitle)}
            </div>
            {this.renderComp()}
        </div>)
    }
}

export default GoComponent;