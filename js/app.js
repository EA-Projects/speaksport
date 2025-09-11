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
    function calculateROI() {
        const callsPerDay = Number($("#callsPerDay").val());
        const missedPct = Number($("#missedPct").val());
        const bookingPct = Number($("#bookingPct").val());
        const revenuePerGroup = Number($("#revenuePerGroup").val());
        const mode = $("input[name='mode']:checked").val();

        const substitutionPct = mode === "integrated" ? 25 : 45;

        const missedCalls = (callsPerDay * missedPct) / 100;
        const missedBookings = (missedCalls * bookingPct) / 100;
        const recoveredPerDay = missedBookings * revenuePerGroup * (1 - substitutionPct / 100);
        const recoveredPerMonth = recoveredPerDay * 30;
        const recoveredPerYear = recoveredPerDay * 365;

        $("#perDay").text(recoveredPerDay.toLocaleString());
        $("#perMonth").text(recoveredPerMonth.toLocaleString());
        $("#perYear").text(recoveredPerYear.toLocaleString());
    }

    // Ejecutar al cargar
    $(document).ready(function() {
        calculateROI();

        // Escuchar cambios en todos los inputs
        $("#callsPerDay, #missedPct, #bookingPct, #revenuePerGroup").on("input change", calculateROI);
        $("input[name='mode']").on("change", calculateROI);
    });

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

    // Animations
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
