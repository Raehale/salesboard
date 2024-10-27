import { push } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js"
import { storeLoginInfo, progressBoardInDB } from "./index.js";

//creates a new user in firebase
export function createUser() {
    const username = document.getElementById("new-username").value
    const module = document.getElementById("current-module").value
    const section = document.getElementById("current-section").value
    const video = document.getElementById("current-video").value
    const project = document.getElementById("current-project").value

    storeLoginInfo(username)
    addSignupInfoToDB(username, module, section, video, project)
}

//adds users information to firebase
function addSignupInfoToDB(username, module, section, video, project) {
    const userDataObj = {
        "username": username,
        "module": module,
        "section": section,
        "video": video,
        "project": project,
    }
    push(progressBoardInDB, userDataObj)
}
