document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.products__slider').forEach((slider, index) => {
        new Swiper(slider, {
            loop: false,
            spaceBetween: 20,
            slidesPerView: 1.2,
            allowTouchMove: true,
            breakpoints: {
                480: {
                    spaceBetween: 25,
                    slidesPerView: 1.5,
                },
                768: {
                    spaceBetween: 25,
                    slidesPerView: 2.5,
                },
                1000: {
                    spaceBetween: 25,
                    slidesPerView: 3,
                },
                1280: {
                    spaceBetween: 32,
                    slidesPerView: 4,
                },
            },
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
    gsap.to(sectionsWrapper, {
        x: -window.innerWidth * index,
        duration: 2,
        ease: "power2.out",
    });
    const section = sections[index];
    const inner = section.querySelector('.section-inner');
    if (inner) {
        inner.scrollTo({ top: 0, behavior: 'auto' });
    }
    currentIndex = index;
    updateHeaderClass(index);
    updateWrapperBgClass(index);
    menuLinks.forEach(link => {
        link.classList.remove("active");
        if (link.parentElement) {
            link.parentElement.classList.remove("active");
        }
    });
    if (index <= 3) {
        const activeLink = document.querySelector(`.header__menu a[data-index="${index}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
            if (activeLink.parentElement) {
                activeLink.parentElement.classList.add("active");
            }
            document.querySelector('.header__menu').classList.remove("active");
            moveUnderlineTo(activeLink);
        }
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
ScrollTrigger.create({
    trigger: ".main-wrapper",
    start: "top top",
    end: () => "+=" + window.innerWidth * (sections.length - 1),
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
    onRefresh: () => {
        scrollToSection(currentIndex);
    }
});
let readyToSwitch = false;
let switchTimeout;
window.addEventListener("wheel", (event) => {
    if (isThrottled) return;
    const section = sections[currentIndex];
    const inner = section.querySelector('.section-inner');
    const hasVerticalScroll = inner && inner.scrollHeight > inner.clientHeight;
    console.log(hasVerticalScroll)
    if (hasVerticalScroll) {
        const scrollTop = inner.scrollTop;
        const scrollBottom = scrollTop + inner.clientHeight;
        const isAtBottom = scrollBottom >= inner.scrollHeight - 1;
        const isAtTop = scrollTop <= 1;
        if (event.deltaY > 0) {
            if (!isAtBottom) {
                readyToSwitch = false;
                return;
            } else if (!readyToSwitch) {
                readyToSwitch = true;
                clearTimeout(switchTimeout);
                switchTimeout = setTimeout(() => readyToSwitch = false, 500); // сброс через 0.5с
                return;
            }
        }
        if (event.deltaY < 0) {
            if (!isAtTop) {
                readyToSwitch = false;
                return;
            } else if (!readyToSwitch) {
                readyToSwitch = true;
                clearTimeout(switchTimeout);
                switchTimeout = setTimeout(() => readyToSwitch = false, 500);
                return;
            }
        }
    }
    if (event.deltaY > 0 && currentIndex < sections.length - 1) {
        scrollToSection(currentIndex + 1);
    } else if (event.deltaY < 0 && currentIndex > 0) {
        scrollToSection(currentIndex - 1);
    }

    isThrottled = true;
    setTimeout(() => (isThrottled = false), 1000);
});

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

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchMoveY = 0;
let isTouchScrolling = false;
window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && !e.target.closest('.products__slider')) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
});
window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1 && !e.target.closest('.products__slider')) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const thresholdX = 50;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > thresholdX && !isThrottled) {
                if (diffX < 0 && currentIndex < sections.length - 1) {
                    scrollToSection(currentIndex + 1);
                    isThrottled = true;
                    setTimeout(() => (isThrottled = false), 1000);
                } else if (diffX > 0 && currentIndex > 0) {
                    scrollToSection(currentIndex - 1);
                    isThrottled = true;
                    setTimeout(() => (isThrottled = false), 1000);
                }
            }
        }
    }
});
let holdTimer = null;
let holdStartTime = null;
window.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1 || isThrottled) return;
    const section = sections[currentIndex];
    const inner = section.querySelector('.section-inner');
    if (!inner || inner.scrollHeight <= inner.clientHeight) return;
    const scrollTop = inner.scrollTop;
    const scrollBottom = scrollTop + inner.clientHeight;
    const isAtBottom = scrollBottom >= inner.scrollHeight - 1;
    const isAtTop = scrollTop <= 1;
    const currentY = e.touches[0].clientY;
    const diffY = touchStartY - currentY;
    const threshold = 30;
    if (Math.abs(diffY) < threshold) {
        clearTimeout(holdTimer);
        holdTimer = null;
        holdStartTime = null;
        return;
    }
    if (diffY > 0 && isAtBottom) {
        if (!holdStartTime) {
            holdStartTime = Date.now();
            holdTimer = setTimeout(() => {
                scrollToSection(currentIndex + 1);
                holdStartTime = null;
                isThrottled = true;
                setTimeout(() => isThrottled = false, 1000);
            }, 10);
        }
    } else if (diffY < 0 && isAtTop) {
        if (!holdStartTime) {
            holdStartTime = Date.now();
            holdTimer = setTimeout(() => {
                scrollToSection(currentIndex - 1);
                holdStartTime = null;
                isThrottled = true;
                setTimeout(() => isThrottled = false, 1000);
            }, 100);
        }
    } else {
        clearTimeout(holdTimer);
        holdTimer = null;
        holdStartTime = null;
    }
});
window.addEventListener('touchend', () => {
    clearTimeout(holdTimer);
    holdTimer = null;
    holdStartTime = null;
});
resizeHeight()
function resizeHeight(){
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', () => {
  resizeHeight()
});