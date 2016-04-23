import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { BrowserPolicy } from 'meteor/browser-policy-common';
import { JsonRoutes } from 'meteor/simple:json-routes';

// setup ssr cache per user
var timeInMillis = 1000 * 10; // 10 secs
FlowRouter.setPageCacheTimeout(timeInMillis);

// once the browser received the html it can render without waiting for JavaScript
FlowRouter.setDeferScriptLoading(true);

let meldAccounts = function(userId) {
  let currentUser = Meteor.users.findOne({"_id": userId});
  if (!currentUser.emails || !currentUser.emails[0]) {
    let userEmail = null;
    let userEmailVerified = null;
    if (currentUser.services.google) {
      userEmail = currentUser.services.google.email;
      userEmailVerified = true;
    } else if (currentUser.services.facebook) {
      userEmail = currentUser.services.facebook.email;
      userEmailVerified = true;
    } else if (currentUser.services.learninglayers) {
      userEmail = currentUser.services.learninglayers.emails[0].address;
      userEmailVerified = currentUser.services.learninglayers.emails[0].verified;
    }
    if (!currentUser.registered_emails) {
      Meteor.users.update({_id: currentUser._id}, {$set:{'registered_emails': []}});
    }
    if (!currentUser.emails) {
      Meteor.users.update({_id: currentUser._id}, {$set:{'emails': []}});
    }
    Meteor.users.update({_id: currentUser._id}, {$addToSet:{'registered_emails': {address: userEmail, verified: userEmailVerified}}});
  }
  return true;
};
let meldAccountsOnLogin = function(loginInfo){
  return meldAccounts(loginInfo.user._id);
};

/**
 * Account configuration
 */
if (Meteor.settings.private.email.from) {
  Accounts.emailTemplates.from = Meteor.settings.private.email.from;
}

/**
 * Startup configuration
 */
Meteor.startup(function () {
  // Browser security settings
  console.log("Server starting up");
  BrowserPolicy.content.disallowInlineScripts();
  BrowserPolicy.content.disallowEval();
  BrowserPolicy.content.allowInlineStyles();
  BrowserPolicy.framing.allowAll();
  BrowserPolicy.content.allowFontDataUrl();

  // Enable cross origin requests for all endpoints
  var trustedClientDomains = [
    //"*",
    "https://app.learnenv.com",
    "https://api.learnenv.com",
    "https://internal.learnenv.com",
    "https://test.learnenv.com"
  ];

  if (!isProdEnv()) {
    trustedClientDomains.push('http://localhost');
  }

  JsonRoutes.setResponseHeaders({
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Access-Control-Allow-Origin": trustedClientDomains.join(", "),
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  });

  var trustedOrigins = [
    'youtube.com',
    '*.youtube.com',
    'fonts.googleapis.com',
    '*.fonts.googleapis.com',
    '*.fonts.gstatic.com',
    'fonts.gstatic.com',
    'video-js.zencoder.com',
    'vjs.zencdn.net'
  ];

  if (!isProdEnv()) {
    // allow hot reloading in dev mode
    trustedOrigins.push('localhost:3002');
  }

  trustedOrigins.forEach(function(origin) {
    origin = "https://" + origin;
    BrowserPolicy.content.allowOriginForAll(origin);
    BrowserPolicy.content.allowScriptOrigin(origin);
  });

  trustedOrigins.forEach(function(origin) {
    origin = "http://" + origin;
    BrowserPolicy.content.allowOriginForAll(origin);
    BrowserPolicy.content.allowScriptOrigin(origin);
  });

  BrowserPolicy.content.allowFrameOrigin('https://*.youtube.com');
  console.log("BrowserPolicy configured");

  // Mail configuration
  if (Meteor.settings.private.email.url && isProdEnv()) {
    process.env.MAIL_URL = Meteor.settings.private.email.url;
  }

  // open id connect configuration
  const services = Meteor.settings.private.oAuth;
  if (services) {
    for (var service in services) {
      ServiceConfiguration.configurations.upsert({service: service}, {
        $set: services[service]
      });
    }
  }

  // initial user configuration
  if (Meteor.users.find({}, {fields: {emails: 1}}).count() === 0) {
    // create initial super user
    var users = [
      {email:  Meteor.settings.private.initialUser.email, roles:[]}
    ];

    _.each(users, function (user) {
      var id;

      id = Accounts.createUser({
        email: user.email,
        password: Meteor.settings.private.initialUser.password
      });

      Roles.addUsersToRoles(id, 'super-admin', Roles.GLOBAL_GROUP);
      Roles.addUsersToRoles(id, ['super-duper-admin'], 'super-admin-group');
      meldAccounts(id);
    });
  }
});

Accounts.onCreateUser(function(options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    user.profile = options.profile;
  }
  if (!user.profile ) {
    user.profile = {};
  }
  var email = null;
  if (!user.profile.email) {
    if (user.emails && user.emails[0]) {
      email = user.emails[0].address;
    } else {
      for (var service in user.services) {
        //console.log(JSON.stringify(user.services[service]));
        email = user.services[service].email;
      }
    }
    user.profile.email = email;
  }
  if (!user.profile.name) {
    user.profile.name = email;
  }
  return user;
});

/**
 * User account melding and providing email address in Meteor.user() on the client side.
 */
Accounts.onLogin(meldAccountsOnLogin);