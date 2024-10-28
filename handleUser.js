import { modulesObj } from "./videoData.js"
import { projectsObj } from "./projectData.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"
import { storeLoginInfo } from "./index.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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


//create a user in firebase
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
            console.error(errorCode, errorMessage)
        })
}

function addDataToUser(userId) {
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

//log user in
export function loginUser() {
    const userEmailInputVal = document.getElementById("username-email").value
    const userPassInputVal = document.getElementById("password").value
    signInWithEmailAndPassword(auth, userEmailInputVal, userPassInputVal)
    .then((userCredential) => {
        const user = userCredential.user
        return user
    })
    .then((user) => {
        getUserData(user.auth.currentUser.uid)
    })
    .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.error(errorCode, errorMessage)
    })
}

//gets the data for a user
function getUserData(userId) {
    const userRef = ref(database, 'users/' + userId)
    onValue(userRef, (snapshot) => {
        const data = snapshot.val()
        updateDataDisplay(data)
    })
}
// export function getUserData(username, password) {
//     onValue(progressBoardInDB, function(snapshot) {
//         if (snapshot.exists()) {
//             Object.values(snapshot.val()).forEach(function(user) {
//                 if (user.username === username) {
//                     displayProgress(user)
//                 }
//             })
//         }
//     })
// }

//displays the users data
function updateDataDisplay(userData) {
    const userCurrentModule = userData.module
    const userCurrentSection = userData.section
    const userCurrentVideo = userData.video
    const userCurrentProject = userData.project
    const userCurrentUsername = userData.username
    console.log(userData)
    videosWatched(userCurrentVideo)
}
// function displayProgress(userData) {
//     videosWatched(userData.module, userData.section, userData.video)
// }
let totalVideosWatched = 0
let totalSecondsWatched = 0

//gets the total videos watched and how many hours of vieos have been watched
function videosWatched(video) {
    try {
        const totalSecondsWatched = getCurrentVideoInSeconds(video)
        const totalMinutesWatched = getTotalMinutesWatched(totalSecondsWatched)
        const totalHoursWatched = getTotalHoursWatched(totalMinutesWatched)
        displayTimeWatched(totalHoursWatched)
    } catch (error) {
        console.error("Couldn't load data:", error)
    }
    // let totalVideosWatched = 0
    // let totalSecondsWatched = 0
    // for (const module of Object.entries(modulesObj)) {
    //     for (const section of Object.entries(module[1])) {
    //         for (const video of Object.entries(section[1])) {
    //             if (video[0] !== currentvideo) {
    //                 totalVideosWatched ++
    //                 totalSecondsWatched += timeToSeconds(video[1])
    //             } else if ( video[0] === currentvideo ) {
    //                 const totalMinutesWatched = Math.ceil(totalSecondsWatched / 60)
    //                 const totalHoursWatched = Math.ceil(totalMinutesWatched / 60)
    //                 document.getElementById("videos-watched").textContent = `${totalVideosWatched}`
    //                 document.getElementById("hours-watched").textContent = `${totalHoursWatched}`
    //                 displayVideosWatched()
    //             }
    //         }
    //     }
    // }
}

function getTotalSeconds(currentVideo) {
    for (const module of Object.entries(modulesObj)) {
        getCurrentSection(module, currentVideo)
        return timeToSeconds(currentVideo)
    }
}

function getCurrentSection(moduleObj, currentVideo) {
    for (const section of Object.entries(moduleObj)) {
        return getCurrentVideoInSeconds(section, currentVideo)
    }
}

function getCurrentVideoInSeconds(sectionObj, currentVideo) {
    for (const video of Object.entries(sectionObj)) {
        if (video[0] !== currentVideo) {
            totalVideosWatched ++
            totalSecondsWatched += timeToSeconds(video[1])
        } else {
            getTotalMinutesWatched(totalSecondsWatched)
            getTotalVideosWatched(totalVideosWatched)
            
            // const totalHoursWatched = Math.ceil(totalMinutesWatched / 60)
            // document.getElementById("videos-watched").textContent = `${totalVideosWatched}`
            // document.getElementById("hours-watched").textContent = `${totalHoursWatched}`
            // return totalSecondsWatched
            // displayVideosWatched()
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

function getTotalMinutesWatched(totalSecondsWatched) {
    const totalMinutesWatched = Math.ceil(totalSecondsWatched / 60)
    getTotalHoursWatched(totalMinutesWatched)

    return totalMinutesWatched
}

function getTotalHoursWatched(totalMinutesWatched) {
    const totalHoursWatched = Math.ceil(totalMinutesWatched / 60)
    displayVideosWatched(totalHoursWatched)
    displayHoursWatched(totalHoursWatched)

    return totalHoursWatched
}

function getTotalVideosWatched(totalVideosWatched) {
    displayTotalVideosWatched(totalVideosWatched)
}

//display hours watched
function displayVideosWatched(totalHoursWatched) {
    document.getElementById("videos-watched").textContent = `${totalHoursWatched}`
}

function displayHoursWatched(totalHoursWatched) {
    document.getElementById("time-watched").textContent = `${totalHoursWatched}`
}

//display total videos watched
function displayTotalVideosWatched(getTotalVideosWatched) {
    document.getElementById("videos-watched").textContent = `${getTotalVideosWatched}`
}

//display time watched
function displayTimeWatched(totalSecondsWatched, totalMinutesWatched, totalHoursWatched) {
    //get location for time
    document.getElementById("time-watched").innerHTML = `
            <div class="watched-display-time">
                <h4>Seconds</h4>
                <p>${totalSecondsWatched}</p>
            </div>

            <div class="watched-display-time">
                <h4>Minutes</h4>
                <p>${totalMinutesWatched}</p>
            </div>

            <div class="watched-display-time">
                <h4>Hours</h4>
                <p>${totalHoursWatched}</p>
            </div>
        `
}