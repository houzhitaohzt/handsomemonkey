import React, { Component } from 'react';

import "./Slider.less";
import SliderItem from './SliderItem/SliderItem';
import SliderDots from './SliderDots/SliderDots';
import SliderArrows from './SliderArrows/SliderArrows';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLocal: 0,
    };
  }

  // 向前向后多少
  turn(n) {
    console.log();
    var _n = this.state.nowLocal + n;
    if(_n < 0) {
      _n = _n + this.props.items.length;
    }
    if(_n >= this.props.items.length) {
      _n = _n - this.props.items.length;
    }
    this.setState({nowLocal: _n});
  }

  // 开始自动轮播
  goPlay() {
    if(this.props.autoplay) {
      this.autoPlayFlag = setInterval(() => {
        this.turn(1);
      }, this.props.delay * 1000);
    }
  }

  // 暂停自动轮播
  pausePlay() {
    clearInterval(this.autoPlayFlag);
  }

  componentDidMount() {
    this.goPlay();
  }
  componentWillUnmount(){
    clearInterval(this.autoPlayFlag);
  }
  render() {
    let count = this.props.items.length;

    let itemNodes = this.props.items.map((item, idx) => {
      return <SliderItem item={item} count={count} key={'item' + idx} />;
    });

    let arrowsNode = <SliderArrows turn={this.turn.bind(this)}/>;

    let dotsNode = <SliderDots turn={this.turn.bind(this)} count={count} nowLocal={this.state.nowLocal} />;

    return (
      <div
        className="slider"
        onMouseOver={this.props.pause?this.pausePlay.bind(this):null} onMouseOut={this.props.pause?this.goPlay.bind(this):null}>
          <ul style={{
              left: -100 * this.state.nowLocal + "%",
              transitionDuration: this.props.speed + "s",
              width: this.props.items.length * 100 + "%"
            }}>
              {itemNodes}
          </ul>
          {this.props.arrows?arrowsNode:null}
          {this.props.dots?dotsNode:null}
        </div>
      );
  }
}

Slider.defaultProps = {
  speed: 1,
  delay: 2,
  pause: true,
  autoplay: true,
  dots: true,
  arrows: true,
  items: [],
};
/*<Slider  Slider用法
    items={[
      {
        src: require('./images/demo1.jpg'),
        alt: 'images-1',
      },
      {
        src: require('./images/demo2.jpg'),
        alt: 'images-2',
      },
      {
        src: require('./images/demo3.jpg'),
        alt: 'images-3',
      },   #图片数组，有几张图片放几张
    ]}
    speed={1.5}       #轮播切换图片的速度
    delay={3}         #自动轮播时候停留的时间
    pause={true}      #鼠标放上图片是否停止自动轮播
    autoplay={true}   #是否自动轮播
    dots={true}       #是否需要下面的轮播点点位
    arrows={true}     #是否需要左右点击箭头
  />*/
Slider.autoPlayFlag = null;

