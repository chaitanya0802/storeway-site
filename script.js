
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




