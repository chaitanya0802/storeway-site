
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





