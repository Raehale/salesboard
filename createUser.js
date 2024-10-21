import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js"

const appSettings = {
    databaseURL: "https://progress-board-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)

const progressBoardInDB = ref(database, "progressBoard")

export function addSignupInfoToDB(username, module, section, video, project) {
    const userDataObj = {
        "username": username,
        "module": module,
        "section": section,
        "video": video,
        "project": project,
    }
    push(progressBoardInDB, userDataObj)
}