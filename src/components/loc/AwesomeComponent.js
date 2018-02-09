import React from 'react';
import {  Localize,I18n } from '../../lib/i18n';

var AwesomeComponent = React.createClass({
  render: function() {
    return (
      <div>
        <div>
        {I18n.t(100354/*客户代码*/)}
      </div>
      </div>
      
    );
  }
});

export default AwesomeComponent;
