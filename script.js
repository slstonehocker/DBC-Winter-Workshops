const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz5ZuLfoXWVE8hoMukorze8-iWlFEE-IYh_UXXrkJE-HNSxuteB5q0wrBZkOesPnOnAWg/exec";


let allClasses = [];
let adminSelectedClass = null;

// LOAD CLASSES
async function loadClasses() {

    const branchDropdown =
        document.getElementById("branch");

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

// UPDATE CLASSES
function updateClasses() {

    const branch =
        document.getElementById(
            "branch"
        ).value;

    const trainingClass =
        document.getElementById(
            "trainingClass"
        );

    const classDescription =
        document.getElementById(
            "classDescription"
        );

    trainingClass.innerHTML =
        '<option value="">Select Class</option>';

    if (classDescription) {
        classDescription.innerHTML = "";
    }

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

// SHOW DESCRIPTION
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
            !classDescription
        ) {
            return;
        }

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

            selectedClass.time +

            "<br><strong>Instructor:</strong> " +

            selectedClass.teacher +

            "<br><strong>Lunch Provided:</strong> " +

            selectedClass.lunch;
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
            selectedClass.address,

        description:
            selectedClass.description,

        teacher:
            selectedClass.teacher,

        lunch:
            selectedClass.lunch
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

// ADD CLASS
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

    const teacher =
        document.getElementById(
            "adminTeacher"
        ).value.trim();

    const lunch =
        document.getElementById(
            "adminLunch"
        ).value.trim();

    const newClass = {

        type: "class",

        branch: branch,

        name: className,

        date: date,

        time: time,

        description:
            description,

        address: address,

        teacher: teacher,

        lunch: lunch
    };

    fetch(SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        body:
            JSON.stringify(newClass)
    });

    setTimeout(function () {

        alert(
            "Class added."
        );

        clearAdminForm();

        loadAdminClasses();

    }, 1500);
}

// LOAD ADMIN CLASSES
async function loadAdminClasses() {

    const existingClassDropdown =
        document.getElementById(
            "existingClass"
        );

    if (!existingClassDropdown) {
        return;
    }

    const response =
        await fetch(SCRIPT_URL);

    allClasses =
        await response.json();

    existingClassDropdown.innerHTML =
        '<option value="">Select Existing Class</option>';

    for (let i = 0; i < allClasses.length; i++) {

        const option =
            document.createElement("option");

        option.value =
            JSON.stringify(allClasses[i]);

        option.textContent =
            allClasses[i].branch +
            " - " +
            allClasses[i].name;

        existingClassDropdown.appendChild(option);
    }
}

// LOAD CLASS INTO FORM
function loadClassForEditing() {

    const existingClassDropdown =
        document.getElementById(
            "existingClass"
        );

    if (
        existingClassDropdown.value === ""
    ) {
        return;
    }

    adminSelectedClass =
        JSON.parse(
            existingClassDropdown.value
        );

    document.getElementById(
        "adminBranch"
    ).value =
        adminSelectedClass.branch;

    document.getElementById(
        "adminClass"
    ).value =
        adminSelectedClass.name;

    document.getElementById(
        "adminDate"
    ).value =
        formatDisplayDate(
            adminSelectedClass.date
        );

    document.getElementById(
        "adminTime"
    ).value =
        adminSelectedClass.time;

    document.getElementById(
        "adminDescription"
    ).value =
        adminSelectedClass.description;

    document.getElementById(
        "adminAddress"
    ).value =
        adminSelectedClass.address;

    document.getElementById(
        "adminTeacher"
    ).value =
        adminSelectedClass.teacher || "";

    document.getElementById(
        "adminLunch"
    ).value =
        adminSelectedClass.lunch || "";
}

// CLEAR ADMIN FORM
function clearAdminForm() {

    const fields = [

        "adminBranch",

        "adminClass",

        "adminDate",

        "adminTime",

        "adminDescription",

        "adminAddress",

        "adminTeacher",

        "adminLunch"
    ];

    for (let i = 0; i < fields.length; i++) {

        const field =
            document.getElementById(
                fields[i]
            );

        if (field) {
            field.value = "";
        }
    }
}

// FORMAT DATE
function formatDisplayDate(
    dateString
) {

    const date =
        new Date(dateString);

    if (isNaN(date)) {
        return dateString || "";
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

// LOAD PAGE
document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadClasses();

        loadAdminClasses();
    }
);