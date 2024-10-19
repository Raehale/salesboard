// temp data, will be added to local storage
let loggedIn = false
const watchedVideos = []
let watchedToday = 0
let totalWatched = 0
let totalProjects = 0

const watchedVideoBtnEl = document.getElementById("watched-video-btn")
const projectCompleteBtnEl = document.getElementById("project-complete-btn")
const totalProjectsEl = document.getElementById("total-projects")
const overallProgLabelEl = document.getElementById("overall-prog-label")


watchedVideoBtnEl.addEventListener("click", function(){
    watchedToday++
    totalWatched++
    taskCompletionNotif("video", totalWatched)
    document.getElementById("watched-today").innerText = watchedToday
    document.getElementById("videos-watched").innerText = totalWatched
    overallProgLabelEl.innerText = `Overall Progress - ${totalWatched + totalProjects}`
    document.getElementById("overall-progress").innerText += "⏩"
})

projectCompleteBtnEl.addEventListener("click", function(){
    totalProjects++
    document.getElementById("total-projects").innerText = totalProjects
    overallProgLabelEl.innerText = `Overall Progress - ${totalWatched + totalProjects}`
    document.getElementById("overall-progress").innerText += "🏅"
    taskCompletionNotif("project", totalProjects)
})

//task completion modal
function taskCompletionNotif(task, total) {
    const taskCompletionNotifModal = document.getElementById("task-completion-notification")

    if (task === "video") {
        taskCompletionNotifModal.textContent = `You watched a new video! Total videos watched: ${total}`
    } else if (task === "project") {
        taskCompletionNotifModal.textContent = `You completed a new project! Total projects completed: ${total}`
    }

    taskCompletionNotifModal.style.display = "flex"
    setTimeout(() => {
        taskCompletionNotifModal.style.display = "none"
    }, 5000)
}

//generic modal
const loginBtnsEl = document.getElementById("login-btns")
const logoutBtnEl = document.getElementById("logout-btn")
const signUpBtn = document.getElementById("sign-up-btn")
const signInBtn = document.getElementById("sign-in-btn")
const xOutModalBtnsArr = document.querySelectorAll(".x-out")
const buttonsArr = document.querySelector("#container").querySelectorAll(".btn")
const createUserBtn = document.getElementById("create-user")
const loginBtn = document.getElementById("login-btn")
const logoutBtn = document.getElementById("log-out-btn")
const signUpForm = document.getElementById("sign-up-form")
const signInForm = document.getElementById("sign-in-form")

signUpBtn.addEventListener("click", () => {
    displayGenericModal("sign-up")
})

signInBtn.addEventListener("click", () => {
    displayGenericModal("sign-in")
})

xOutModalBtnsArr.forEach(button => {
    button.addEventListener("click", (event) => {
        hideModal(event.target.parentElement)
        enableLoginBtns()
    })
})

createUserBtn.addEventListener("click", (event) => {
    enableBtns()
    hideModal(event.target.parentElement.parentElement)
    storeLoginInfo(document.getElementById("new-username").value, document.getElementById("new-password-one").value)

    loginBtnsEl.classList.add("hidden")
    logoutBtnEl.classList.remove("hidden")

    loggedIn = true
})

loginBtn.addEventListener("click", (event) => {
    enableBtns()
    hideModal(event.target.parentElement.parentElement)
    storeLoginInfo(document.getElementById("login-username").value, document.getElementById("login-password").value)

    loginBtnsEl.classList.add("hidden")
    logoutBtnEl.classList.remove("hidden")

    loggedIn = true
})

logoutBtn.addEventListener("click", () => {
    disableBtns()
    enableLoginBtns()
    clearLoginInfo()

    loginBtnsEl.classList.remove("hidden")
    logoutBtnEl.classList.add("hidden")

    loggedIn = false
})

signUpForm.addEventListener("input", () => {
    const isValid = signUpForm.checkValidity()
    createUserBtn.disabled = !isValid
})

signInForm.addEventListener("input", () => {
    const isValid = signUpForm.checkValidity()
    createUserBtn.disabled = !isValid
})

function displayGenericModal(type) {
    const modal = document.getElementById(`${type}-modal`)
    modal.style.display = "grid"

    disableBtns()
}

function hideModal(selectedModal) {
    selectedModal.style.display = "none"
}

function enableBtns() {
    buttonsArr.forEach(button => {
        button.disabled = false;
    });
}

function disableBtns() {
    buttonsArr.forEach(button => {
        button.disabled = true;
    });
}

function enableLoginBtns() {
    signUpBtn.disabled = false;
    signInBtn.disabled = false;
}

function storeLoginInfo(username, password) {
    localStorage.setItem('username', `${username}`)
    localStorage.setItem('password', `${password}`)
}

function clearLoginInfo() {
    localStorage.clear()
}