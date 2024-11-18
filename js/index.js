document.addEventListener("DOMContentLoaded", function () {
  var navbarToggler = document.querySelector(".navbar-toggler");
  var navbarNav = document.querySelector(".navbar-nav");
  var navLinks = document.querySelectorAll(".navbar-nav a"); // Select all nav links

  navbarToggler.addEventListener("click", function () {
    navbarNav.classList.toggle("active");
  });

  navLinks.forEach(function (navLink) {
    navLink.addEventListener("click", function () {
      navbarNav.classList.remove("active"); // Hide the navigation bar
    });
  });
});
