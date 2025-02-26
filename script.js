
function showPopup(sectionId) {
    // Hide all popups first
    document.querySelectorAll('.chat-popup').forEach(popup => {
        popup.style.display = 'none';
    });

    // Show the selected popup
    document.getElementById(sectionId).style.display = 'flex';
}

function closePopup(sectionId) {
    document.getElementById(sectionId).style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const loader = document.querySelector(".loader");

    // Hide loader when video starts playing
    video.addEventListener("canplay", function () {
        loader.style.display = "none";
    });
});

// show intro pop as site is opened
document.addEventListener("DOMContentLoaded", function () {
    // Show the popup after 5 seconds
    setTimeout(function () {
        showPopup('intro');

        // Hide the popup after 10 seconds (5s after it appears)
        setTimeout(function () {
            closePopup('intro');
        }, 5500); // 5000ms = 5 seconds
    }, 700); // 5000ms = 5 seconds
});






