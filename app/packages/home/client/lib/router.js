import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import MainLayout from '../../../../common/client/ui/mainLayout/MainLayout';
import Navbar from '../../../../common/client/ui/mainLayout/Navbar';
import Home from '../ui/Home';
import HelpCenter from '../../../helpCenter/client/ui/HelpCenter';

let helpTours = [
  {
    label: "Tour 1",
    hopscotchConfig: {
      id: "hello-hopscotch",
      steps: [
        {
          title: "My Header",
          content: "This is the header of my page.",
          target: "header",
          placement: "bottom"
        },
        {
          title: "My content",
          content: "Here is where I put my content.",
          target: "main",
          placement: "bottom"
        }
      ]
    }
  },{
    label: "Tour 2",
    hopscotchConfig: {
      id: "hello-hopscotch",
      steps: [
        {
          title: "My Header",
          content: "This is the header of my page.",
          target: "header",
          placement: "bottom"
        },
        {
          title: "My content",
          content: "Here is where I put my content.",
          target: "main",
          placement: "bottom"
        }
      ]
    }
  },{
    label: "Tour 3",
    hopscotchConfig: {
      id: "hello-hopscotch",
      steps: [
        {
          title: "My Header",
          content: "This is the header of my page.",
          target: "header",
          placement: "bottom"
        },
        {
          title: "My content",
          content: "Here is where I put my content.",
          target: "main",
          placement: "bottom"
        }
      ]
    }
  }
];

FlowRouter.route('/', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    mount(MainLayout, {
      header: <Navbar />,
      content: <Home />,
      helpCenter: <HelpCenter helpTours={helpTours} />
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
      helpCenter: <HelpCenter helpTours={helpTours} />
    });
  }
});