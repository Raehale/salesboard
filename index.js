import { modulesObj } from "./videoData.js"
import { projectsObj } from "./projectData.js"

import { createUser } from "./createUser.js"
import { displayGenericModal, taskCompletionNotif } from "./modal.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js"

//firebase set up
const appSettings = { databaseURL: "https://progress-board-default-rtdb.firebaseio.com/" }
const app = initializeApp(appSettings)
const database = getDatabase(app)
export const progressBoardInDB = ref(database, "progressBoard")

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
const modals = document.getElementsByClassName("modal")         // not being used, maybe cut out?
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
    storeLoginInfo(document.getElementById("login-username").value)
    getUserData(document.getElementById("login-username").value)
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

//gets the data for a user
function getUserData(username) {
    onValue(progressBoardInDB, function(snapshot) {
        if (snapshot.exists()) {
            Object.values(snapshot.val()).forEach(function(user) {
                if (user.username === username) {
                    displayProgress(user)
                }
            })
        }
    })
}

//displays the users data
function displayProgress(userData) {
    videosWatched(userData.module, userData.section, userData.video)
}

//gets the total videos watched and how many hours of vieos have been watched
function videosWatched(currentmodule, section, currentvideo) {
    let totalVideosWatched = 0
    let totalSecondsWatched = 0
    for (const module of Object.entries(modulesObj)) {
        for (const section of Object.entries(module[1])) {
            for (const video of Object.entries(section[1])) {
                if (video[0] !== currentvideo) {
                    totalVideosWatched ++
                    totalSecondsWatched += timeToSeconds(video[1])
                } else if ( video[0] === currentvideo ) {
                    const totalMinutesWatched = Math.ceil(totalSecondsWatched / 60)
                    const totalHoursWatched = Math.ceil(totalMinutesWatched / 60)

                    document.getElementById("videos-watched").textContent = `${totalVideosWatched}`
                    document.getElementById("hours-watched").textContent = `${totalHoursWatched}`
                }
            }
        }
    }
}

function timeToSeconds(currentTime) {
    const timeArr = currentTime.split(':')
    const minutes = Number(timeArr[0])
    let seconds = Number(timeArr[1])
    seconds += (minutes * 60)
    return seconds
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