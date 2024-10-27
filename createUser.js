import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"
import { storeLoginInfo } from "./index.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyAlR0ikNVh9Qm0pw2mHOgFJewH1-bs5WqE",
    authDomain: "progress-board.firebaseapp.com",
    databaseURL: "https://progress-board-default-rtdb.firebaseio.com",
    projectId: "progress-board",
    storageBucket: "progress-board.appspot.com",
    messagingSenderId: "281038273058",
    appId: "1:281038273058:web:7c81b95c670e858d50287b"
};
// const appSettings = { databaseURL: "https://progress-board-default-rtdb.firebaseio.com/" }

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const progressBoardInDB = ref(database, "progressBoard")
const db = getFirestore()
const auth = getAuth()

export async function createUser() {
    const newEmailInputVal = document.getElementById("new-email").value
    const newPasswordInputVal = document.getElementById("new-password").value
    createUserWithEmailAndPassword(auth, newEmailInputVal, newPasswordInputVal)
        .then((userCredential) => {
            const user = userCredential.user
            return user
        })
        .then((user) => {
            addDataToUser(user.auth.currentUser.uid)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
        });
}

async function addDataToUser(userId) {
    const username = document.getElementById("new-username").value
    const module = document.getElementById("current-module").value
    const section = document.getElementById("current-section").value
    const video = document.getElementById("current-video").value
    const project = document.getElementById("current-project").value
    const userData = {
        "username": username,
        "module": module,
        "section": section,
        "video": video,
        "project": project,
    }
    const userRef = ref(database, 'users/' + userId)
    set(userRef, userData)
}

//creates a new user in firebase
// export function createUser() {
//     const username = document.getElementById("new-username").value
//     const module = document.getElementById("current-module").value
//     const section = document.getElementById("current-section").value
//     const video = document.getElementById("current-video").value
//     const project = document.getElementById("current-project").value

//     storeLoginInfo(username)
//     addSignupInfoToDB(username, module, section, video, project)
// }

//adds users information to firebase
// function addSignupInfoToDB(username, module, section, video, project) {
//     const userDataObj = {
//         "username": username,
//         "module": module,
//         "section": section,
//         "video": video,
//         "project": project,
//     }
//     push(progressBoardInDB, userDataObj)
// }
