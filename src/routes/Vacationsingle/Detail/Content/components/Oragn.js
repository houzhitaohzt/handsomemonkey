import React, { Component } from 'react';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import {I18n} from "../../../../../lib/i18n";
export class DetailNormal extends Component{
    constructor(props){
        super(props)

    }
    initState(){
        return {
            data:{},

        }
    }
    render(){
        let {getOne} = this.props;
        return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
            <div className={'addnormal-title'}>
                <span>{I18n.t(100194/*系统信息*/)}</span>
            </div>
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-3 col-lg-3'}>{I18n.t(100143/*创建人*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p className={'paragraph'}>{getOne.createStaffName}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-3 col-lg-3'}>{I18n.t(100144/*修改人*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p className={'paragraph'}>{getOne.updateStaffName}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-3 col-lg-3'}>{I18n.t(100145/*创建时间*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p className={'paragraph'}>{new Date(getOne["createDate"]).Format("yyyy-MM-dd hh:mm:ss")}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-3 col-lg-3'}>{I18n.t(100146/*修改时间*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p className={'paragraph'}>{new Date(getOne["updateDate"]).Format("yyyy-MM-dd hh:mm:ss")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default  DetailNormal;