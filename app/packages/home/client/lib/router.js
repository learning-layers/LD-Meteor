import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout';
import Navbar from '../../../../common/client/ui/mainLayout/Navbar';
import Home from '../ui/Home';
import HelpCenter from '../../../helpCenter/client/ui/HelpCenter';

FlowRouter.route('/', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    mount(MainLayout, {
      header: <Navbar />,
      content: <Home />,
      helpCenter: <HelpCenter />
    });
  }
});

FlowRouter.route('/home', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    mount(MainLayout, {
      header: <Navbar />,
      content: <Home />,
      helpCenter: <HelpCenter />
    });
  }
});