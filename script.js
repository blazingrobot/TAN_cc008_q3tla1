// Preview uploaded image
document.getElementById("photo").addEventListener("change", function() {
  const preview = document.getElementById("photoPreview");
  preview.innerHTML = "";
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "150px";
      img.style.borderRadius = "10px";
      preview.appendChild(img);
    };
    reader.readAsDataURL(this.files[0]);
  }
});

// Form submit
document.getElementById("enrollmentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Password validation
  const pass = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirmPassword").value;
  if (pass !== confirmPass) {
    alert("Passwords do not match!");
    return;
  }

  // Collect form data
  const formData = {
    firstName: document.getElementById("firstName").value,
    middleName: document.getElementById("middleName").value,
    lastName: document.getElementById("lastName").value,
    dob: document.getElementById("dob").value,
    birthLocation: document.getElementById("birthLocation").value,
    gender: document.getElementById("gender").value,
    civilStatus: document.getElementById("civilStatus").value,
    nationality: document.getElementById("nationality").value,
    religion: document.getElementById("religion").value,
    contactNumber: document.getElementById("contact").value, // fixed ID
    email: document.getElementById("email").value,
    homeAddress: document.getElementById("homeAddress").value,
    emergencyName: document.getElementById("emergencyName").value,
    emergencyRelation: document.getElementById("emergencyRelation").value,
    emergencyNumber: document.getElementById("emergencyNumber").value,
    username: document.getElementById("username").value
  };

  // Handle photo
  const photoInput = document.getElementById("photo");
  if (photoInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      formData.photo = e.target.result; // base64
      saveToPHP(formData);
      showSummary(formData);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    formData.photo = null;
    saveToPHP(formData);
    showSummary(formData);
  }
});

// Save to PHP backend (students.json)
function saveToPHP(data) {
  fetch("save.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(response => {
    console.log(response.message); 
  })
  .catch(err => console.error("Error saving data:", err));
}

// Show summary
function showSummary(data) {
  let summaryHTML = "";

  if (data.photo) {
    summaryHTML += `<p><b>Photo:</b></p><img src="${data.photo}" style="max-width:150px;border-radius:10px;margin-bottom:15px;">`;
  }

  for (let key in data) {
    if (key !== "photo") {
      summaryHTML += `<p><b>${capitalize(key)}:</b> ${data[key]}</p>`;
    }
  }

  document.getElementById("summary").innerHTML = summaryHTML;
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("summaryContainer").style.display = "block";
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Flatpickr for Date of Birth
flatpickr("#dob", {
  dateFormat: "Y-m-d",
  maxDate: "today",
  altInput: true,
  altFormat: "F j, Y",
});

// Done button - show modal
document.getElementById("doneBtn").addEventListener("click", function() {
  document.getElementById("successModal").style.display = "block";
});

// Close modal
document.getElementById("closeModal").addEventListener("click", function() {
  document.getElementById("successModal").style.display = "none";
});

// Close modal if clicked outside
window.addEventListener("click", function(e) {
  if (e.target == document.getElementById("successModal")) {
    document.getElementById("successModal").style.display = "none";
  }
});

// Toggle password visibility
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

document.getElementById("togglePassword").addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

document.getElementById("toggleConfirm").addEventListener("click", () => {
  confirmPassword.type = confirmPassword.type === "password" ? "text" : "password";
});
