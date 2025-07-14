document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.products__slider').forEach((slider, index) => {
        new Swiper(slider, {
            loop: false,
            spaceBetween: 20,
            slidesPerView: "auto",
            allowTouchMove: true,
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const textSpan = document.querySelector(".hero__btn-text");
    const textPath = textSpan.querySelector("textPath");
    const content = textSpan.getAttribute("data-text");
    textPath.textContent = content;

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
    if(index !== 0) header.classList.add("scrolled");
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
const sectionWidths = sections.map(section => section.offsetWidth);
const totalWidth = sectionWidths.reduce((sum, width) => sum + width, 0);



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

    const section = sections[index];
    const inner = section.querySelector('.section-inner');
    if (inner) inner.scrollTo({ top: 0, behavior: 'auto' });

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


window.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = event.deltaY * 1.5;
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

        const section = sections[index - 1];
        menuLinks.forEach(link => {
            link.classList.remove("active");
            if (link.parentElement) link.parentElement.classList.remove("active");
        });
        const activeLink = document.querySelector(`.header__menu a[data-index="${index}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
            if (activeLink.parentElement) activeLink.parentElement.classList.add("active");
            moveUnderlineTo(activeLink);
        }
        if (index === 2) {
            const targetSection = section;
            targetSection.classList.remove("animated");
            targetSection.classList.add("animated");
        }  
        if (section.classList.contains("products")) {
            const slides = section.querySelectorAll(".products__slide");
            slides.forEach((slide) => {
                slide.classList.add("animated");
                slide.style.transform = '';
            });
        }
    }
}, { passive: false });


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

let lastTouchX = null;
let lastTouchY = null;

window.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (lastTouchY === null || lastTouchX === null) {
        lastTouchY = touch.clientY;
        lastTouchX = touch.clientX;
        return;
    }
    const deltaY = lastTouchY - touch.clientY;
    const deltaX = lastTouchX - touch.clientX;
    lastTouchY = touch.clientY;
    lastTouchX = touch.clientX;
    const combinedDelta = deltaY + deltaX;
    currentScrollX += combinedDelta;
    if (currentScrollX < 0) currentScrollX = 0;
    if (currentScrollX > totalWidth - window.innerWidth) {
        currentScrollX = totalWidth - window.innerWidth;
    }

    gsap.to(sectionsWrapper, {
        x: -currentScrollX,
        duration: 0.4,
        ease: "power2.out",
    });

    const index = getCurrentIndex(currentScrollX);
    if (index !== currentIndex) {
        currentIndex = index;
        updateHeaderClass(index);
        updateWrapperBgClass(index);
        updateActiveMenuLink(index);
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    lastTouchY = null;
    lastTouchX = null;
});


function updateActiveMenuLink(index) {
    menuLinks.forEach(link => {
        link.classList.remove("active");
        if (link.parentElement) link.parentElement.classList.remove("active");
    });
    const section = sections[index - 1];
    const activeLink = document.querySelector(`.header__menu a[data-index="${index}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
        if (activeLink.parentElement) activeLink.parentElement.classList.add("active");
        moveUnderlineTo(activeLink);
    }
    if (index === 2) {
        const targetSection = section;
        targetSection.classList.remove("animated");
        targetSection.classList.add("animated");
    }
    if (section.classList.contains("products")) {
        const slides = section.querySelectorAll(".products__slide");
        slides.forEach((slide) => {
            slide.classList.add("animated");
            slide.style.transform = '';
        });
    }
}


resizeHeight()
function resizeHeight(){
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', () => {
  resizeHeight()
});