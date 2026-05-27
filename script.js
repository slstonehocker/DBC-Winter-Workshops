const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz5ZuLfoXWVE8hoMukorze8-iWlFEE-IYh_UXXrkJE-HNSxuteB5q0wrBZkOesPnOnAWg/exec";

let allClasses = [];

// LOAD CLASSES FROM GOOGLE SHEETS
async function loadClasses() {

    const branchDropdown =
        document.getElementById("branch");

    // Only run on employee page
    if (!branchDropdown) {
        return;
    }

    try {

        const response =
            await fetch(SCRIPT_URL);

        allClasses =
            await response.json();

        const branches =
            [...new Set(
                allClasses
                    .map(c => c.branch)
                    .filter(Boolean)
            )];

        branchDropdown.innerHTML =
            '<option value="">Select Branch</option>';

        for (let i = 0; i < branches.length; i++) {

            const option =
                document.createElement("option");

            option.value =
                branches[i];

            option.textContent =
                branches[i];

            branchDropdown.appendChild(option);
        }

    } catch (error) {

        console.error(error);

        alert(
            "Could not load classes."
        );
    }
}

// UPDATE CLASS DROPDOWN
function updateClasses() {

    const branch =
        document.getElementById("branch").value;

    const trainingClass =
        document.getElementById("trainingClass");

    const classDescription =
        document.getElementById("classDescription");

    trainingClass.innerHTML =
        '<option value="">Select Class</option>';

    classDescription.innerHTML = "";

    const filteredClasses =
        allClasses.filter(
            c => c.branch === branch
        );

    for (let i = 0; i < filteredClasses.length; i++) {

        const option =
            document.createElement("option");

        option.value =
            JSON.stringify(filteredClasses[i]);

        option.textContent =
            filteredClasses[i].name;

        trainingClass.appendChild(option);
    }
}

// SHOW CLASS DESCRIPTION
document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.id !==
            "trainingClass"
        ) {
            return;
        }

        const trainingClassValue =
            document.getElementById(
                "trainingClass"
            ).value;

        const classDescription =
            document.getElementById(
                "classDescription"
            );

        if (
            trainingClassValue === ""
        ) {

            classDescription.innerHTML = "";

            return;
        }

        const selectedClass =
            JSON.parse(
                trainingClassValue
            );

        classDescription.innerHTML =

            "<strong>Description:</strong><br><br>" +

            selectedClass.description +

            "<br><br><strong>Date:</strong> " +

            formatDisplayDate(
                selectedClass.date
            ) +

            "<br><strong>Time:</strong> " +

            selectedClass.time;
    }
);

// REGISTER EMPLOYEE
function registerEmployee() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();

    const email =
        document.getElementById(
            "email"
        ).value.trim();

    const confirmEmail =
        document.getElementById(
            "confirmEmail"
        ).value.trim();

    const phone =
        document.getElementById(
            "phone"
        ).value.trim();

    const trainingClassValue =
        document.getElementById(
            "trainingClass"
        ).value;

    if (name === "") {

        alert(
            "Please enter your name."
        );

        return;
    }

    if (email === "") {

        alert(
            "Please enter your email."
        );

        return;
    }

    if (email !== confirmEmail) {

        alert(
            "Emails do not match."
        );

        return;
    }

    if (
        trainingClassValue === ""
    ) {

        alert(
            "Please select a class."
        );

        return;
    }

    const selectedClass =
        JSON.parse(
            trainingClassValue
        );

    const employee = {

        type: "registration",

        name: name,

        email: email,

        phone: phone,

        branch:
            selectedClass.branch,

        trainingClass:
            selectedClass.name,

        date:
            formatDisplayDate(
                selectedClass.date
            ),

        time:
            selectedClass.time,

        address:
            selectedClass.address
    };

    fetch(SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        body:
            JSON.stringify(employee)
    });

    setTimeout(function () {

        window.location.replace(
            "confirmation.html"
        );

    }, 1500);
}

// ADD CLASS FROM ADMIN PAGE
function addClass() {

    const branch =
        document.getElementById(
            "adminBranch"
        ).value.trim();

    const className =
        document.getElementById(
            "adminClass"
        ).value.trim();

    const date =
        document.getElementById(
            "adminDate"
        ).value.trim();

    const time =
        document.getElementById(
            "adminTime"
        ).value.trim();

    const description =
        document.getElementById(
            "adminDescription"
        ).value.trim();

    const address =
        document.getElementById(
            "adminAddress"
        ).value.trim();

    if (
        branch === "" ||
        className === "" ||
        date === "" ||
        time === ""
    ) {

        alert(
            "Please fill out branch, class name, date, and time."
        );

        return;
    }

    const newClass = {

        type: "class",

        branch: branch,

        name: className,

        date: date,

        time: time,

        description:
            description,

        address: address
    };

    fetch(SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        body:
            JSON.stringify(newClass)
    });

    setTimeout(function () {

        alert(
            "Class submitted. Check the Classes tab."
        );

        document.getElementById(
            "adminBranch"
        ).value = "";

        document.getElementById(
            "adminClass"
        ).value = "";

        document.getElementById(
            "adminDate"
        ).value = "";

        document.getElementById(
            "adminTime"
        ).value = "";

        document.getElementById(
            "adminDescription"
        ).value = "";

        document.getElementById(
            "adminAddress"
        ).value = "";

    }, 1500);
}

// CLEAR REGISTRATIONS + CLASSES
function clearRegistrations() {

    const confirmClear =
        confirm(
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

    alert(
        "Registrations and classes cleared."
    );
}

// FORMAT DATE
function formatDisplayDate(
    dateString
) {

    const date =
        new Date(dateString);

    if (isNaN(date)) {
        return dateString;
    }

    const month =
        date.getMonth() + 1;

    const day =
        date.getDate();

    const year =
        date.getFullYear();

    return (
        month +
        "/" +
        day +
        "/" +
        year
    );
}

// LOAD CLASSES
loadClasses();