//动态拼接Table头
// getInit(){
// 		var that = this;
// 		let columns = [];
// 		apiGet(API_FOODING_ERP,'/common/getTermModes',{},
// 			(response)=>{
// 				let array = response.data.salver;
// 				for(var i=0;i<array.length;i++){

// 					let obj = {
// 						title : array[i].localName,
// 						dataIndex :"prices",
// 						key : array[i].id,
// 						width : "10%",
// 						render(data,row,index){
// 							return data[index.key];
// 						}
// 					}
// 					columns.push(obj);
// 				}
// 				columns.push({
// 					title : "操作",
// 					dataIndex : "handle",
// 					key : "handle",
// 					width : "10%",
// 					render(data,row,index){
// 						return <div><i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(this,data,row)} style={{marginRight:'20px'}}></i><i className='foddingicon fooding-alter_icon2' onClick={that.editClick.bind(this,data,row)}></i></div>;
// 					}
// 				});
// 				that.setState({
// 					columns:columns
// 				})
// 			},(errors)=>{
// 		});
// 	}



/****************************************  分页 begin  ***************************/
//  currentPage: 当前页
//  totalPages: 总页数
//  pageSize: 每页多少条

/*
<Page 
    currentPage={this.state.currentPage}
    totalPages={this.state.totalPages} 
    sizeList={sizeList}
    currentSize={this.state.pageSize}
    pageSizeChange={(num)=>{
        that.setState({ pageSize: Number.parseInt(num) },()=>that.getPage());
    }} 
    backClick={(num)=>{
        that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
    }} 
    nextClick={(num)=>{
        that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
    }}
    goChange={(num)=>{
        that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
    }}								
/>
*/

/***************************************  分页 over  *****************************/



/********************************  ERP 下拉多个值  begin  *************************/
// 新增、编辑  共用一个模板
/*
		// event func
		this.handleCertificate = this.handleCertificate.bind(this); // 证书费用

		// state init
		this.state = {
			certificate: [{id:1,localName:''}]
		}

        // 证书名称 ajax
        handleCertificate(e){
            var that = this;     
            apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Certfct'},
                (response)=>{							
                    this.setState({	certificate:response.data });
                },(errors)=>{
                    ServiceTips({text:errors,type:'error'});
            });
        }


        let {checkedData} = this.props;
        <div>
            <label><span>*</span>证书名称</label>
            <Select 
                {...getNFieldProps('certifctId',{
                    rules: [{required:true}],
                    initialValue: checkedData ? 
                                    { s_label: checkedData['certifct'+language], certifctId: checkedData.certifctId, certifctLcName: checkedData.certifctLcName, certifctEnName: checkedData.certifctEnName } 
                                    : 
                                    ''
                })}
                placeholder=''
                optionLabelProp="children"							
                style={{width:300,marginRight:15}}
                className ={getFieldError('certifctId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}							
                onClick={this.handleCertificate}
            >	
                {this.state.certificate.map((o,i)=><Option key={i} objValue={{s_label:o.localName, certifctId: o.id, certifctLcName:o.localName, certifctEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
            </Select>
        </div>
*/
/********************************  ERP 下拉多个值  over  *************************/
//通用接口过滤条件
// queryParams:[{attr:"statnTyId",expression:"=",value:this.props.form.getFieldValue("statnTyId")}]},

// new Date(data).Format("yyyy-MM-dd hh:mm:ss");时间格式化
 // optionFilterProp="children"  //下拉框按照名称搜索

/********************************  getMiniList 初始化 Select 的封装 *************************/
/*
 import {ConstVirtualSelect} from './../../../../components/Select/';

所有参数说明
 initRequest        default = false;    (boolean)                   是否初始化时加载接口数据
 disabled           default = false;    (boolean)                   是否禁用下拉框
 isRequest          default = true;     (boolean)                   是否可以请求接口数据
 refreshMark        default = undefined;(any)                       刷新标志, 就是表单什么时候用重新用initialValue里面的值
 initValueOptions   default = [];       (array)                     选项值数据, 可用于不请求数据接口时
 clearable          default = false;    (boolean)                   显示清除按钮
 searchable         default = true;     (boolean)                   带搜索功能
 async              default = false;    (boolean)                   接口模糊搜索
 autoload           default = false;    (boolean)                   接口模糊搜索, 是否开始就请求一次
 cache              default = false;    (boolean)                   接口模糊搜索, 缓存每次搜索的关键词结果
 multi              default = false;    (boolean)                   多选
 isLoading          default = false;    (boolean)                   显示加载进度圈
 pageSize           default = 8;        (number)                    下拉选项中显示几个View
 optionHeight       default = 33;       (number)                    下拉选项单个View的高度
 className          default = 'col-xs-8 col-md-8';(string)          样式
 style              default = {};       (object)                    样式
 initialValue       default = '';       (number|string|object|array)初始值
 fieldName          default = (无默认值);    (string)                表单字段Name值
 form               default = (无默认值);    (object=>Form)          表单对象
 rules              default = false;    (boolean)                   表单验证
 onChange           default = ()=>{};           (function)          值改变时回调方法
 errorClassName     default = "error-border";   (string)            表单验证不通过时, 显示的样式
 sendChange         default = false;            (boolean)           值改变时发生事件, 监听此事件的地方可收到()
 responseName       default = "data";           (string)            接口数据取值字段, 多层时如: data.data
 apiType            default = apiGet;           (function)          接口类型
 apiHost            default = API_FOODING_DS;       (string)        接口Host
 apiUri             default = '/object/getMiniList';(string)        接口URI
 apiParams          default = (无默认值);            (string|object) 接口参数字段, 默认字符串: 搜索时作为搜索参数, 其他作为obj参数. 对象直接做参数
 valueKeys          default = 'id'          (string|function)       默认取值字段, 可用方法返回一个对象
 labelKey           default = 'localName'   (string)                默认取值显示字段
 searchPromptText   default = '输入搜索词'   (string)                搜索提示字段
 placeholder        default = ''            (string)                提示字段
 autoComplete       default = false;        (boolean)               可输入的选项下拉

//精简
<ConstVirtualSelect form={this.props.form} apiParams="com.fooding.fc.ds.entity.Country" fieldName="countryId"
 initialValue={responseData.party.countryId ? responseData.party.countryId : ''} rules={true}/>

<ConstVirtualSelect form={this.props.form} aipParams="com.fooding.fc.ds.entity.Country" fieldName="countryId"
 initialValue={responseData.party.countryId ? responseData.party.countryId : ''} rules={true}
  valueKeys={da => ({
        s_label: da.name,
        name: da.name,
        id: da.id
    })}
  />

//扩展
<ConstVirtualSelect form={this.props.form} apiParams={{parentId: responseData.party.parentId}}
    apiType={apiPost} apiHost={API_FOODING_ES} apiUri={"/party/getPartyTypes"}
    fieldName="typeId" initValueOptions={[responseData.party.partyType]}
    className = 'currency-btn select-from-currency col-xs-9 col-md-9'
    valueKeys={da => ({
        s_label: da.name,
        name: da.name,
        id: da.id
    })}
    initialValue={responseData.party.typeId ? responseData.party.typeId : ''} rules={true}/>

// 搜索
import {ConstVirtualSelect} from './../../../../components/Select/';

<ConstVirtualSelect
    form={this.props.form}
    fieldName='mtlId'
    apiUri='/platformMaterial/search'
    onChange={this.onProductChange}
    async={true}
    apiParams='keyword'
    initialValue={prodField}
    valueKeys={ da => ({
        mtlId: da.id,
        mtlLcName: da.localName,
        mtlEnName: da.name,
        basSpeci: da.specTxt,
        s_label: da.localName
    })}
/>
/*

/********************************  Tabs标签相关操作 *************************/

/*
 这里是前提
 import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';//引入
 export default NavConnect(createForm()(ActivityDetail));//这样导出才能用

 */

//关闭当前界面, 跳转或打开 指定界面
/*
backClick() {
    let {navReplaceTab} = this.props;
    let billId = this.props.location.query.id;
    if(billId){
        navReplaceTab({name:'销售样品单详情',component:'销售样品单详情',url:'/samporder/detail'});
        this.props.router.push({pathname: '/samporder/detail', query: {id: billId}});
    } else {
        navReplaceTab({name:'销售样品单',component:'销售样品单',url:'/SamPorder/list'});
        this.props.router.push({pathname: '/SamPorder/list'});
    }
}
*/

//如果编辑和添加是一个界面, 用如下方法(打开新增时,先关闭编辑. 反之亦然)
/*
 addClick(){
     let {navAddTab, navRemoveTab} = this.props;
     navRemoveTab({name:'编辑销售样品单',component:'编辑销售样品单',url:'/samporder/edit'});
     navAddTab({ name: '新增销售样品单', component: '新增销售样品单', url: '/samporder/edit'});
     this.props.router.push({pathname: '/samporder/edit'});
 }
 */

//刷新/关闭当前界面
/*
 let {navRefreshCurrentTab, navRemoveCurrentTab} = this.props;
 navRefreshCurrentTab();//刷新当前界面
 navRemoveCurrentTab();//关闭当前界面
 */

/********************************  Table 右键菜单根据行数据显示菜单 *************************/


/*
let a = {
    //key: 字符串, 可以是: a.b.c 对应
    //  object = {a: {b: {c: 'abc', c1: 'c1'}, b1: 'b1'}, a1: 'a1'} 取值object.a.b.c
    //value 可以是String,Number,Boolean,Array
    //exp: ==, ===, !=, !==, <>, ><
    condition: [
        {key: 'irowSts.id', value: 5, exp: '==='},
        'and',
        {key: 'irowSts.name', value: [5, 10], exp: '!=='},
        'or',
        {key: 'irowSts.id', value: [5, 10], exp: '==='},
        'or',
    ]
};*/



/******************************** 按钮权限 *************************/
/* 右键一：
<Template1 
    menuList={[
        {permissions:'clien.edit',type:"编辑",child:<div><i className='foddingicon fooding-alter_icon2'></i>编辑</div>}
    ]}                        
/>
*/

/* 右键二：
<MeasureCommon 
    menuList={[
        {type:'add',permissions:'clien.add'},
        {type:'delete',permissions:'clien.del'},
        {type:'edit',permissions:'clien.edit'}                                        
    ]} 
/>                        
*/
// 详情删除后刷新列表页面window.navTabs.replace("销售退货", "/saleorderreturn/list", {}, {refresh: true});
