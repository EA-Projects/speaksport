window.addEventListener('load', function() {  
    // Fix navbar when scroll
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 1) {
            $('nav').addClass('scrolled');
        } 
        else {
            $('nav').removeClass('scrolled');
        }
    });

    // Hero audio
    const audio = $("#hero-audio")[0];

    $("#hero .is-play").on("click", function () {
        audio.play();
        $(this).parent().removeClass("stopped").addClass("playing");
    });

    $("#hero .is-phone").on("click", function () {
        audio.pause();
        audio.currentTime = 0;
        $(this).parent().removeClass("playing").addClass("stopped");
    });

    // Calculator for ROI
    function calculate() {
        let callsPerDay = Number($("#callsPerDay").val());
        let missedPct = Number($("#missedPct").val());
        let bookingPct = Number($("#bookingPct").val());
        let revenuePerGroup = Number($("#revenuePerGroup").val());
        let substitutionPct = Number($("#substitutionPct").val());

        let missedCalls = (callsPerDay * missedPct) / 100;
        let missedBookings = (missedCalls * bookingPct) / 100;
        let recoveredPerDay = missedBookings * revenuePerGroup * (1 - substitutionPct / 100);
        let recoveredPerMonth = recoveredPerDay * 30;
        let recoveredPerYear = recoveredPerDay * 365;

        // Key insights
        let lostBookingsPerDay = missedBookings;
        let recoveryOpportunity = 100 - substitutionPct;
        let potentialROI = recoveredPerYear > 100000 ? "High" : recoveredPerYear > 50000 ? "Medium" : "Low";

        // Update DOM
        $("#dailyRecovery").text(`$${Math.round(recoveredPerDay).toLocaleString()}`);
        $("#monthlyRecovery").text(`$${Math.round(recoveredPerMonth).toLocaleString()}`);
        $("#annualRecovery").text(`$${Math.round(recoveredPerYear).toLocaleString()}`);
        $("#missedCalls").text(Math.round(missedCalls));
        $("#lostBookings").text(Math.round(lostBookingsPerDay));
        $("#recoveryOpportunity").text(`${recoveryOpportunity}%`);
        $("#potentialROI").text(potentialROI);
    }

    // Bind events
    $("input").on("input", calculate);

    // Initial calc
    calculate();

    // Slick slider for Resources
    $('.slider-resources').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: false,
        arrows: false,
        autoplay: false,
        pauseOnHover: false,
        draggable: true,
        infinite: false,
        dots: true,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    });

    // Animations on parallax
    if (window.matchMedia('(min-width: 575px)').matches) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(".row-feature.is-left .inner-graphic img", {
            y: -40
            },
            {
            y: 60,
            ease: "none",
            scrollTrigger: {
                trigger: ".row-feature.is-left",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(".row-feature.is-right .inner-graphic img", {
            y: -40
            },
            {
            y: 60,
            ease: "none",
            scrollTrigger: {
                trigger: ".row-feature.is-right",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
    }

    //   Animations on fade in
    let animatedElements = new Set(); // Para evitar reanimaciones

    let observer = new IntersectionObserver((entries) => {
        // Filtrar los elementos que están entrando en vista y no han sido animados aún
        const toAnimate = entries
            .filter(entry => entry.isIntersecting && !animatedElements.has(entry.target))
            .map(entry => entry.target);

        if (toAnimate.length > 0) {
            gsap.to(toAnimate, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                ease: "power2.out",
                duration: 0.5,
                delay: 0.3
            });

            // Marcar los elementos como animados y dejar de observarlos
            toAnimate.forEach(el => {
                animatedElements.add(el);
                observer.unobserve(el);
            });
        }
    }, {
        threshold: 0.3
    });

    document.querySelectorAll("[data-fade]").forEach((el) => {
        observer.observe(el);
    });

});
