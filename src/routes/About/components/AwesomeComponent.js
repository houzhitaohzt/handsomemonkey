import React from 'react';
import {I18n} from '../../../lib/i18n';

var AwesomeComponent = React.createClass({
  render: function() {
    return (
      <div>
        <Translate value="main.menu.fc.es"/>
        
        <Translate value="message.news.title"/>
        <div>
        {I18n.t('main.menu.fc.es')}
      </div>
      </div>
      
    );
  }
});

export default AwesomeComponent;
