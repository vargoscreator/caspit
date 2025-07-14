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
    header.classList.remove("scrolled", );
    if (section.classList.contains("section-main")) {} else {
        header.classList.add("scrolled");
    }
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

function scrollToSection(index) {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    currentScrollX = sectionWidth * index;
    gsap.to(sectionsWrapper, {
        x: -currentScrollX,
        duration: 1.2,
        ease: "power2.out",
    });
    currentIndex = index;
    const section = sections[index];
    const inner = section.querySelector('.section-inner');
    if (inner) {
        inner.scrollTo({ top: 0, behavior: 'auto' });
    }
    updateHeaderClass(index);
    updateWrapperBgClass(index);
    updateActiveMenuLink(index);
}


let currentScrollX = 0;
const sectionWidth = window.innerWidth;
const maxScrollX = sectionWidth * (sections.length - 1);

window.addEventListener("wheel", (event) => {
    event.preventDefault();

    const delta = event.deltaY * 1.5;
    currentScrollX += delta;

    if (currentScrollX < 0) currentScrollX = 0;
    if (currentScrollX > maxScrollX) currentScrollX = maxScrollX;

    gsap.to(sectionsWrapper, {
        x: -currentScrollX,
        duration: 0.5,
        ease: "power2.out",
    });

    
    const index = Math.round(currentScrollX / sectionWidth);
    if (index !== currentIndex) {
        currentIndex = index;
        updateHeaderClass(index);
        updateWrapperBgClass(index);

        const section = sections[index];
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
            const targetSection = sections[index];
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

let lastTouchY = null;

window.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    if (lastTouchY === null) {
        lastTouchY = touch.clientY;
        return;
    }

    const deltaY = lastTouchY - touch.clientY;
    lastTouchY = touch.clientY;
    currentScrollX += deltaY;
    if (currentScrollX < 0) currentScrollX = 0;
    if (currentScrollX > maxScrollX) currentScrollX = maxScrollX;

    gsap.to(sectionsWrapper, {
        x: -currentScrollX,
        duration: 0.4,
        ease: "power2.out",
    });
    const index = Math.round(currentScrollX / sectionWidth);
    if (index !== currentIndex) {
        currentIndex = index;
        updateHeaderClass(index);
        updateWrapperBgClass(index);
        updateActiveMenuLink(index);
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    lastTouchY = null;
});

function updateActiveMenuLink(index) {
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
        const targetSection = sections[index];
        targetSection.classList.remove("animated");
        targetSection.classList.add("animated");
    }

    const section = sections[index];
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