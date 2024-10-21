import { modulesObj } from "./videoData.js"
import { projectsObj } from "./projectData.js"

import { addSignupInfoToDB } from "./createUser.js"

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
let isValid = false

document.querySelectorAll(".login-btn").forEach(submitBtn => {
    submitBtn.addEventListener("click", () => {
        displayGenericModal(`${submitBtn.dataset.modalType}`)
        enableBtn(submitBtn)
    })
})
signUpBtn.addEventListener("click", () => {
    displayGenericModal("sign-up")
})

signInBtn.addEventListener("click", () => {
    displayGenericModal("sign-in")
})

xOutModalBtnsArr.forEach(button => {
    button.addEventListener("click", event => {
        const currentModal = event.target.parentElement
        hideModal(currentModal)
        document.querySelectorAll(".login-btn").forEach(submitBtn => {
            enableBtn(submitBtn)
        })
    })
})

createUserBtn.addEventListener("click", (event) => {
    const username = document.getElementById("new-username").value
    const module = document.getElementById("current-module").value
    const section = document.getElementById("current-section").value
    const video = document.getElementById("current-video").value
    const project = document.getElementById("current-project").value
    const signUpModal = event.target.parentElement.parentElement

    storeLoginInfo(username)
    addSignupInfoToDB(username, module, section, video, project)
    enableBtns()
    hideModal(signUpModal)

    loginBtnsEl.classList.add("hidden")
    logoutBtnEl.classList.remove("hidden")

    loggedIn = true
})

loginBtn.addEventListener("click", (event) => {
    enableBtns()
    hideModal(event.target.parentElement.parentElement)
    storeLoginInfo(document.getElementById("login-username").value)
    getUserData(document.getElementById("login-username").value)

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
    signUpForm.querySelectorAll(".modal-question").forEach(question => {
        if (question.value !== "") {
            isValid = true
        } else {
            isValid = false
        }
    });
    createUserBtn.disabled = !isValid
})

signInForm.addEventListener("input", () => {
    signInForm.querySelectorAll(".modal-question").forEach(question => {
        if (question.value !== "") {
            isValid = true
        } else {
            isValid = false
        }
    });
    loginBtn.disabled = !isValid
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

function enableBtn(button) {
    button.disabled = false
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
}

function clearLoginInfo() {
    localStorage.clear()
}

const currentModuleSelect = document.getElementById("current-module")
const currentSectionSelect = document.getElementById("current-section")
const currentVideoSelect = document.getElementById("current-video")

createModuleDropdown()
createSectionDropdown()
createVideoDropdown()

currentModuleSelect.addEventListener("change", () => {
    createSectionDropdown()
    createVideoDropdown()
})

currentSectionSelect.addEventListener("change", () => {
    createVideoDropdown()
})

function createModuleDropdown() {
    currentModuleSelect.innerHTML = ""
    for (const module of Object.entries(modulesObj)) {
        currentModuleSelect.innerHTML += `
                <option value="${module[0]}">
                    ${module[0]}
                </option>
            `
    }
}

function createSectionDropdown() {
    currentSectionSelect.innerHTML = ""
    for (const module of Object.entries(modulesObj)) {
        if (module[0] == currentModuleSelect.value) {
            for (const section of Object.entries(module[1])) {
                currentSectionSelect.innerHTML += `
                    <option value="${section[0]}">
                        ${section[0]}
                    </option>
                `
            }
        }
    }
}

function createVideoDropdown() {
    currentVideoSelect.innerHTML = ""
    for (const module of Object.entries(modulesObj)) {
        if (module[0] == currentModuleSelect.value) {
            for (const section of Object.entries(module[1])) {
                if (section[0] == currentSectionSelect.value) {
                    for (const video of Object.entries(section[1])) {
                        currentVideoSelect.innerHTML += `
                            <option value="${video[0]}">
                                ${video[0]}
                            </option>
                        `
                    }
                }
            }
        }
    }
}

const currentProjectsSelect = document.getElementById("current-project")

createProjectsDropdown()

function createProjectsDropdown() {
    currentProjectsSelect.innerHTML = ""
    for (const group of Object.entries(projectsObj)) {
        const groupOfProjects = group[1].map(project => {
            return `<option value="${project}">${project}</option>`
        })
        currentProjectsSelect.innerHTML += `
                <optgroup label="${group[0]}">
                    ${groupOfProjects}
                </optgroup>
            `
    }
}


function getUserData(username) {
    onValue(progressBoardInDB, function(snapshot) {
        if (snapshot.exists()) {
            console.log(Object.values(snapshot.val()))
            Object.values(snapshot.val()).forEach(user => {
                if (user.username === username) {
                    displayProgress(user)
                }
            })
        }
    })
}

function displayProgress(userData) {
    console.log(userData)
    videosWatched(userData.module, userData.section, userData.video)
}

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
                    // console.log(secondsToMinutes)

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