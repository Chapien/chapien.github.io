function checkWidth() {
    let navmenu = document.getElementById("nav-menu");

    // If the device somehow gains the stick sidebar, make sure it's open
    if (!window.matchMedia('(max-device-width: 768px)').matches) {
        navmenu.open = true;
    }
}

window.onresize = function() {
    checkWidth();
};

checkWidth();

let navmenu = document.getElementById("nav-menu");

// Disable by default on mobile devices
if (window.matchMedia('(max-device-width: 768px)').matches) {
    navmenu.open = false;
}
