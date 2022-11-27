// Variables
const menu = document.querySelector(".menu-container");
const hamburger = document.querySelector(".collapsed-menu")
// const settings = document.querySelector(".settings");

// Media query for menu @ (width: 190px)
let menuChildren = document.querySelector('.menu-container').children;
console.log(menuChildren);

// ============================
// Click Events
// ============================

// Open hamburger menu
hamburger.addEventListener('click', function() {
    menu.classList.toggle('active');
});
