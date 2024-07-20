let baseUrl = "https://accosmart.com.ng/yorubalearning/api/admin/";

// function to register
function signUp(event) {
    // prevents page from refreshing
    event.preventDefault();

    // to activate spinner on button when clicked
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";
    //get value type by user
    const getName = document.getElementById("name").value;
    const getEmail = document.getElementById("email").value;
    const getPassword = document.getElementById("password").value;
    const getConfirmPassword = document.getElementById("confirmPassword").value;

    //checking for validation if user is submiting empty form
    if (getName === "" || getEmail === "" || getPassword === "" || getConfirmPassword === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })

        getSpin.style.display = "none";
    }

    if (getConfirmPassword !== getPassword) {
        Swal.fire({
            icon: 'info',
            text: 'Passwords do not match',
            confirmButtonColor: '#2D85DE'
        })

        getSpin.style.display = "none";
    }

    else {
        // converted to formdata
        const signHeader = new FormData();
        signHeader.append("name", getName);
        signHeader.append("email", getEmail);
        signHeader.append("password", getPassword);
        signHeader.append("password_confirmation", getConfirmPassword);

        const signMethod = {
            method: 'POST',
            body: signHeader
        }

        const url = "https://accosmart.com.ng/yorubalearning/api/register_admin";

        fetch(url, signMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                // delay for 5 seconds
                setTimeout(() => {
                    location.href = "index.html"
                }, 5000)
            }
            else {
                Swal.fire({
                    icon: 'danger',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}
// login function
function logIn(event) {
    event.preventDefault();

    // to activate spinner on button when clicked
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getEmail = document.getElementById("email").value;
    const getPassword = document.getElementById("password").value;

    if (getEmail === "" || getPassword === "" ) {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })

        getSpin.style.display = "none";
    }

    else {
        // converted to formdata
        const logHeader = new FormData();
        logHeader.append("email", getEmail);
        logHeader.append("password", getPassword);

        const logMethod = {
            method: 'POST',
            body: logHeader
        }

        const url = "https://accosmart.com.ng/yorubalearning/api/admin_login";

        fetch(url, logMethod)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            localStorage.setItem("admin", JSON.stringify(result))

            if (result.hasOwnProperty("email")) {
                location.href = "dashboard.html"
            }
            else {
                Swal.fire({
                    icon: 'danger',
                    text: 'All fields are required!',
                    confirmButtonColor: '#2D85DE'
                })
        
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}
function getDashData() {
    const getSpin = document.querySelector(".pagemodal");
    getSpin.style.display = "block";
    const category = document.getElementById("category")
    const lm = document.getElementById("learnmat")
    const sc = document.getElementById("subCat")
    const quiz = document.getElementById("quiz")
    const student = document.getElementById("student")
    const adminId = document.getElementById("adminId")

    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;

    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);

    const dashMethod = {
        method: 'GET',
        headers: dashHeader
    }

    const url = `${baseUrl}admin_dashboardapi`;

    fetch(url, dashMethod)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        category.innerHTML = result.total_number_of_categories;
        lm.innerHTML = result.total_number_of_learningmaterial;
        sc.innerHTML = result.total_number_of_subcategories;
        quiz.innerHTML = result.total_number_of_quize;
        student.innerHTML = result.total_number_of_students;
        adminId.innerHTML = `Hello ${result.admin_name}`
        adminId.style.color = "#2D85DE";
        adminId.style.fontSize = "20px";
        getSpin.style.display = "none";

    })
    .catch(error => console.log('error',error));
}

// function to open modal
function studentModal(event) {
    event.preventDefault();
    const student = document.querySelector(".allstudent");
    const modal = document.getElementById("dash-modal");
    modal.style.display = "block";
    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;
    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);
    const getMethod = {
        method: 'GET',
        headers: dashHeader
    }
    let data = [];
    const url = `${baseUrl}top_three_students`;
    fetch(url, getMethod)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.length === 0) {
            student.innerHTML = "No Records Found";
        }
        else {
            result.map((item) => {
                data += `
                   <div class="search-card">
                      <div class="d-flex justify-content-between">
                         <p>Name:</p>
                         <p>${item.name}</p>
                      </div>
                      <div class="d-flex justify-content-between">
                         <p>Email:</p>
                         <p>${item.email}</p>
                      </div>
                      <div class="d-flex justify-content-between">
                         <p>Phone Number:</p>
                         <p>${item.phone_number}</p>
                      </div>
                      <div class="d-flex justify-content-between">
                         <p>Total Score:</p>
                         <p>${item.total_score}</p>
                      </div>
                      <div class="d-flex justify-content-between">
                         <p>Position:</p>
                         <p>${item.position}</p>
                      </div>
                   </div>
                `
                student.innerHTML = data;
            })
        }
    })
    .catch(error => console.log('error', error));
}

function closeDashModal() {
    const modal = document.getElementById("dash-modal");
    modal.style.display = "none";
}