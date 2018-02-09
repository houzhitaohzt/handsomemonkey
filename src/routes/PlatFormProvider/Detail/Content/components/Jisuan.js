import i18n from '../../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
import {createForm,FormWrapper} from '../../../../../components/Form';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.columns =[{
            title : 'FOB Unit Price(MT)',
            dataIndex : 'fobPrc',
            key : "fobPrc",
            width : '20%',
            render(data,row,index){
                return (<div title={data}>{data?data +' '+ row.cnyName:''}</div>)
            }
        },{
            title :'POL',
            dataIndex : "sStatnName",
            key : "sStatnName",
            width : "20%",
            render(data,row,index){
                return data;
            }
        },{
            title :'CIF Unit Price(MT)',
            dataIndex : "cifPrc",
            key : "cifPrc",
            width : "20%",
            render(data,row,index){
                return (<div title={data}>{data?data +' '+ row.cnyName:''}</div>)
            }
        },{
            title :'POD',
            dataIndex : "eStatnName",
            key : "eStatnName",
            width : "20%",
            render(data,row,index){
                return data;
            }
        },{
            title :'Validity',
            dataIndex : "eDate",
            key : "eDate",
            width : "25%",
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
        }]

        this.state = {
            inputValue:'',
            checked:0,
            paddingTop:0,
            scroll:0,
            scrollHeight:0,
            filter:null,
            selectArr:[],
            checkedRows:[],
            choised:false,
            data:null,
            MeunState:true,

        };
        this.handleResize = this.handleResize.bind(this);
    }
    handleChange(e){
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        let scroll = sch-135;

        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentDidMount(){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    kun(){

    }
    render(){
        let data=this.props.cangKuArray;
        return (
            <div className='activity-detail' style={{height:'100px',padding:'0px'}}>
                <div className={'client-body-single'}>
                    <Table
                        columns={this.columns}
                        data={this.props.cangKuArray}
                        checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        colorFilterConfig={{show : false,dataIndex:'colorType'}}
                        followConfig={{show:false}}
                        scroll={{x:true,y:this.state.scroll}}
                    />
                </div>
            </div>
        );

    }

}

export default NavConnect(createForm()(ActivityDetail));

