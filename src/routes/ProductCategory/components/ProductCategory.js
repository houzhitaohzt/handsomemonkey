import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Tree from "../../../components/Tree/index";
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../components/Dialog/Dialog';

import TabSwitch from "../../../components/TabSwitch";
import ProductListOne from "./ProductListOne";

import RightFuncKeys from "./RightFuncKeys";
import ProductCategoryView from "./ProductCategoryView";
//引入ajax
import {
    permissionsBtn,
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    pageSize,
    sizeList
} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import Page from "../../../components/Page";//分页
const {Table} = require("../../../components/Table");//Table表格

import {Input} from 'antd';


//引入按钮键
import ConfirmIcon from '../../../components/button/confirm';

function setLeaf(treeData, curKey, level) {
    const loopLeaf = (data, lev) => {
        const l = lev - 1;
        data.forEach((item) => {
            if ((item.id.length > curKey.length) ? item.id.indexOf(curKey) !== 0 :
                    curKey.indexOf(item.id) !== 0) {
                return;
            }
            if (item.children) {
                loopLeaf(item.children, l);
            } else if (l < 1) {
                item.isLeaf = true;
            }
        });
    };
    loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
    const loop = (data) => {
        // if (level < 1 || curKey.length - 3 > level * 2) return;
        data.forEach((item) => {
            if (curKey.indexOf(item.id) === 0) {
                item.children = child;
            } else if (item.children) {
                loop(item.children);
            }
        });
    };
    loop(treeData);
    setLeaf(treeData, curKey, level);
}

class ProductCategory extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.handClick = this.handClick.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        //初始化树
        this.getTree = this.getTree.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        //产品列表初始化数据
        //this.productListGetPages=this.productListGetPages.bind(this);
        //成品分类初始化数据
        //this.finishedCategoryGetPages=this.finishedCategoryGetPages.bind(this);
        this.state = {
            searchData: {}, // 搜索数据
            currentPage: 1, // 当前页
            totalPages: 1, // 总页数
            pageSize: pageSize, // 每页 多少条

            gData: [],
            scroll: 0,
            scrollHeight: 0,
            rightFuncShow: false,//控制右键是否出来
            x: 0,
            y: 0,
            showDilaog: false,//控制弹出层是否出来
            content: '',
            dialogContent: '<div></div>',
            visible: false,
            tempArray: [],
            tableDate: [],
            moduleIdArray: [],

            menuId: null,//右键选中时的id
            treeInfo: {},
            iconArray: [{
                permissions: 'MtlGp.add',
                action: i18n.t(200558/*新增节点*/),
                classn: 'foddingicon fooding-add-icon3',
                title: i18n.t(200558/*新增节点*/)
            },
                {
                    permissions: 'MtlGp.del',
                    action: i18n.t(200559/*删除节点*/),
                    classn: 'foddingicon fooding-delete-icon3',
                    title: i18n.t(200559/*删除节点*/)
                },
                {
                    permissions: 'MtlGp.Invalid',
                    action: i18n.t(500297/*失效节点*/),
                    classn: 'foddingicon fooding-sx-icon2',
                    title: i18n.t(500297/*失效节点*/)
                },
                {
                    permissions: 'MtlGp.activation',
                    action: i18n.t(500298/*激活节点*/),
                    classn: 'foddingicon fooding-jh-icon2',
                    title: i18n.t(500298/*激活节点*/)
                }],
            productList_columns: [{
                title: i18n.t(100000/*代码*/),
                dataIndex: 'code',
                key: "code",
                width: '20%',
                render(data, row, index) {
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }, {
                title: i18n.t(100001/*名称*/),
                dataIndex: "localName",
                key: "localName",
                width: "25%",
                render(data, row, index) {
                    return data;
                }
            }, {
                title: i18n.t(200557/*规格*/),
                dataIndex: "specTxt",
                key: "specTxt",
                width: "40%",
                render(data, row, index) {
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }],
            Finish_columns: [{
                title: i18n.t(100000/*代码*/),
                dataIndex: 'code',
                key: "code",
                width: '25%',
                render(data, row, index) {
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }, {
                title: i18n.t(100001/*名称*/),
                dataIndex: "name",
                key: "name",
                width: "20%",
                render(data, row, index) {
                    return data;
                }
            }, {
                title: i18n.t(100002/*描述*/),
                dataIndex: "description",
                key: "description",
                width: "50%",
                render(data, row, index) {
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }],
            productList_data: [],
            Finish_data: []
        }
        this.upload = this.upload.bind(this);
    }

    upload() {
        this.getTree();
        this.getTreeOneData();
    }

    //新增编辑保存
    onSaveAndClose(value, data) {
        /*
            新增和编辑都必须要id
            //当新增时，this.state.menuId 为当前的parentId 当为编辑时，this.state.menuId为自身的id,还要获取parentId
        */
        if (JSON.stringify(data) !== "{}") {//表示是编辑
            value = Object.assign({}, {
                id: data.id,
                parentId: data.parentId,
                optlock: data.optlock,
                nameValues: data.nameValues,
                name: data.name
            }, value)
        } else {
            value = Object.assign({}, value, {parentId: this.state.menuId});
        }
        apiPost(API_FOODING_DS, '/dataMulDiv2/save', value, (response) => {
            if (JSON.stringify(data) !== "{}") {//表示是编辑
                this.getTreeOneData();
                this.onLoadData(this.state.treeInfo, data.parentId);
            } else {
                this.getTreeOneData();
                this.onLoadData(this.state.treeInfo);
            }
            ServiceTips({text: response.message, type: 'success'});
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
        this.setState({
            showDilaog: !this.state.showDilaog
        })
    }

    onCancel() {
        this.setState({
            showDilaog: false
        })
    }

    handClick(type, e) {
        let that = this;
        if (type == i18n.t(200558/*新增节点*/)) {
            let content = require('./ProductCategoryAddandEditDialog').default;
            let element = React.createElement(content,
                {
                    onSaveAndClose: this.onSaveAndClose,
                    onCancel: this.onCancel,
                    onSaveAdd: this.onSaveAdd,
                    moduleIdArray: this.state.moduleIdArray
                })
            this.setState({
                showDilaog: true,
                title: i18n.t(100392/*新增*/),
                dialogContent: element
            })
        } else if (type == i18n.t(200559/*删除节点*/)) {
            Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_DS, '/dataMulDiv2/delete', {id: this.state.menuId,}, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        if (that.state.treeInfo.props.eventKey === that.state.menuId) {
                            that.setState({visible: false})
                        }
                        // that.getTree();
                        that.getTreeOneData();
                        that.onLoadData(that.state.treeInfo, that.state.treeInfo.props.parent.id);
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                },
                close: () => {
                    console.log('no, close')
                }
            });
        } else if (type == i18n.t(500297/*失效节点*/)) {
            Confirm(i18n.t(100435/*是否对该条数据失效？*/), {
                done: () => {
                    apiForm(API_FOODING_DS, '/dataMulDiv2/disable', {
                        id: this.state.menuId,
                        optlock: that.state.treeInfo.props.label.optlock
                    }, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        that.getTreeOneData();
                        that.onLoadData(that.state.treeInfo, that.state.treeInfo.props.parent.id);
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                },
                close: () => {
                    console.log('no, close')
                }
            });
        } else if (type == i18n.t(500298/*激活节点*/)) {
            Confirm(i18n.t(100436/*是否对该条数据激活？*/), {
                done: () => {
                    apiForm(API_FOODING_DS, '/dataMulDiv2/enable', {
                        id: this.state.menuId,
                        optlock: that.state.treeInfo.props.label.optlock
                    }, (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        that.getTreeOneData();
                        that.onLoadData(that.state.treeInfo, that.state.treeInfo.props.parent.id);
                    }, (error) => {
                        ServiceTips({text: error.message, type: 'error'});
                    })
                },
                close: () => {
                    console.log('no, close')
                }
            });
        }

    }

    onRightClick(info) {//节点右键事件
        let rightFunc = true;
        let xP, yP;
        xP = info.event.clientX;
        yP = info.event.clientY;
        if (info.node.props.treeIndex == 1) {
            this.setState({
                rightFuncShow: rightFunc,
                x: xP,
                y: yP,
                menuId: info.node.props.eventKey,
                treeInfo: info.node,
                iconArray: [{
                    permissions: 'MtlGp.add',
                    action: i18n.t(200558/*新增节点*/),
                    classn: 'foddingicon fooding-add-icon3',
                    title: i18n.t(200558/*新增节点*/)
                }],
                visible: false
            }, () => {
                document.getElementById('rightfunckeyproductcategory').focus();
            })
        } else {
            if (info.node.props.label.rowSts == 10) {
                this.setState({
                    rightFuncShow: rightFunc,
                    x: xP,
                    y: yP,
                    menuId: info.node.props.eventKey,
                    treeInfo: info.node,
                    iconArray: [{
                        permissions: 'MtlGp.add',
                        action: i18n.t(200558/*新增节点*/),
                        classn: 'foddingicon fooding-add-icon3',
                        title: i18n.t(200558/*新增节点*/)
                    },
                        {
                            permissions: 'MtlGp.del',
                            action: i18n.t(200559/*删除节点*/),
                            classn: 'foddingicon fooding-delete-icon3',
                            title: i18n.t(200559/*删除节点*/)
                        },
                        {
                            permissions: 'MtlGp.Invalid',
                            action: i18n.t(500297/*失效节点*/),
                            classn: 'foddingicon fooding-sx-icon2',
                            title: i18n.t(500297/*失效节点*/)
                        }],
                    visible: true
                }, () => {
                    this.getTreeOneData();
                    document.getElementById('rightfunckeyproductcategory').focus();
                })
            } else {
                this.setState({
                    rightFuncShow: rightFunc,
                    x: xP,
                    y: yP,
                    menuId: info.node.props.eventKey,
                    treeInfo: info.node,
                    iconArray: [{
                        permissions: 'MtlGp.add',
                        action: i18n.t(200558/*新增节点*/),
                        classn: 'foddingicon fooding-add-icon3',
                        title: i18n.t(200558/*新增节点*/)
                    },
                        {
                            permissions: 'MtlGp.del',
                            action: i18n.t(200559/*删除节点*/),
                            classn: 'foddingicon fooding-delete-icon3',
                            title: i18n.t(200559/*删除节点*/)
                        },
                        {
                            permissions: 'MtlGp.activation',
                            action: i18n.t(500298/*激活节点*/),
                            classn: 'foddingicon fooding-jh-icon2',
                            title: i18n.t(500298/*激活节点*/)
                        }],
                    visible: true
                }, () => {
                    this.getTreeOneData();
                    document.getElementById('rightfunckeyproductcategory').focus();
                })
            }

        }
    }

    onBlur() {//节点右键失焦事件
        let rightFunc = false;
        this.setState({
            rightFuncShow: rightFunc,
        })
    }

    onSelect(key, obj) {
        let isFirstTree = true;
        if (obj.node.props.treeIndex == 1) {
            isFirstTree = false;
        }
        this.setState({
            visible: isFirstTree,
            menuId: key[0]
        }, () => this.getTreeOneData());
    }

    //对某一条数据进行修改后进行的刷新
    getTreeOneData() {
        let that = this;
        let id = this.state.menuId;
        if (!id) return false;
        apiGet(API_FOODING_DS, '/dataMulDiv2/getOne', {id: id}, (response) => {
            if (response.data) {
                let array = [
                    {key: i18n.t(100000/*代码*/), value: response.data.code, id: response.data.id},
                    {key: i18n.t(100001/*名称*/), value: response.data.localName, id: response.data.id},
                    {key: i18n.t(100230/*状态*/), value: response.data.irowSts.name, id: response.data.id},
                    {key: i18n.t(100002/*描述*/), value: response.data.description, id: response.data.id}

                ]
                that.setState({
                    tempArray: array,
                    // productList_data:response.data.mtlTypes || []
                });

                that.getPage(); // get table data

                //that.finishedCategoryGetPages(null,null,{dataMulDiv1s:this.state.menuId});
                //that.productListGetPages(null,null,{dataMulDiv2s:this.state.menuId});
            }
        }, (message) => {
            console.log(message);
        });
    }

    // get table data
    getPage = (o = {}) => {
        let that = this;
        let {menuId, searchData, pageSize, currentPage} = this.state;

        this.setState({searchData: o['name'] != undefined ? o['name'] : searchData}, function () {
            apiGet(API_FOODING_DS, '/mtlType/getPage', Object.assign({
                id: menuId,
                name: that.state.searchData,
                pageSize: pageSize,
                currentPage: currentPage
            }), (response) => {
                that.setState({
                    productList_data: response.data.data || [],
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage
                });
            }, (message) => console.log(message));
        })

    }

    handleMenuClick = (e, data, dialogContent) => {
        var that = this;
        this.setState({
            showDilaog: true,
            title: i18n.t(100439/*编辑*/),
            dialogContent: dialogContent
        });
    }

    //初始化树节点
    getTree() {
        var that = this;
        apiGet(API_FOODING_DS, '/dataMulDiv2/getTree', null, (response) => {
            that.setState({
                gData: response.data,
            });
        }, (message) => {
            console.log(message);
        });
    }

    //点击重新刷新节点
    onLoadData(treeNode, Pid) {
        let parentId = Pid || treeNode.props.eventKey;
        return new Promise((resolve) => {
            apiGet(API_FOODING_DS, '/dataMulDiv2/getTree', {id: parentId}, (response) => {
                const gData = [...this.state.gData];
                getNewTreeData(gData, parentId, response.data, 10);
                this.setState({gData});
                resolve();
            }, (error) => {

            })
        });
    }

    //成品分类的初始化数据
    /* finishedCategoryGetPages(currentPage,size,filter,order){
         filter=filter||{};
         order=order||{column:'id',order:'desc'};
         currentPage = currentPage||1;
         size=size||this.state.pageSize;
         let params=Object.assign({},{currentPage:currentPage,pageSize:size},filter,order,this.filterData)
         apiGet(API_FOODING_DS,'/material/getPage',params,(response)=>{
             this.setState({
                 Finish_data:response.data.data,
                 pageSize:response.data.pageSize,
                 totalPagesFin:response.data.totalPages,
                 currentPageFin:response.data.currentPage
             })
         },(message)=>{
             ServiceTips({text: message,type:'error'});
         });
     }*/
    //产品分组的初始化数据
    // productListGetPages(currentPage,size,filter,order){
    // 	filter=filter||{};
    // 	order=order||{column:'id',order:'desc'};
    // 	currentPage = currentPage||1;
    // 	size=size||this.state.pageSize;
    // 	let params=Object.assign({},{currentPage:currentPage,pageSize:size},filter,order,this.filterData)
    // 	apiGet(API_FOODING_DS,'/material/getPage',params,(response)=>{
    // 		this.setState({
    // 			productList_data:response.data.data,
    // 			pageSize:response.data.pageSize,
    // 			totalPages:response.data.totalPages,
    // 			currentPage:response.data.currentPage
    // 		})
    // 	},(message)=>{
    // 		ServiceTips({text: message,type:'error'});
    // 	});
    // }
    //点击加号时显示
    addClick = () => {
        let content = require('./RelationDialog').default;
        let element = React.createElement(content, {
            onSaveAndClose: this.onAddCancel,
            onCancel: this.onAddCancel,
            mtlGroupId: this.state.menuId
        })
        this.setState({
            showDilaog: true,
            title: i18n.t(100392/*新增*/),
            dialogContent: element
        })
    }
    //点击删除
    deleteClick = () => {
        let that = this;
        let numArr = this.refs.productcategory.getSelectArr(), tempString = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
        ;
        if (!numArr.length) {
            ServiceTips({text: i18n.t(100394/*请选择数据！*/), type: "error"});
            return false;
        } else if (numArr.length > 1) {
            tempString = i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
        }
        Confirm(tempString, {
            done: () => {
                let mtlNameIds = numArr.map(e => e.id);
                let mtlGroupId = that.state.menuId;
                apiForm(API_FOODING_DS, "/dataMulDiv2/deleteMtlName", {
                    mtlNameIds: mtlNameIds,
                    mtlGroupId: mtlGroupId
                }, response => {
                    ServiceTips({text: response.message, type: "success"});
                    that.getPage();
                }, error => ServiceTips({text: error.message, type: 'error'}))
            }
        })

    }
    onAddCancel = () => {
        this.setState({showDilaog: false}, () => this.getTreeOneData())
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 100 - height;
        let scroll = sch - 20;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentDidMount() {
        this.getTree();
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    render() {
        let that = this;
        let {iconArray} = this.state;
        let rightDom;
        if (this.state.rightFuncShow) {
            rightDom = (<RightFuncKeys
                iconArray={iconArray.filter(o => o['permissions'] ? permissionsBtn(o['permissions']) : 1)}
                x={this.state.x} y={this.state.y} onBlur={this.onBlur} handClick={this.handClick}/>);
        } else {
            rightDom = (<span></span>);
        }
        return (<div className={'menuset-content'}>
            <div className={'menuset-content-all'} style={{height: this.state.scrollHeight}}>
                <div className={'menuset-content-all-tree scroll'} style={{height: this.state.scroll}}>
                    <Tree
                        onRightClick={this.onRightClick}
                        onSelect={this.onSelect}
                        gData={this.state.gData}
                        onLoadData={this.onLoadData}
                    >
                    </Tree>
                    {rightDom}
                </div>
                <div className={this.state.visible ? 'menuset-content-all-show scroll' : 'none'}
                     style={{height: this.state.scroll}}>
                    <ProductCategoryView
                        DialogTempalte={require('./ProductCategoryAddandEditDialog').default}
                        tempArray={this.state.tempArray}
                        isShowMenu={true}
                        openDialog={this.handleMenuClick}
                        onSaveAndClose={this.onSaveAndClose}
                        onSaveAdd={this.onSaveAdd}
                        onCancel={this.onCancel}
                        id={'productcategory-view-00'} title={i18n.t(200560/*查看*/)}
                        AjaxInit={true}
                        portname={'/dataMulDiv2/getInit'}
                        params={{id: this.state.menuId}}
                        upload={this.upload}
                        API_FOODING={API_FOODING_DS}
                        otherData={{id: this.state.menuId}}
                    />
                    <div
                        style={{border: '1px solid #eeeeee', borderRadius: '6px', marginTop: '10px', padding: '3px 0'}}>
                        <div style={{
                            borderBottom: "1px solid #eeeeee",
                            lineHeight: '40px',
                            textIndent: "1em"
                        }}>{i18n.t(500295/*产品名称列表*/)}</div>
                        <div className={'client-body-single'}>
                            <div className='action-buttons' style={{position: 'relative'}}>
                                <div className={'key-page'} style={{padding: 0, margin: 0}}>
                                    <ConfirmIcon iconArray={[{type: 'add', onClick: this.addClick}, {
                                        type: 'delete',
                                        onClick: this.deleteClick
                                    }]}/>
                                </div>
                                <div style={{position: 'absolute', top: '7px', left: '130px'}}>
                                    <Input.Search
                                        placeholder={i18n.t(200574/*请输入名称*/)}
                                        style={{width: 200}}
                                        onSearch={value => that.getPage({name: value})}
                                    />
                                </div>
                                <div style={{position: 'absolute', right: 0, top: -2}}>
                                    <Page
                                        currentPage={this.state.currentPage}
                                        totalPages={this.state.totalPages}
                                        sizeList={sizeList}
                                        currentSize={this.state.pageSize}
                                        pageSizeChange={(num) => {
                                            that.setState({
                                                pageSize: Number.parseInt(num),
                                                currentPage: 1
                                            }, () => that.getPage());
                                        }}
                                        backClick={(num) => {
                                            that.setState({currentPage: Number.parseInt(num)}, () => that.getPage());
                                        }}
                                        nextClick={(num) => {
                                            that.setState({currentPage: Number.parseInt(num)}, () => that.getPage());
                                        }}
                                        goChange={(num) => {
                                            that.setState({currentPage: Number.parseInt(num)}, () => that.getPage());
                                        }}
                                    />
                                </div>
                                <Table
                                    ref="productcategory"
                                    columns={[{
                                        title: i18n.t(100000/*代码*/),
                                        dataIndex: 'code',
                                        key: "code",
                                        width: '40%',
                                        render(data, row, index) {
                                            return (
                                                <div className="text-ellipsis" style={{width: '100px'}}>{data}</div>);
                                        }
                                    }, {
                                        title: i18n.t(100001/*名称*/),
                                        dataIndex: "localName",
                                        key: "localName",
                                        width: "55%",
                                        render(data, row, index) {
                                            return data;
                                        }
                                    }]}
                                    data={this.state.productList_data}
                                    checkboxConfig={{show: true}}
                                    followConfig={{show: false}}
                                    scroll={{x: false, y: false}}
                                    style={{width: '100%'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}

export default ProductCategory;

/*
	let TabSwitchArray = [{title:i18n.t(200112*/
/*产品列表*/
/*),content:<ProductListOne data={this.state.productList_data} columns={this.state.productList_columns} getpages={this.productListGetPages} currentPage={this.state.currentPage} totalPages={this.state.totalPages} sizeList={sizeList} currentSize={this.state.pageSize}/>},{title:i18n.t(100571*/
/*成品分类*/
/*),content:<ProductListOne data={this.state.Finish_data} columns={this.state.Finish_columns} getpages={this.finishedCategoryGetPages} currentPage={this.state.currentPage} totalPages={this.state.totalPages} sizeList={sizeList} currentSize={this.state.pageSize} />}]

    <TabSwitch TabSwitchArray={TabSwitchArray} />

	 let TabSwitchArray = [{title:i18n.t(200112*/
/*产品列表*/
/*),content:<ProductListOne data={this.state.productList_data} columns={this.state.productList_columns} getpages={this.productListGetPages} currentPage={this.state.currentPage} totalPages={this.state.totalPages} sizeList={sizeList} currentSize={this.state.pageSize}/>}]

	 <Page 
		currentPage={this.state.currentPage}
		totalPages={this.state.totalPages} 
		sizeList={sizeList}
		currentSize={this.state.pageSize}
		pageSizeChange={(num)=>{	
			if(this.state.currentPage == num) return;							
			that.getPages(this.state.currentPage,num);
		}} 
		backClick={(num)=>{
			if(this.state.currentPage == num) return;
			that.getPages(null,num);
		}} 
		nextClick={(num)=>{
			if(this.state.currentPage == num) return;
			that.getPages(num);									
		}}
		goChange={(num)=>{
			if(this.state.currentPage == num) return;
			that.getPages(num);																				
		}}								
	/>
	
*/
