const URL = "https://api.genderize.io/";


/**
 * show message in alert-container
 * @param message {string}
 * @param messageType {string}
 * @param timeout {number}
 */
let showMessage = (message, messageType, timeout) => {
    let alert = document.getElementById('alert');
    messageType === "Error" ? alert.style.color = "red" : alert.style.color = "green"
    alert.style.borderStyle = "solid"
    alert.style.fontSize = "x-large";
    alert.style.opacity = 1;
    alert.innerHTML = message;
    setTimeout(() => {
        alert.style.opacity = 0;
    }, timeout);
}


/**
 * send request to URL (https://api.genderize.io/) with param name
 * get json response
 * @param name {string}
 * @returns {Promise<Response>}
 */
let sendRequest = async (name) => {
    try {
        let res = await fetch(URL + `?name=${name}`);
        return res.json()
    }
    catch (err){
        showMessage(err, "Error", 4000)
    }
}


/**
 * get information about name (gender and probability)
 * then set in document HTML
 * @param nameInfo {Object}
 */
let setPrediction = (nameInfo) => {
    let {gender, probability} = nameInfo;
    if (gender) {
        document.getElementById("response-gender").innerHTML = `Gender: ${gender}`;
        document.getElementById("response-prob").innerHTML = `Prob: ${probability}`;
        gender === "male" ? document.getElementById("male-button").checked = true
            : document.getElementById("female-button").checked = true
    }
    else
        showMessage(`This name doesn't exist!!!`, "Error", 5000)
}


/**
 * when we don't have saved answer, remove saved answer container
 */
let removeSavedAnswerContainer = () => {
    let savedAnswer = document.getElementById("saved-answer");
    savedAnswer.style.opacity = 0;
}

/**
 * when we have saved answer, show saved answer container
 */
let showSavedAnswerContainer = () => {
    let savedAnswer = document.getElementById("saved-answer");
    savedAnswer.style.opacity = 1;
}


/**
 * show saved answer in the right bottom of page
 * check local storage, if name exists => show gender
 * else => show nothing
 * @param name {string}
 */
let showSavedAnswer = (name) => {
    let resFromLocalStorage = getNameInfoFromLocalStorage(name);
    if (resFromLocalStorage.gender) {
        showSavedAnswerContainer()
        document.getElementById('saved-answer-gender').innerHTML = resFromLocalStorage.gender;
    }
    else {
        removeSavedAnswerContainer()
    }
        // document.getElementById('saved-answer-gender').innerHTML = "Nothing!";
}


/**
 * @returns name {string}
 */
let getNameFromInput = () => {
    return document.getElementById("input-name").value;
}


/**
 * check name with regex and length
 * @param name {string}
 */
let checkRuleForName = (name) => {
    if (!/^[a-zA-Z\s]*$/.test(name) === true)
        throw Error(`input name has bad character. change it.`)
    if (name.length > 255)
        throw Error(`input name length is more than 255 character. change it.`)
    if (/^\s*$/.test(name))     // when name is space
        throw Error(`input name is invalid. change it.`)
}


/**
 * send request to URL and get response
 * then set prediction
 */
let handleRequest = async () => {
    try{
        let inputName = getNameFromInput()
        checkRuleForName(inputName)
        let message = `Fetching information about name`
        showMessage(message, "Notice", 2000);
        let nameInfo = await sendRequest(inputName);
        // check user connection and request blocked
        if (!nameInfo){
            let errorMessage = "Request Blocked. Check your connection!!!"
            showMessage(errorMessage, "Error", 4000)
            return
        }
        setPrediction(nameInfo);
        showSavedAnswer(inputName)
    }
    catch (err) {
        showMessage(err, "Error", 4000)
    }
}


/**
 * when we haven't prediction
 */
let clearPredictionContainer = () => {
    document.getElementById("response-gender").innerHTML = `Gender:`;
    document.getElementById("response-prob").innerHTML = `Prob:`;
}

/**
 * when click on submit => call handle request
 * @param event
 * @returns {Promise<void>}
 */
let onSubmit = async (event) => {
    event.preventDefault();
    clearPredictionContainer()
    await handleRequest();
}


/**
 * get name and then search in local storage
 * if name exist in local storage => return {name, gender}
 * else => return {name, null}
 * @param name {string}
 * @returns nameInfo {Object}
 */
let getNameInfoFromLocalStorage = (name) => {
    let nameInfo = {name, gender: localStorage.getItem(name)}
    return nameInfo
}


/**
 * remove name and gender from local storage
 * @param name {string}
 */
let deleteNameInfoFromLocalStorage = (name) => {
    let resFromLocalStorage = getNameInfoFromLocalStorage(name);
    if (resFromLocalStorage.gender) {
        localStorage.removeItem(name)
        return true
    }
}


/**
 * save name and gender to local storage
 * @param nameInfo {Object}: {name: string, gender: string}
 */
let saveNameInfo = (nameInfo) => {
    let {name, gender} = nameInfo
    localStorage.setItem(name, gender)
}


/**
 * when click on save button => get nameInfo and save in local storage (saveNameInfo)
 * then show message in alert container
 * then show saved answer
 * @param event
 */
let onSave = (event) => {
    try{
        event.preventDefault();
        let gender = document.querySelector('input[name="gender"]:checked').value;
        let name = getNameFromInput();
        checkRuleForName(name)
        saveNameInfo({name, gender});
        let message = `Saved name and gender.`
        showMessage(message, "Notices", 4000)
        showSavedAnswer(name)
    }
    catch (err){
        showMessage(err, "Error", 4000)
    }
}

/**
 * when click on clear button => get name and delete name from local storage (deleteNameInfoFromLocalStorage)
 * then show saved answer
 * @param event
 */
let onClear = (event) => {
    event.preventDefault();
    let name = getNameFromInput();
    let message = `Deleted name from local storage.`
    deleteNameInfoFromLocalStorage(name) ? showMessage(message, "Notices", 4000):
    showMessage("Nothing to delete!!!", "Error", 4000);
    showSavedAnswer(name);
}

/**
 * check user connection
 */
window.addEventListener('offline', (event) => {
    showMessage("Check your connection!!!", "Error", 4000)
})





