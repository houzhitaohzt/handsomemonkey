import i18n from './../../../lib/i18n';
import React,{Component} from "react"  
export default class KpiTree extends Component{  
    constructor(props){  
        super(props);  
        this.state={  
        }  
        this._handleSelect=this._handleSelect.bind(this);  
        this._handleSearch=this._handleSearch.bind(this);  
        this._handleReturn=this._handleReturn.bind(this);  
    }  
    _handleSearch=()=>{   
        var _self=this;  
        var _inputValue=this.refs.ksearchInput.value;//搜索框输入的关键字  
        var _main=this.refs.kpiTree;  
        _main.innerHTML="";  
        var searchListUrl = './searchListData.json';  
        fetch(searchListUrl,{  
            credentials:'same-origin',  
            async:false,  
            //method: 'POST',  
            method: 'GET',  
            mode:'cors',//跨域请求  
            headers: {  
                "Content-type": "application/x-www-form-urlencoded",  
                "User-Agent": "  Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"  
            },  
        })  
            .then(function(res) {  
                console.log("Response succeeded?", JSON.stringify(res.ok));  
                return res.json();  
            })  
  
            .then(function(data) {   
                _self._renderTreeNode(_main,data,0);  
            })  
            .catch(function(e) {  
                console.log("fetch fail",e.toString());  
            });  
    }  
    _handleReturn=()=>{  
        this.refs.ksearchInput.value="";//清空搜索输入框  
        var _main=this.refs.kpiTree;  
        _main.innerHTML="";  
        this._fetchTreeNodeData("",_main,0);  
    }  
    _handleSelect=()=>{    
        var _select=[];  
        $(this.refs.kpiTree).find("input:checkbox").each(function() {//$('#kpiTree input:checkbox')  
            if ($(this)[0].pid!=undefined&&$(this)[0].checked ==true) {  
                var _selected_kpi={};  
                _selected_kpi.kid=$(this)[0].parentNode.id.substring(4);  
                _selected_kpi.kname=$(this)[0].parentNode.children[1].innerHTML  
                _selected_kpi.pid=$(this)[0].parentNode.pid.substring(4);  
                _select.push(_selected_kpi);  
            }  
        });  
        this.props.callbackParent(_select);  
    }  
    componentDidMount=()=>{  
        var _main=this.refs.kpiTree;  
        this._fetchTreeNodeData("",_main,0);  
    }  
    _selectAllCheckBox=(parentNodeId,event)=>{  
        var _items=$("#" + parentNodeId+" input")  
        for(var i=0;i<_items.length;i++){  
            if (_items[i].pid!=undefined&&_items[i].pid==parentNodeId){  
                _items[i].checked=event.currentTarget.checked;  
            }  
        }  
    }  
    _renderTreeNode=(nodeObj,treeData,paddingLeft)=>{  
        var _self=this;  
        var hasAllSelectBox=false;  
        if(treeData.length>0){  
            for(var i=0;i<treeData.length;i++){  
                if(treeData[i].hasChild=="0"){  
                    hasAllSelectBox=true  
                }  
            }  
            var _node=treeData.map((data,index)=>{  
                var _kname=data.kname;  
                var _div=document.createElement("div");  
                _div.pid="node"+data.pid;  
                _div.id="node"+data.kid;  
                _div.style.paddingLeft=paddingLeft+"px";  
                var _img=document.createElement("img");  
                _img.src="/src/kpiTree/images/hide.png";  
                _img.className="knode-hide-show-icon";  
                _img.onclick=_self._handleClick.bind(this,data.kid);  
                var _checkBox=document.createElement("input");  
                _checkBox.type="checkbox"  
                _checkBox.pid="node"+data.pid;  
                var _span=document.createElement("span");  
                _span.innerHTML=_kname;  
                var allCheckBoxDiv=null;  
                if(data.pid!="-1"&&index==0&&hasAllSelectBox==true){  
                    allCheckBoxDiv=document.createElement("div");  
                    allCheckBoxDiv.pid="node"+data.pid;  
                    allCheckBoxDiv.style.paddingLeft=paddingLeft+"px";  
                    var _allCheckBox=document.createElement("input");  
                    _allCheckBox.type="checkbox";  
                    _allCheckBox.onchange=_self._selectAllCheckBox.bind(this,nodeObj.id);  
                    var _allCheckBoxLabel=document.createElement("span");  
                    _allCheckBoxLabel.innerHTML=i18n.t(200765/*全选*/);  
                    allCheckBoxDiv.appendChild(_allCheckBox);  
                    allCheckBoxDiv.appendChild(_allCheckBoxLabel);  
                }  
                if(data.hasChild=="1"){  
                    _div.appendChild(_img);  
                }  
                else if(data.hasChild=="0"){  
                    _div.appendChild(_checkBox);  
                }  
                _div.appendChild(_span);  
                if(allCheckBoxDiv){  
                    nodeObj.appendChild(allCheckBoxDiv)  
                }  
                nodeObj.appendChild(_div);  
            })  
  
        }  
    }  
    _fetchTreeNodeData=(nodeId,nodeObj,paddingLeft)=>{  
        // debugger;  
        // var _self=this;  
        // var treeListUrl = './treeListData'+nodeId+'.json';  
        // return treeListUrl;
        // fetch(treeListUrl,{  
        //     credentials:'same-origin',  
        //     async:false,  
        //     //method: 'POST',  
        //     method: 'GET',  
        //     mode:'cors',//跨域请求  
        //     headers: {  
        //         "Content-type": "application/x-www-form-urlencoded",  
        //         "User-Agent": "  Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"  
        //     },  
        // })  
        //     .then(function(res) {  
        //         console.log("Response succeeded?", JSON.stringify(res.ok));  
        //         return res.json();  
        //     })  
  
        //     .then(function(data) {  
        //         debugger  
        //         _self._renderTreeNode(nodeObj,data,paddingLeft);  
        //     })  
        //     .catch(function(e) {  
        //         console.log("fetch fail",e.toString());  
        //     });  
  
    }  
    _handleClick=(nodeId,event)=>{   
        var _clickImg=event.currentTarget  
        var currentNode=event.currentTarget.parentNode;  
        if(_clickImg.src.indexOf("hide")!=-1){  
            _clickImg.src="/src/kpiTree/images/show.png";  
            if(currentNode.childNodes[3]!=null&currentNode.childNodes[3]!=undefined){  
                this._showOrHideNode(currentNode,1);  
            }  
            else {  
                this._fetchTreeNodeData(nodeId,currentNode,20);  
            }  
        }  
        else if(_clickImg.src.indexOf("show")!=-1){  
            _clickImg.src="/src/kpiTree/images/hide.png";  
            this._showOrHideNode(currentNode,0);  
        }  
    }  
    _showOrHideNode=(pNode,isShow)=>{  
        var _sub_nodes=pNode.childNodes;  
        for(var i=0;i<_sub_nodes.length;i++){  
            if(_sub_nodes[i].pid==pNode.id){  
                if(isShow==1){  
                    _sub_nodes[i].style.display="block";  
                }  
                else if(isShow==0){  
                    _sub_nodes[i].style.display="none";  
                }  
            }  
        }  
    }  
    render(){  
        // <img className="ksearch-icon" src="/src/kpiTree/images/search-icon.png" onClick={this._handleSearch}/>  
        var tabId=this.props.tabId;  
        var _kpiTreePanelHeight=tabId=="tab01"?"kpitree_panel_height_01":"kpitree_panel_height_02";  
        var _bottomContentHeight=tabId=="tab01"?"kbottom-content_height_01":"kbottom-content_height_02";  
        return (  
            <div className={"kpitree_panel "+_kpiTreePanelHeight}>  
                <div className="ksearch-div">  
                    <input type="text" className="ksearch-input" ref="ksearchInput" placeholder="  请输入搜索关键字"/>  
                    
                    <div className="kreturn-button" onClick={this._handleReturn}>  
                        <span>{i18n.t(100431/*返回*/)}</span>  
                    </div>  
                    <div className="kselecte-button" onClick={this._handleSelect}>  
                        <span>{i18n.t(200766/*指标选择*/)}</span>  
                    </div>  
                </div>  
                <div className={"kbottom-content "+_bottomContentHeight} ref="kpiTree">  
                </div>  
            </div>  
        );  
    }  
};  