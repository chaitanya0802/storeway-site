//show and hide box
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navContent = document.querySelector(".nav-content");
  const menuToggleLabel = document.querySelector("label[for='menu-toggle']");

  document.body.addEventListener("click", function (event) {
    const clickedInsideChatPopup = event.target.closest(".chat-popup");
    const clickedInsideNavContent = event.target.closest(".nav-content");
    const clickedMenuToggle = event.target === menuToggle || menuToggle.contains(event.target);
    const clickedToggleLabel = menuToggleLabel && menuToggleLabel.contains(event.target);

    // 👉 If clicked inside nav-content, do nothing
    if (clickedInsideNavContent) return;

    // --- Handle chat popup ---
    if (!clickedInsideChatPopup) {
      const popups = document.querySelectorAll(".chat-popup");
      popups.forEach(function (popup) {
        popup.style.display = "none";
      });
    }

    // --- Handle nav menu ---
    if (!clickedMenuToggle && !clickedToggleLabel) {
      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
      }
    }
  });
});



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

