import React,{Component} from 'react';

export const DemoAbout=({children,title})=>(
  <div>
    <h1>{title}</h1>
    <div>{children}</div>
  </div>
);

export default DemoAbout;

