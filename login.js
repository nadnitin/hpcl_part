





async function validate() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  activateLoader();

  try {
      // Fetch user data (use caching to avoid repeated requests)
      const data = await fetchUserData();

      const userdata = data?.content;
      console.log(userdata);

      if (userdata && userdata.length > 0) {
          const foundUser = userdata.find(
              user => user[0] === username && user[1] === b64EncodeUnicode(password)
          );

          if (foundUser) {
              localStorage.setItem("username", username);
              localStorage.setItem("name", "secrate");
              localStorage.setItem("role", foundUser[2]);
              localStorage.setItem("state", foundUser[4]);
              localStorage.setItem("account_status", foundUser[3]);

              if (foundUser[3] === "active") {
                  window.location = "home.html";
              } else {
                  deactivateLoader();
                  alert("Your account is inactive. Please contact your administrator.");
              }
          } else {
              deactivateLoader();
              alert("Incorrect username or password. Please try again.");
          }
      } else {
          deactivateLoader();
          alert("No user data found.");
      }
  } catch (error) {
      console.error("Error validating user:", error);
      deactivateLoader();
      alert("An error occurred while logging in. Please try again.");
  }
}

// Fetch user data from the server (with caching)
async function fetchUserData() {
  if (!sessionStorage.getItem("userData")) {
      const response = await fetch(
          `https://script.google.com/macros/s/AKfycbxsBreQO2Ct2LMKi4Vl57JG2rnVZEyW3Qq3uXtMTygZ8E68q3gWI_vy-dS2L0KxTaFc_A/exec?action=getData&nocache=${Date.now()}`
      );
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
          throw new Error(data.error);
      }

      // Cache the data in sessionStorage
      sessionStorage.setItem("userData", JSON.stringify(data));
  }

  return JSON.parse(sessionStorage.getItem("userData"));
}


  


document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form
  document.getElementById("form_id").addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      login();
  });
});



function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username === '' && password === '') {
    localStorage.setItem("role", "FE");
    localStorage.setItem("name", "secrate");
    window.location = "home.html";
  } else {
    validate();
  }
}






// Function to encode string to Base64
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16))
  }))
}

// Function to decode string from Base64
function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(""))
}


function activateLoader() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('submit').style.display = 'none';
 
}

// Deactivate loader and remove blur
function deactivateLoader() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('submit').style.display = 'block';
 
}

function disableRightClick(event) {
  event.preventDefault(); // Prevent default right-click behavior
}

// Add event listener to the document for the contextmenu event (right-click)
document.addEventListener('contextmenu', disableRightClick);       
