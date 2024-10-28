import { modulesObj } from "./videoData.js"
import { projectsObj } from "./projectData.js"

import { createUser, loginUser } from "./handleUser.js"
import { displayGenericModal, taskCompletionNotif } from "./modal.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js"

//firebase set up
const appSettings = { databaseURL: "https://progress-board-default-rtdb.firebaseio.com/" }
const app = initializeApp(appSettings)
const database = getDatabase(app)
export const progressBoardInDB = ref(database, "progressBoard")
const signUpWrapper = document.getElementById("sign-up-wrapper")
const signInWrapper = document.getElementById("sign-in-wrapper")

// temp data, will be added to local storage
const watchedVideos = []
let loggedIn = false
let watchedToday = 0
let totalWatched = 0
let totalProjects = 0

const watchedVideoBtnEl = document.getElementById("watched-video-btn")
const projectCompleteBtnEl = document.getElementById("project-complete-btn")
const totalProjectsEl = document.getElementById("total-projects")
const overallProgLabelEl = document.getElementById("overall-prog-label")

watchedVideoBtnEl.addEventListener("click", function() {
    watchedToday++
    totalWatched++
    taskCompletionNotif("video", totalWatched)
    document.getElementById("watched-today").innerText = watchedToday
    document.getElementById("videos-watched").innerText = totalWatched
    overallProgLabelEl.innerText = `Overall Progress - ${totalWatched + totalProjects}`
    document.getElementById("overall-progress").innerText += "⏩"
})

projectCompleteBtnEl.addEventListener("click", function() {
    totalProjects++
    document.getElementById("total-projects").innerText = totalProjects
    overallProgLabelEl.innerText = `Overall Progress - ${totalWatched + totalProjects}`
    document.getElementById("overall-progress").innerText += "🏅"
    taskCompletionNotif("project", totalProjects)
})

//generic modal
const loginBtnsEl = document.getElementById("login-btns")   // section element containing sign in and sign up buttons
const logoutBtnEl = document.getElementById("logout-btn")   // section element containing log out button (not used)
const signUpBtn = document.getElementById("sign-up-btn")    // sign up button element
const signInBtn = document.getElementById("sign-in-btn")    // sign in button element
const progressBtnsArr = [watchedVideoBtnEl, projectCompleteBtnEl] // array containing Video Watched and Project Complete buttons
export const loginBtnsArr = document.querySelector("#login-btns").querySelectorAll(".btn")     // array containing sign in and sign up buttons
const createUserBtn = document.getElementById("create-user")    // Submit button for sign up form to create an account
const loginBtn = document.getElementById("login-btn")           // Submit button for login form
const logoutBtn = document.getElementById("log-out-btn")        // log out button element
const signUpForm = document.getElementById("sign-up-form")      // form element to sign up
const signInForm = document.getElementById("sign-in-form")      // form element to sign in
let isValid = false

document.addEventListener("click", event => {
    // [...event.target.classList].includes('x-out') ? (event.target.parentElement.classList.toggle('hidden'), enableBtn(signInBtn), enableBtn(signUpBtn)) :
    [...event.target.classList].includes('x-out') ? (event.target.parentElement.classList.toggle('hidden'), toggleDisableBtns(loginBtnsArr)) :
    event.target === signUpBtn ? displayGenericModal('sign-up') : 
    event.target === signInBtn ? displayGenericModal('sign-in') : 
    event.target === signInWrapper ? displayGenericModal('sign-in') :
    [...event.target.classList].includes('submit-btn') ? event.target.parentElement.parentElement.classList.toggle('hidden') : ''
})

createUserBtn.addEventListener("click", function(event) {
    createUser()
    toggleDisableBtns(progressBtnsArr)
    displayGenericModal('sign-up')
    toggleLogInOutBtns()

    loggedIn = true
})


loginBtn.addEventListener("click", function() {
    toggleDisableBtns(progressBtnsArr)
    displayGenericModal('sign-in')
    // storeLoginInfo(document.getElementById("login-username").value)
    loginUser()
    toggleLogInOutBtns()

    loggedIn = true
})

logoutBtn.addEventListener("click", function() {
    toggleDisableBtns(loginBtnsArr, progressBtnsArr)
    clearLoginInfo()
    toggleLogInOutBtns()

    loggedIn = false
})

signUpForm.addEventListener("input", function() {
    signUpForm.querySelectorAll(".modal-question").forEach(function(question) {
        if (question.value !== "") {
            isValid = true
        } else {
            isValid = false
        }
    });
    createUserBtn.disabled = !isValid
})

signInForm.addEventListener("input", function() {
    signInForm.querySelectorAll(".modal-question").forEach(function(question) {
        if (question.value !== "") {
            isValid = true
        } else {
            isValid = false
        }
    });

    loginBtn.disabled = !isValid
})

//enabling or disabling buttons
export function toggleDisableBtns(...buttonArrays){
    buttonArrays.forEach(buttonArray =>
        buttonArray.forEach(button => button.disabled = !button.disabled)
    )
}

function toggleLogInOutBtns() {
    loginBtnsEl.classList.toggle("hidden")
    logoutBtnEl.classList.toggle("hidden")
}

//handing info in local storage
export function storeLoginInfo(username) {
    localStorage.setItem('username', `${username}`)
}

function clearLoginInfo() {
    localStorage.clear()
}

//mode toggle
const modeToggleEl = document.getElementById("mode-toggle")
const titleEl = document.getElementById("title")

modeToggleEl.addEventListener("click", function() {
    modeToggleEl.classList.toggle("fa-toggle-off")
    modeToggleEl.classList.toggle("fa-toggle-on")
    if (modeToggleEl.classList.contains("fa-toggle-on")) {
        lightModeColors()
    } else {
        darkModeColors()
    }
})

function lightModeColors() {
    document.documentElement.style.setProperty("--text", "#252525")
    document.documentElement.style.setProperty("--background-one", "#DED8DD")
    document.documentElement.style.setProperty("--bubble", "#BDABC4")
    document.documentElement.style.setProperty("--background-two", "#DEA6C1")
    document.documentElement.style.setProperty("--button", "#6C4766")
    document.documentElement.style.setProperty("--accent", "#FFDF86")
    titleEl.style.textShadow = "none"
}

function darkModeColors() {
    document.documentElement.style.setProperty("--text", "#DED8DD")
    document.documentElement.style.setProperty("--background-one", "#252525")
    document.documentElement.style.setProperty("--bubble", "#44354A")
    document.documentElement.style.setProperty("--background-two", "#2D1420")
    document.documentElement.style.setProperty("--button", "#9E4770")
    document.documentElement.style.setProperty("--accent", "#FFDF86")
    titleEl.style.textShadow = "0 0 10px var(--background-one)"
}