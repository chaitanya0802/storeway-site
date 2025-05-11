document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (token) {
    fetch('https://www.api.storeway.xyz/store-profile-status', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        // Store profile exists
        window.location.href = '../dashboard/dashboard.html';
      } else if (response.status === 404) {
        // Store profile does not exist
        window.location.href = '../create_store_profile/create_store_profile.html';
      } else {
        console.error('Unexpected response:', response.status);
      }
    })
    .catch(error => {
      console.error('Error checking store profile status:', error);
    });
  }
});



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






