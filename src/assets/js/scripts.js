jQuery(document).ready(function() {
  /*
	    Navigation
	*/
  // toggle "navbar-no-bg" class
  $(".top-content .text").waypoint(function() {
    $("nav").toggleClass("navbar-no-bg");
    $("nav").toggleClass("navbar-yes-bg");
  });

  /*
        Background slideshow
    */
  $(".top-content").backstretch("assets/img/backgrounds/background.svg");

  $("#top-navbar-1").on("shown.bs.collapse", function() {
    $(".top-content").backstretch("resize");
  });
  $("#top-navbar-1").on("hidden.bs.collapse", function() {
    $(".top-content").backstretch("resize");
  });

  /*
        Wow
    */
  new WOW().init();
});
