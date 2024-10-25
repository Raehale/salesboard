import { modulesObj } from "./videoData.js"
import { projectsObj } from "./projectData.js"
import { disableBtns } from "./index.js"

const currentModuleSelect = document.getElementById("current-module")
const currentSectionSelect = document.getElementById("current-section")
const currentVideoSelect = document.getElementById("current-video")
const currentProjectsSelect = document.getElementById("current-project")

createDropdownContent()

currentModuleSelect.addEventListener("change", () => {
    createSectionDropdown()
    createVideoDropdown()
})

currentSectionSelect.addEventListener("change", () => {
    createVideoDropdown()
})

//displays the modal
export function displayGenericModal(type) {
    const modal = document.getElementById(`${type}-modal`)
    modal.style.display = "grid"

    disableBtns()
}

//hides the modal
export function hideModal(selectedModal) {
    selectedModal.style.display = "none"
}

//set dropdowns
function createDropdownContent() {
    createModuleDropdown()
    createSectionDropdown()
    createVideoDropdown()
    createProjectsDropdown()
}

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


//task completion modal
export function taskCompletionNotif(task, total) {
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