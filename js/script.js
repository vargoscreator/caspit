document.addEventListener("DOMContentLoaded", function() {
    const langBlock = document.querySelector(".header__lang");
    const langButton = langBlock.querySelector(".header__lang-selected");
    langButton.addEventListener("click", (e) => {
        e.stopPropagation();
        langBlock.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
        if (!langBlock.contains(e.target)) {
            langBlock.classList.remove("active");
        }
    });
});

const headerBurger = document.querySelector('.header__burger');
const headerMenu = document.querySelector('.header__menu');
const headerMenuClose = document.querySelector('.header__menu-close');
const headerMenuList = document.querySelector('.header__menu ul');
headerBurger.addEventListener('click', () => {
    headerMenu.classList.add('active');
});
headerMenuClose.addEventListener('click', () => {
    headerMenu.classList.remove('active');
});
document.addEventListener('click', (e) => {
    const isClickInsideMenu = headerMenu.contains(e.target);
    const isClickInsideList = headerMenuList.contains(e.target);
    const isClickBurger = headerBurger.contains(e.target);
    const isClickClose = headerMenuClose.contains(e.target);

    if (!isClickInsideList && !isClickBurger && !isClickClose && isClickInsideMenu) {
        headerMenu.classList.remove('active');
    }
});

const header = document.querySelector(".header");
const heroBtn = document.querySelector('.hero__btn');
heroBtn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToSection(1);
});

function updateHeaderClass(index) {
    const section = sections[index];
    header.classList.remove("scrolled");
    if (index !== 0) header.classList.add("scrolled");
}

gsap.registerPlugin(ScrollTrigger);
const sections = gsap.utils.toArray(".section-horizontal");
const sectionsWrapper = document.querySelector(".sections-wrapper");
const underline = document.querySelector('.menu-underline');
const menuLinks = document.querySelectorAll('.header__menu a');

sections.forEach(section => {
    if (section.classList.contains("products")) {
        const slides = section.querySelectorAll(".products__slide");
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${i * 200}px)`;
            slide.classList.remove("animated");
        });
    }
});

function moveUnderlineTo(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.parentElement.getBoundingClientRect();
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - parentRect.left}px`;
}

const initialActive = document.querySelector('.header__menu a.active');
if (initialActive) moveUnderlineTo(initialActive);

let currentIndex = 0;
let isThrottled = false;
let currentScrollX = 0;
const sectionWidth = window.innerWidth;
const maxScrollX = sectionWidth * (sections.length - 1);
let sectionWidths = sections.map(section => section.offsetWidth);
let totalWidth = sectionWidths.reduce((sum, width) => sum + width, 0);
sectionsWrapper.style.width = `${totalWidth}px`;

function scrollToSection(index) {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;

    let scrollX = 0;
    for (let i = 0; i < index; i++) {
        scrollX += sectionWidths[i];
    }

    gsap.to(sectionsWrapper, {
        x: -scrollX,
        duration: 1.2,
        ease: "power2.out",
    });

    currentScrollX = scrollX;
    currentIndex = index;

    updateHeaderClass(index);
    updateWrapperBgClass(index);
    updateActiveMenuLink(index);
}

function getCurrentIndex(scrollX) {
    let accumulated = 0;
    for (let i = 0; i < sectionWidths.length; i++) {
        accumulated += sectionWidths[i];
        if (scrollX < accumulated - sectionWidths[i] / 2) return i;
    }
    return sectionWidths.length - 1;
}

let lastTouchX = null;
let lastTouchY = null;


window.addEventListener('touchmove', (e) => {
    handleScrollEvent(e, true);
}, { passive: false });

window.addEventListener('touchend', () => {
    lastTouchX = null;
    lastTouchY = null;
});

function handleScrollEvent(event, isTouchEvent = false) {
    let delta = 0;
    
    if (isTouchEvent) {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];

        if (lastTouchX === null || lastTouchY === null) {
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
            return;
        }

        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY) {
            delta = -deltaX;
        } else {
            delta = -deltaY;
        }

        const speedFactor = 1.5;
        delta *= speedFactor;
    } else {
        event.preventDefault();
        delta = event.deltaY * 1;
    }

    const section = sections[currentIndex - 1];
    let stopIndex = 0;

    if (section) {
        if (section.classList.contains('section-stop') && !section.classList.contains('section-scrolled')) {
            stopIndex = currentIndex;
        } else if (section.classList.contains('section-middle') && !section.classList.contains('section-scrolled')) {
            stopIndex = currentIndex;
        }
    }

    const stopScrollX = sectionWidths.slice(0, stopIndex).reduce((sum, w) => sum + w, 0);
    const startOfSection = sectionWidths.slice(0, currentIndex).reduce((sum, w) => sum + w, 0);
    const endOfSection = stopScrollX;

    if (section) {
        const isFullWidth = section.offsetWidth === window.innerWidth;
        const hasProductsClass = section.classList.contains('products');
        if (!(hasProductsClass && isFullWidth)) {
            section.classList.remove('slider-scrolled');
        }
        if (currentScrollX >= startOfSection) {
            section.classList.add('slider-scrolled');
        } else {
            section.classList.remove('slider-scrolled');
        }

        if (section.classList.contains('section-middle')) {
            if ((delta > 0 && currentScrollX >= endOfSection) ||
                (delta < 0 && currentScrollX <= startOfSection)) {
                return;
            }
        } else if (section.classList.contains('section-stop')) {
            if (delta > 0 && currentScrollX >= stopScrollX) {
                return;
            }
        } else if (section.classList.contains('section-end')) {
            if (delta < 0 && currentScrollX <= startOfSection) {
                return;
            }
        }
    }

    currentScrollX = Math.max(0, Math.min(currentScrollX + delta, totalWidth - window.innerWidth));

    gsap.to(sectionsWrapper, {
        x: -currentScrollX,
        duration: 0.5,
        ease: "power2.out",
    });

    const index = getCurrentIndex(currentScrollX);
    if (index !== currentIndex) {
        currentIndex = index;
        updateHeaderClass(index);
        updateWrapperBgClass(index);
        updateActiveMenuLink(index);

        const currentSection = sections[index] ?? sections[0];

        menuLinks.forEach(link => {
            link.classList.remove("active");
            if (link.parentElement) link.parentElement.classList.remove("active");
        });

        const activeLink = document.querySelector(`.header__menu a[data-index="${index}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
            document.querySelector('.header__menu').classList.remove('active');
            if (activeLink.parentElement) activeLink.parentElement.classList.add("active");
            moveUnderlineTo(activeLink);
        }

        if (index === 2) {
            currentSection.classList.remove("animated");
            currentSection.classList.add("animated");
        }

        if (currentSection.classList.contains("products")) {
            const slides = currentSection.querySelectorAll(".products__slide");
            slides.forEach(slide => {
                slide.classList.add("animated");
                slide.style.transform = '';
            });
        }
    }
}

document.querySelectorAll("ul a[data-index]").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const index = parseInt(link.getAttribute("data-index"), 10);
        if (!isNaN(index)) {
            scrollToSection(index);
        }
    });
});

function updateWrapperBgClass(index) {
    sectionsWrapper.className = sectionsWrapper.className
        .split(' ')
        .filter(c => !c.startsWith('sections-bg-'))
        .join(' ')
        .trim();
    sectionsWrapper.classList.add(`sections-bg-${index}`);
}

function updateActiveMenuLink(index) {
    menuLinks.forEach(link => {
        link.classList.remove("active");
        if (link.parentElement) link.parentElement.classList.remove("active");
    });
    const section = sections[index - 1];
    const activeLink = document.querySelector(`.header__menu a[data-index="${index}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
        document.querySelector('.header__menu').classList.remove('active');
        if (activeLink.parentElement) activeLink.parentElement.classList.add("active");
        moveUnderlineTo(activeLink);
    }
    if (index === 2) {
        const targetSection = section;
        targetSection.classList.remove("animated");
        targetSection.classList.add("animated");
    }
    if (section) {
        if (section.classList.contains("products")) {
            const slides = section.querySelectorAll(".products__slide");
            slides.forEach((slide) => {
                slide.classList.add("animated");
                slide.style.transform = '';
            });
        }
    }
}

resizeHeight();

function resizeHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', () => {
    resizeHeight();
    sectionWidths = sections.map(section => section.offsetWidth);
    totalWidth = sectionWidths.reduce((sum, width) => sum + width, 0);
    sectionsWrapper.style.width = `${totalWidth}px`;
    let newScrollX = 0;
    for (let i = 0; i < currentIndex; i++) {
        newScrollX += sectionWidths[i];
    }
    currentScrollX = newScrollX;
    gsap.set(sectionsWrapper, {
        x: -currentScrollX
    });
});

document.querySelectorAll('.section-horizontal').forEach(section => {
    const sliderEl = section.querySelector('.products__slider');
    if (!sliderEl) return;

    const swiper = new Swiper(sliderEl, {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      freeMode: false,
      speed: 600,
      simulateTouch: true,
      touchRatio: 1,
      touchStartPreventDefault: false,
      cssMode: false,
      direction: 'horizontal',
      touchMoveStopPropagation: true,
      breakpoints: {
            768: {
                speed: 1000,
            },
        },
    });



    function updateSectionClasses() {
        const isMiddle = !swiper.isBeginning && !swiper.isEnd;
        if (swiper.isLocked) {
            section.classList.remove('section-stop', 'section-end', 'section-middle');
        } else {
            if (swiper.isBeginning) {
                section.classList.remove('section-end', 'section-middle');
                section.classList.add('section-stop');
            } else if (isMiddle) {
                section.classList.remove('section-end', 'section-stop');
                section.classList.add('section-middle');
            } else if (swiper.isEnd) {
                section.classList.remove('section-stop', 'section-middle');
                section.classList.add('section-end');
            }
        }
    }

    swiper.on('slideChange', updateSectionClasses);
    swiper.on('reachEnd', updateSectionClasses);
    swiper.on('reachBeginning', updateSectionClasses);
    swiper.on('fromEdge', updateSectionClasses);

    updateSectionClasses();

    let canSlide = true;
  const slideDelay = 300;

  function trySlideTo(index) {
    if (!canSlide) return;
    canSlide = false;
    swiper.slideTo(index);
    setTimeout(() => {
      canSlide = true;
    }, slideDelay);
  }


   section.addEventListener('wheel', e => {
    e.preventDefault();

    const delta = e.deltaY;
    const isAtStart = swiper.isBeginning;
    const isAtEnd = swiper.isEnd;

    if ((delta > 0 && isAtEnd) || (delta < 0 && isAtStart)) {
        return;
    }
    swiper.slideTo(swiper.activeIndex + Math.sign(delta));
    updateSectionClasses();
}, {
    passive: false
});


    sliderEl.addEventListener('touchmove', e => {
        if (swiper.isLocked) return;
        
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];

        if (lastTouchX === null || lastTouchY === null) {
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
            return;
        }

        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY) {
            trySlideTo(swiper.activeIndex - Math.sign(deltaX));
        } else {
            trySlideTo(swiper.activeIndex - Math.sign(deltaY));
        }
        
        updateSectionClasses();
    }, { passive: false });
});


window.addEventListener("wheel", (event) => {
    event.preventDefault();

    if(window.innerWidth < 768) return;


    const section = sections[currentIndex - 1];
    let stopIndex = 0;

    if (section) {
        if (section.classList.contains('section-stop') && !section.classList.contains('section-scrolled')) {
            stopIndex = currentIndex;
        } else if (section.classList.contains('section-middle') && !section.classList.contains('section-scrolled')) {
            stopIndex = currentIndex;
        }
    }

    const stopScrollX = sectionWidths.slice(0, stopIndex).reduce((sum, w) => sum + w, 0);
    const delta = event.deltaY * 1;
    const startOfSection = sectionWidths.slice(0, currentIndex).reduce((sum, w) => sum + w, 0);
    const endOfSection = stopScrollX;

    if (section) {
        const isFullWidth = section.offsetWidth === window.innerWidth;
        const hasProductsClass = section.classList.contains('products');
        if (!(hasProductsClass && isFullWidth)) {
            section.classList.remove('slider-scrolled');
        }
        if (currentScrollX >= startOfSection) {
            section.classList.add('slider-scrolled');
        } else {
            section.classList.remove('slider-scrolled');
        }


         if (section.classList.contains('section-middle') && !section.classList.contains('section-scrolled')) {
            if ((delta > 0 && currentScrollX >= endOfSection) || 
                (delta < 0 && currentScrollX <= startOfSection)) {
                return;
            }
        } else if (section.classList.contains('section-stop') && !section.classList.contains('section-scrolled')) {
            if (delta > 0 && currentScrollX >= stopScrollX) {
                return;
            }
        } else if (section.classList.contains('section-end')) {
            if (delta < 0 && currentScrollX <= startOfSection) {
                return;
            }
        }
    }



    currentScrollX = Math.max(0, Math.min(currentScrollX + delta, totalWidth - window.innerWidth));

    gsap.to(sectionsWrapper, {
        x: -currentScrollX,
        duration: 0.5,
        ease: "power2.out",
    });

    const index = getCurrentIndex(currentScrollX);
    if (index !== currentIndex) {
        currentIndex = index;
        updateHeaderClass(index);
        updateWrapperBgClass(index);
        updateActiveMenuLink(index);

        const currentSection = sections[index - 1];

        menuLinks.forEach(link => {
            link.classList.remove("active");
            if (link.parentElement) link.parentElement.classList.remove("active");
        });

        const activeLink = document.querySelector(`.header__menu a[data-index="${index}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
            document.querySelector('.header__menu').classList.remove('active');
            if (activeLink.parentElement) activeLink.parentElement.classList.add("active");
            moveUnderlineTo(activeLink);
        }

        if (index === 2) {
            currentSection.classList.remove("animated");
            currentSection.classList.add("animated");
        }

        if (currentSection.classList.contains("products")) {
            const slides = currentSection.querySelectorAll(".products__slide");
            slides.forEach(slide => {
                slide.classList.add("animated");
                slide.style.transform = '';
            });
        }
    }
}, { passive: false });