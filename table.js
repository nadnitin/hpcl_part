// Function to fetch complaints by specific status
function fetchComplaints(status) {
    showLoader();
    db.collection('complaints').where('status', '==', status).get().then(snapshot => {
        const tableBody = document.querySelector('#complaints-table tbody');
        tableBody.innerHTML = ''; // Clear table content

        if (snapshot.empty) {
            // Display a message if no data exists
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">No data exists</td>
                </tr>
            `;
            hideLoader();
            return; // Exit the function
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const row = `
                <tr>
                    <td>${data.complaintId}</td>
                    <td>${data.createDate}</td>
                    <td>${data.roCode}</td>
                    <td>${data.roName}</td>
                    <td>${data.soName}</td>
                    <td>${data.riginalName}</td>
                    <td>${data.engName}</td>
                    <td>${data.reqType}</td>
                    <td>${data.partName}</td>
                    <td>${data.remark || 'N/A'}</td>
                    <td>${data.status}</td>
                    <td>${data.username}</td>
                    <td>${data.lastModifiedDate || 'N/A'}</td> <!-- Display lastModifiedDate -->                    
                    <td><button onclick="openModifyModal('${doc.id}', '${data.complaintId}', '${data.roCode}', '${data.roName}', '${data.soName}', '${data.riginalName}', '${data.engName}')">Modify</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        hideLoader(); // Hide loader after processing all documents
    }).catch(error => {
        console.error('Error fetching complaints: ', error);
        hideLoader();
    });
}


// Function to fetch all complaints regardless of status
function fetchAllComplaints() {
    db.collection('complaints').get().then(snapshot => {
        showLoader();
        const tableBody = document.querySelector('#complaints-table tbody');
        tableBody.innerHTML = ''; // Clear table content
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = `
                 <tr>
            <td>${data.complaintId}</td>
            <td>${data.createDate}</td>
            <td>${data.roCode}</td>
            <td>${data.roName}</td>
            <td>${data.soName}</td>
            <td>${data.riginalName}</td>
            <td>${data.engName}</td>
            <td>${data.reqType}</td>
            <td>${data.partName}</td>
            <td>${data.remark || 'N/A'}</td>
            <td>${data.status}</td>
            <td>${data.username}</td>
            <td>${data.lastModifiedDate || 'N/A'}</td> <!-- Display lastModifiedDate -->
            <td><button onclick="openModifyModal('${doc.id}', '${data.complaintId}', '${data.roCode}', '${data.roName}', '${data.soName}', '${data.riginalName}', '${data.engName}')">Modify</button></td>
        </tr>
            `;
            tableBody.innerHTML += row;
            hideLoader(); 
        });
    }).catch(error => {
        hideLoader(); 
        console.error('Error fetching all complaints: ', error);
    });
}

// Open modal for modifying complaint
function openModifyModal(docId, complaintId, roCode, roName, soName, riginalName, engName ) {
    const modal = document.getElementById('modifyModal');
    const username = document.getElementById('user').value;
    
    modal.style.display = 'block';
  
    // Populate form fields with complaint data
    document.getElementById('complaintId').value = complaintId;
    document.getElementById('roCode').value = roCode;
    document.getElementById('roName').value = roName;
    document.getElementById('soName').value = soName;
    document.getElementById('riginalName').value = riginalName;
    document.getElementById('engName').value = engName;
    document.getElementById('user').value = username;    
    // Handle form submission for modifying complaint status with formatted lastModifiedDate
    document.getElementById('modify-complaint-form').onsubmit = function(event) {
      event.preventDefault();   
      showLoader();
      const newStatus = document.getElementById('status').value;
      const remark = document.getElementById('remark').value;
      const username = document.getElementById('user').value;
  
      const formattedDate = formatDate(new Date()); // Use formatDate function for desired format
  
      // Update complaint in Firestore with formatted lastModifiedDate
      db.collection('complaints').doc(docId).update({
        status: newStatus,
        remark: remark,
        username: username,
        lastModifiedDate: formattedDate
      }).then(() => {
        alert('Complaint modified successfully!');
        hideLoader();
        modal.style.display = 'none';
        fetchComplaints(newStatus); // Refresh complaints view
      }).catch(error => {
        console.error('Error modifying complaint: ', error);
        hideLoader();
      });
    };
  }
  
  // Improved formatDate function (assuming you want DD-MM-YYYY HH:MM:SS)
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2,   
   '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2,   
   '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;   
  
  }

// Close modal on clicking close button
document.querySelector('.close').onclick = function() {
    document.getElementById('modifyModal').style.display = 'none';
};

// Download complaints based on date range or all data
function downloadComplaints() {
    showLoader();
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    let query = db.collection('complaints');
    if (fromDate) {
        query = query.where('createDate', '>=', new Date(fromDate));
    }
    if (toDate) {
        query = query.where('createDate', '<=', new Date(toDate));
    }

    query.get().then(snapshot => {
        const complaints = [];
        snapshot.forEach(doc => {
            complaints.push(doc.data());
        });
        // Convert complaints data to Excel
        exportToExcel(complaints);
    }).catch(error => {
        console.error('Error downloading complaints: ', error);
        hideLoader();
    });
}

// Export complaints to Excel using SheetJS (xlsx library)
// Export complaints to Excel using SheetJS (xlsx library)
function exportToExcel(complaints) {
    hideLoader();
    // Map complaints data to match the desired order and renamed headers
    const mappedComplaints = complaints.map(complaint => ({
        complaintId: complaint.complaintId,
        createDate: complaint.createDate,
        'RO Code': complaint.roCode,
        'RO Name': complaint.roName,
        'SO Name': complaint.soName,
        'Regional Office': complaint.riginalName,
        'Engineer Name': complaint.engName,
        'Request type': complaint.reqType,
        issue: complaint.issue,
        status: complaint.status,
        'Part Name': complaint.partName,
        make: complaint.make,
        size: complaint.size,
        quantity: complaint.quantity,
        'Faulty Part Serial': complaint.faultyPartSerial,
        'Last Modified Date': complaint.lastModifiedDate || 'N/A',  // Include the lastModifiedDate
        'Last Modified Remark': complaint.remark  || 'N/A', 
        'User': complaint.username, 
    }));

    // Create worksheet with the updated header names and data
    const worksheet = XLSX.utils.json_to_sheet(mappedComplaints);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");

    // Write the Excel file
    XLSX.writeFile(workbook, "complaints.xlsx");
}


// Event listeners for buttons
document.getElementById('open-btn').addEventListener('click', function() {
    fetchComplaints('Open');
});

document.getElementById('closed-btn').addEventListener('click', function() {
    fetchComplaints('Closed');
});

document.getElementById('rejected-btn').addEventListener('click', function() {
    fetchComplaints('Reject');
});

document.getElementById('reopen-btn').addEventListener('click', function() {
    fetchComplaints('Reopen');
});

document.getElementById('allcomplaint-btn').addEventListener('click', function() {
    fetchAllComplaints();
});

document.getElementById('download-btn').addEventListener('click', function() {
    downloadComplaints();
});


function showLoader() {
    document.getElementById('loader').style.display = 'flex';
    //console.log('open');
}

// Hide loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    //console.log('closed');
    //Window.location.reload();
}


function filterComplaints() {
    const searchComplaintId = document.getElementById('searchComplaintId').value.toLowerCase();
    const searchRoCode = document.getElementById('searchRoCode').value.toLowerCase();

    const rows = document.querySelectorAll('#complaints-table tbody tr');
    rows.forEach(row => {
        const complaintId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        const roCode = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

        // Show row if it matches search criteria
        if (complaintId.includes(searchComplaintId) && roCode.includes(searchRoCode)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Event listeners for search inputs
document.getElementById('searchComplaintId').addEventListener('input', filterComplaints);
document.getElementById('searchRoCode').addEventListener('input', filterComplaints);


function back(){


    window.location.href = './home.html';
  }


  var userRole = localStorage.getItem("role");

// Check if the role is "FE"
// if (userRole === "admin") {
//     // Remove the "Reopen" option from the select element
//     const statusSelect = document.getElementById("status");
//     const reopenOption = statusSelect.querySelector("option[value='Reopen']");
//     if (reopenOption) {
//       statusSelect.removeChild(reopenOption);
//     }
//   } else {
//     // Do nothing (keep all options)
//   }

 
