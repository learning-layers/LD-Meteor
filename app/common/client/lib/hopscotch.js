import hopscotch from 'hopscotch';

Meteor.startup(function() {
  // Define the tour!
  var tour = {
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
  };
  // Start the tour!
  setTimeout(function() {
    hopscotch.startTour(tour);
  }, 3000);
});