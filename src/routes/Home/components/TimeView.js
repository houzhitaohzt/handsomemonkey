import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
export class TimeView extends Component{
 constructor(props) {
    super(props);
    var data = new Date();
    this.time=null;
    let str = data.getFullYear() +"/"+this.fromat(data.getMonth() +1)+"/"+ this.fromat(data.getDate());
    let house = this.fromat(data.getHours()) + ":" + this.fromat(data.getMinutes()) + ":" + this.fromat(data.getSeconds());
    this.state = {
      time_str:str,
      house:house
    }
  }
  componentDidMount(){
    this.timeInterval();
  }
  componentWillUnmount(){
    clearInterval(this.time);
  }
  timeInterval(){
     this.time = setInterval(()=>{
          var data = new Date();
          let str = data.getFullYear() +"/"+this.fromat(data.getMonth() +1)+"/"+ this.fromat(data.getDate());
          let house = this.fromat(data.getHours()) + ":" + this.fromat(data.getMinutes()) + ":" + this.fromat(data.getSeconds());
          if(this.setState){
            this.setState({
              time_str:str,
              house:house
            });
          }else{
           
          }
          
     },1000);
  }
   fromat(strDate){
   if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return strDate;
  }
  render(){
  	return (
  		<div className="index-bd-box hh-radius hh-pd10 shadow">
            <div className="Punch_l">
                <h1 id="time">{this.state.house}</h1>
                <span id="year"> {this.state.time_str}</span>
                <p>IP:192.168.3.98</p>
            </div>
            <div className="Punch_r">
                <button type="button" className="dk-btn hh-btn-primary hh-radius">{i18n.t(200643/*打卡*/)}</button>
            </div>
          </div>
        );
  }
};

export default TimeView;
