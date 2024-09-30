const firebaseConfig = {
    apiKey: "AIzaSyDshNbtBvPHO5y9ul6l5vzft8QH1RL6sUk",
    authDomain: "hpcl-25bf8.firebaseapp.com",
    projectId: "hpcl-25bf8",
    storageBucket: "hpcl-25bf8.appspot.com",
    messagingSenderId: "776035241101",
    appId: "1:776035241101:web:3939dad26cab06c0baa6c4",
    measurementId: "G-T29TFQG9WP"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = firebase.firestore(); 

  
  // Function to generate auto-incrementing Complaint ID starting from H202401
  function generateComplaintId() {
      return db.collection('complaints').orderBy('complaintId', 'desc').limit(1).get()
          .then(snapshot => {
              if (!snapshot.empty) {
                  const lastComplaintId = snapshot.docs[0].data().complaintId;
                  const newIdNumber = parseInt(lastComplaintId.replace("H", "")) + 1;
                  return `H${newIdNumber.toString()}`;
              } else {
                  return "H202401"; // Starting ID
              }
          });
  }
  
  // Handle form submission
  // Function to get current date in Indian format
// Function to format date
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

// Update the form submission function
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission
    document.getElementById('complaint-form').addEventListener('submit', function(event) {
        event.preventDefault();
        startLoader();
        // Generate Complaint ID
        generateComplaintId().then(complaintId => {
            // Get the current date and time in the desired format
            const currentDate = formatDate(new Date());

            // Collect form data
            const complaintData = {
                complaintId: complaintId,
                createDate: currentDate,
                roCode: document.getElementById('roCode').value,
                roName: document.getElementById('roName').value,
                soName: document.getElementById('soName').value,
                riginalName: document.getElementById('riginalName').value,
                engName: document.getElementById('engName').value,
                issue: document.getElementById('issue').value,
                status: "Open",  // Set default status to "Open"
                reqType: document.getElementById('reqType').value,
                partName: document.getElementById('partName').value,
                make: document.getElementById('make').value,
                size: document.getElementById('size').value,
                quantity: document.getElementById('quantity').value,
                faultyPartSerial: document.getElementById('faultyPartSerial').value,
                username: document.getElementById('user').value
            };

            // Add complaint to Firestore
            db.collection('complaints').add(complaintData)
                .then(() => {
                    alert(`Complaint submitted successfully! Complaint ID: ${complaintId}`);
                    stopLoader();
                    document.getElementById('complaint-form').reset();

                })
                .catch(error => {
                    console.error('Error adding complaint: ', error);
                    stopLoader();
                });
        });
    });

    // Handle dependent dropdowns
    document.getElementById('partName').addEventListener('change', function() {
        const part = this.value;
       
        updateMakeOptions(part);
    });

    document.getElementById('make').addEventListener('change', function() {
        const make = this.value;
        updateSizeOptions(make);
    });
});

//Dependend Dropdown Start

const partsData = {
    
    'Motherboard': { makes: { 'Asrock': ['FREE'], 'ECS': ['FREE'], 'Maxtang': ['FREE'], 'New Maxtang': ['FREE'], 'Punache': ['FREE'] } }, 
    'RS232 Expantion Board': { makes: { 'ATOS': ['FREE'] } },
    'MSATA SLC 32GB': { makes: { 'ATOS': ['32GB'] } },
    '4GB RAM': { makes: { 'ATOS': ['4GB'] } },
    'Highspeed RS485 card': { makes: { 'ATOS': ['FREE'] } },
    'DCON': { makes: { 'ATOS': ['1CH', '2CH'] } },
    'BATTERY': { makes: { 'Exide': ['FREE'] } },
    '230VAC to 12V With Battery SMPS': { makes: { 'Nutek/Span': ['FREE'] } },
    '230VAC To 48V DC SMPS': { makes: { 'Nutek/Span': ['FREE'] } },
    '230VAC To 12V DC SMPS': { makes: { 'Nutek/Span': ['FREE'] } },
    '48VAC To 12VDC SMPS': { makes: { 'Nutek/Span': ['FREE'] } },
    'Flote Kit': { makes: { 'SBEM': ['MS', 'HSD'], 'START': ['MS', 'HSD'],'SBEM DLI': ['MS', 'HSD'],'Veeder Root': ['MS', 'HSD'] } },
    
    'ATG Probe': { makes: { 'SBEM L MS': ['2Mtr', '2.25Mtr', '2.5Mtr', '3Mtr', '3.5Mtr'], 
      'SBEM L HSD': ['2Mtr', '2.25Mtr', '2.5Mtr', '3Mtr', '3.5Mtr'],
      'SBEM DLI MS': ['2Mtr', '2.25Mtr', '2.5Mtr', '3Mtr', '3.5Mtr'], 
      'SBEM DLI HSD': ['2Mtr', '2.25Mtr', '2.5Mtr', '3Mtr', '3.5Mtr'],
      'Start ItaliATOS MS': ['2Mtr', '2.25Mtr', '2.5Mtr', '3Mtr', '3.5Mtr'], 
      'Start ItaliATOS HSD': ['2Mtr', '2.25Mtr', '2.5Mtr', '3Mtr', '3.5Mtr'],
      'Veeder Root MS': ['6Feet', '7Feet', '7.5Feet', '8Feet', '8.5Feet', '9Feet'],
      'Veeder Root HSD': ['6Feet', '7Feet', '7.5Feet', '8Feet', '8.5Feet', '9Feet']    
    } },
    
    
      'Brasif Card /zener barrier': { makes: { 'SBEM': ['FREE'], 'START': ['FREE'],'SBEM DLI': ['FREE'] } },
    'Monitor': { makes: { 'Zebronics': ['14"', '20"'] } },
    'KeyBoard': { makes: { 'Zebronics': ['FREE'] } },
    'Mouse': { makes: { 'Zebronics': ['FREE'] } },
    'Printer Motor': { makes: { 'APS': ['FREE'] } },
    '2 pair CABLE': { makes: { 'ATOS': ['20Mtr'] } }
};




function updateMakeOptions(part) {
    const makeSelect = document.getElementById('make');
    const sizeSelect = document.getElementById('size');
    makeSelect.innerHTML = '<option value="">Select Make</option>';
    sizeSelect.innerHTML = '<option value="">Select Size</option>';

    if (partsData[part]) {
        Object.keys(partsData[part].makes).forEach(make => {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });
    }
}

function updateSizeOptions(make) {
    const part = document.getElementById('partName').value;
    const sizeSelect = document.getElementById('size');
    sizeSelect.innerHTML = '<option value="">Select Size</option>';

    if (partsData[part] && partsData[part].makes[make]) {
        partsData[part].makes[make].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }
}
// Dependent Dropdown END
// Start loader function

function startLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('container').style.display = 'none';
  }
  
  function stopLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('container').style.display = '';
  }
// End loader function


function getSitedetails() {
    var ro_code = document.getElementById("roCode").value;
    if (ro_code) {
      if (roDataArr.length === 0) {
        console.warn("RO DATA is not yet loaded.");
        return; // Exit if roDataArr is not populated
      }
  
      const dataIndex = roDataArr.findIndex(el => el[0] == ro_code);
      const selectedro = roDataArr[dataIndex];
      if (selectedro && selectedro.length > 0) {
        document.getElementById('roName').value = selectedro[1];
        document.getElementById('soName').value = selectedro[2];
        document.getElementById('riginalName').value = selectedro[3];
      }
    }
  }

  function loaddata() {
    startLoader();
  
    fetch('https://script.google.com/macros/s/AKfycbxeWgGJiKXDadqdnXXqsdx9b4Ojjk6RKWXU5oMQNcP2q37NcIOIyBDo5qOwWnr-F0xRjA/exec')
      .then(res => res.json())
      .then(data => {
        const rodata = data?.content1;
        stopLoader();
  
        if (rodata && rodata.length > 0) {
          roDataArr = rodata;
  
          // Call getSitedetails after roDataArr is populated
          getSitedetails(); 
        }
      });
  }
  
  function table(){


    window.location.href = './table.html';
  }

  function empty() {
    var x = document.getElementById("roCode").value;
    var y = document.getElementById("roName").value;
  
    if (x === "") {
      alert("Please Enter RO code");
      return;
    }
  
    else if (y === "") {
      alert("RO not found contact your administrator");
    }
  
  }
  
  function Resetname() {
    if (document.getElementById("roCode").click) {
      document.getElementById("roName").value = "";
      document.getElementById("soName").value = "";
      document.getElementById("riginalName").value = "";
  
    }
  }

  function logout()
{
  
    window.location = "./index.html"; 

    localStorage.setItem("name","logout");
    localStorage.setItem("state","");
    localStorage.setItem("role","");
    localStorage.setItem("username","");
    localStorage.setItem("account_status","");

}

  
  
