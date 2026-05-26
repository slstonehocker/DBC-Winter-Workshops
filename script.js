const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz5ZuLfoXWVE8hoMukorze8-iWlFEE-IYh_UXXrkJE-HNSxuteB5q0wrBZkOesPnOnAWg/exec";


let allClasses = [];

// LOAD CLASSES FROM GOOGLE SHEETS
async function loadClasses() {
    const response = await fetch(SCRIPT_URL);

    allClasses = await response.json();

    const branchDropdown =
        document.getElementById("branch");

    const branches =
        [...new Set(allClasses.map(c => c.branch))];

    branchDropdown.innerHTML =
        '<option value="">Select Branch</option>';

    for (let i = 0; i < branches.length; i++) {
        const option = document.createElement("option");

        option.value = branches[i];
        option.textContent = branches[i];

        branchDropdown.appendChild(option);
    }
}

// UPDATE CLASS DROPDOWN
function updateClasses() {
    const branch =
        document.getElementById("branch").value;

    const trainingClass =
        document.getElementById("trainingClass");

    trainingClass.innerHTML =
        '<option value="">Select Class</option>';

    const filteredClasses =
        allClasses.filter(c => c.branch === branch);

    for (let i = 0; i < filteredClasses.length; i++) {
        const option = document.createElement("option");

        option.value =
            JSON.stringify(filteredClasses[i]);

        option.textContent =
            filteredClasses[i].name;

        trainingClass.appendChild(option);
    }

    trainingClass.onchange = function () {
        if (trainingClass.value === "") {
            document.getElementById("classDescription").innerHTML = "";
            return;
        }

        const selectedClass =
            JSON.parse(trainingClass.value);

        document.getElementById("classDescription").innerHTML =
            "<strong>Description:</strong><br><br>" +
            selectedClass.description +
            "<br><br><strong>Date:</strong> " +
            formatDisplayDate(selectedClass.date) +
            "<br><strong>Time:</strong> " +
            selectedClass.time;
    };
}

// REGISTER EMPLOYEE
function registerEmployee() {
    const selectedClass =
        JSON.parse(
            document.getElementById("trainingClass").value
        );

    const employee = {
        type: "registration",
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        branch: selectedClass.branch,
        trainingClass: selectedClass.name,
        date: formatDisplayDate(selectedClass.date),
        time: selectedClass.time
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(employee)
    });

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("branch").selectedIndex = 0;
    document.getElementById("trainingClass").innerHTML =
        '<option value="">Select Class</option>';

    if (document.getElementById("classDescription")) {
        document.getElementById("classDescription").innerHTML = "";
    }

    setTimeout(function () {
        window.location.replace("confirmation.html");
    }, 1500);
}

// ADD NEW CLASS FROM ADMIN PAGE
function addClass() {
    const newClass = {
        type: "class",
        branch: document.getElementById("adminBranch").value,
        name: document.getElementById("adminClass").value,
        date: document.getElementById("adminDate").value,
        time: document.getElementById("adminTime").value,
        description: document.getElementById("adminDescription").value,
        address: document.getElementById("adminAddress").value
    };

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(newClass)
    });

    document.getElementById("adminBranch").value = "";
    document.getElementById("adminClass").value = "";
    document.getElementById("adminDate").value = "";
    document.getElementById("adminTime").value = "";
    document.getElementById("adminDescription").value = "";
    document.getElementById("adminAddress").value = "";

    alert("Class added successfully. Please see updated Google Sheet");
}

// CLEAR REGISTRATIONS AND CLASSES
function clearRegistrations() {
    const confirmClear = confirm(
        "Delete ALL registrations and classes?"
    );

    if (!confirmClear) {
        return;
    }

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            type: "clear"
        })
    });

    alert("Registrations and classes cleared.");
}

// FORMAT DATE AS M/D/YYYY
function formatDisplayDate(dateString) {
    const date = new Date(dateString);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return month + "/" + day + "/" + year;
}

// LOAD CLASSES ONLY ON EMPLOYEE PAGE
if (document.getElementById("branch")) {
    loadClasses();
}