var optionsImply = {
  cookieMessage: "We are using cookies to give you the best"
  + " experience on our site. Cookies are files stored in your"
  + " browser and are used by most websites to help personalise your web experience.",
  cookieMessageImply: "By continuing to use our website,"
  + " you are agreeing to our use of cookies.",
  showLink: true,
  position: 'top',
  linkText: "",
  linkRouteName: "/cookiePolicy",
  html: false,
  className: null,
  expirationInDays: 7
};

CookieConsent.init(optionsImply);