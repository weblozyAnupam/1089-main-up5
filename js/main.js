(function ($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on("load", function () {
    if ($("#preloader").length) {
      $("#preloader")
        .delay(100)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").stop().animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#header").addClass("header-scrolled");
    } else {
      $("#header").removeClass("header-scrolled");
    }
  });

  if ($(window).scrollTop() > 100) {
    $("#header").addClass("header-scrolled");
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $(".main-nav a, .mobile-nav a, .scrollto").on("click", function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($("#header").length) {
          top_space = $("#header").outerHeight();

          if (!$("#header").hasClass("header-scrolled")) {
            top_space = top_space - 20;
          }
        }

        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: target.offset().top - top_space,
            },
            1500,
            "easeInOutExpo"
          );

        if ($(this).parents(".main-nav, .mobile-nav").length) {
          $(".main-nav .active, .mobile-nav .active").removeClass("active");
          $(this).closest("li").addClass("active");
        }

        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $(".mobile-nav-toggle i").toggleClass("fa-times fa-bars");
          $(".mobile-nav-overly").fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $("section");
  var main_nav = $(".main-nav, .mobile-nav");
  var main_nav_height = $("#header").outerHeight();

  $(window).on("scroll", function () {
    var cur_pos = $(this).scrollTop();

    nav_sections.each(function () {
      var top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find("li").removeClass("active");
        main_nav
          .find('a[href="#' + $(this).attr("id") + '"]')
          .parent("li")
          .addClass("active");
      }
    });
  });

  // jQuery counterUp (used in Whu Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000,
    formatter: function (n) {
      return n + '+';
    }
  });
  $('[data-toggle="counter-per"]').counterUp({
    delay: 10,
    time: 1000,
    formatter: function (n) {
      return n + '%';
    }
  });

  // Porfolio isotope and filter
  $(window).on("load", function () {
    var portfolioIsotope = $(".portfolio-container").isotope({
      itemSelector: ".portfolio-item",
    });
    $("#portfolio-flters li").on("click", function () {
      $("#portfolio-flters li").removeClass("filter-active");
      $(this).addClass("filter-active");

      portfolioIsotope.isotope({ filter: $(this).data("filter") });
    });
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1,
    nav: true,
    navText: [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>'
    ],
  });
})(jQuery);

const submitForm = {
  showError(form, errors) {
      if (form.querySelector('.validation-error')) {
          form.querySelectorAll('.validation-error').forEach(item => {
              item.remove();
          });
      }

      for (const [field, msg] of Object.entries(errors)) {
          let fieldItem = form.querySelector(`[name="${field}"]`);

          if (fieldItem) {
              fieldItem.insertAdjacentHTML('afterend', `<div class="validation-error small mt-1 text-danger">${msg}</div>`);
          }
      }
  },

  init(projectName, logResponse = true) {
      let apiforms = document.querySelectorAll("form.apiform");

      if (apiforms) {
          apiforms.forEach((form) => {
              form.addEventListener("submit", (e) => {
                  e.preventDefault();
          
                  let form = e.target;
          
                  let spinner = `<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>`;
          
                  form.insertAdjacentHTML("afterBegin", spinner);
          
                  let fdata = new FormData(form);
          
                  form.classList.add("waiting");
          
                  if (logResponse) {
                      console.log({
                          name: fdata.get('name'),
                          email: fdata.get('email'),
                          phone: fdata.get('phone'),
                          requirement: fdata.get('requirement'),
                          msg: fdata.get('msg'),
                          url: window.location.href
                      });
                  }
          
                  axios
                      .post(API_URL, {
                          name: fdata.get("name"),
                          email: fdata.get("email"),
                          phone: fdata.get("phone"),
                          requirement: fdata.get("requirement"),
                          msg: fdata.get("msg"),
                          url: window.location.href,
                      })
                      .then((resp) => {
                          form.classList.remove("waiting");
                          form.querySelector(".spinner").remove();
              
                          let data = resp.data;

                          if (logResponse) {
                              console.log(resp.data);
                          }
              
                          let output;
              
                          if (data.success) {
                          if (form.querySelector(".validation-error")) {
                              form.querySelectorAll(".validation-error").forEach((item) => {
                              item.remove();
                              });
                          }
              
                          output =
                              '<div class="mt-2 text-success">Form submitted successfully.</div>';
              
                          setTimeout(() => {
                              let redirectTo = `thank-you.html`;
              
                              window.localStorage.setItem(`${projectName}_name`, fdata.get("name"));
              
                              window.location.href = encodeURI(redirectTo);
                          }, 0);
                          } else {
                              let errors = data.errors;
                              this.showError(form, errors);
                  
                              output = '<div class="mt-2 text-danger">Form submission not successful.</div>';
                          }
              
                          form.querySelector(".status").innerHTML = output;
                      });
                  });
          });
      }
  }
};

window.submitForm = submitForm;

submitForm.init('wlp1089');

Splide.defaults = {
  mediaQuery: "min",
  perPage: 1,
  autoplay: true,
};

if (document.querySelectorAll(".intro-slider")) {
  let introSlider = new Splide(".intro-slider", {
    type: "loop",
    arrows: false,
  });

  introSlider.mount();
}

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.code === "KeyS") {
    e.preventDefault();
  }
});

if (document.querySelector(".sidebar-form")) {
    

  window.sidebar = {
    el() {
        let form = document.querySelector(".sidebar-form");
        return form;
    },

    close() {
        this.el().classList.remove("show");
        document.body.classList.remove("noscroll");
        document.body.classList.remove("sidebar-open");
    },

    open() {
        document.body.classList.add("noscroll");
        document.body.classList.add("sidebar-open");
        this.el().classList.add("show");
    },

    toggle() {
        if (this.el().classList.contains('show')) {
            this.close();
        }
        else {
            this.open();
        }
    },

    calculateWidth() {
        let width = this.el().offsetWidth;
        document.body.style.setProperty('--sidebar-width', width + 'px');
    }
  };

    sidebar.el().querySelector('.close').addEventListener('click', () => {
        sidebar.close();
    });

    // sidebar.el().querySelector('.btn-cancel').addEventListener('click', () => {
    //     sidebar.close();
    // });

    // let lastPosY = window.scrollY;

    // window.addEventListener('scroll', (e) => {
    //     let curPosY = window.scrollY;

    //     if (curPosY >= lastPosY) {
    //         // Scrolling down
    //     }
    //     else {
    //         // Scrolling Up
    //         if (! sidebar.el().classList.contains('show')) {
    //             setTimeout(() => {
    //                 sidebar.open();
    //             }, 4000);
    //         }
    //     }

    //     lastPosY = curPosY;
    // });
}

if (document.querySelector('[data-setbg]')) {
  let elems = document.querySelectorAll('[data-setbg]');
  elems.forEach(elem => {
      elem.style.backgroundImage = `url(${elem.dataset.setbg})`;
  });
}