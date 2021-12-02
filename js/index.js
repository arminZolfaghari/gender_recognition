const URL = "https://api.genderize.io/";



let showMessage = (message) => {
    let alert = document.getElementById('alert');
    alert.style.opacity = 1;
    alert.innerHTML = message;
    setTimeout(() => {
        alert.style.opacity = 0;
    }, 3000);
}


/**
 * send request to URL (https://api.genderize.io/) with param name
 * get json response
 * @param name
 * @returns {Promise<Response>}
 */
let sendRequest = async (name) => {
    try {
        let res = await fetch(URL + `?name=${name}`);
        return res.json()
    }
    catch (err){
        showMessage(err)
    }

}


/**
 * get information about name (gender and probability)
 * then set in document HTML
 * @param nameInfo
 */
let setPrediction = (nameInfo) => {
    let {name, gender, probability} = nameInfo;
    if (gender) {
        document.getElementById("response-gender").innerHTML = `Gender: ${gender}`;
        document.getElementById("response-prob").innerHTML = `Prob: ${probability}`;
        gender === 'male' ? document.getElementById("male-button").checked = true
            : document.getElementById("female-button").checked = true
    }
    else
        showMessage(`This name (${name}) doesn't exist!!!`)
}



/**
 * show saved answer in the right bottom of page
 * check local storage, if name exists => show gender
 * else => show nothing
 * @param name
 */
let showSavedAnswer = (name) => {
    let resFromLocalStorage = getNameInfoFromLocalStorage(name);
    if (resFromLocalStorage.gender)
        document.getElementById('saved-answer-gender').innerHTML = resFromLocalStorage.gender;
    else
        document.getElementById('saved-answer-gender').innerHTML = "Nothing!";
}


/**
 * @returns {name}
 */
let getNameFromInput = () => {
    return document.getElementById("input-name").value;
}


/**
 * check name with regex and length
 * @param name
 */
let checkRuleForName = (name) => {
    console.log(name)
    if (!/^[a-zA-Z\s]*$/.test(name) === true)
        throw Error(`input name(${name}) has bad character. change it.`)
    if (name.length > 255)
        throw Error(`input name(${name}) length is more than 255 character. change it.`)
}


/**
 * send request to URL and get response
 * then set prediction
 */
let handleRequest = async () => {
    try{
        let inputName = getNameFromInput()
        checkRuleForName(inputName)
        console.log("name ", inputName);
        let nameInfo = await sendRequest(inputName);
        setPrediction(nameInfo);
        showSavedAnswer(inputName)
    }
    catch (err) {
        showMessage(err)
    }
}


/**
 * when click on submit => call handle request
 * @param event
 * @returns {Promise<void>}
 */
let onSubmit = async (event) => {
    event.preventDefault();
    await handleRequest();
}


/**
 * get name and then search in local storage
 * if name exist in local storage => return {name, gender}
 * else => return {name, null}
 * @param name
 * @returns {{gender: string, name: string}}
 */
let getNameInfoFromLocalStorage = (name) => {
    return {name, gender: localStorage.getItem(name)}
}


/**
 * remove name and gender from local storage
 * @param name
 */
let deleteNameInfoFromLocalStorage = (name) => {
    let resFromLocalStorage = getNameInfoFromLocalStorage(name);
    if (resFromLocalStorage.gender)
        localStorage.removeItem(name)
}


/**
 * save name and gender to local storage
 * @param nameInfo: {name: string, gender: string}
 */
let saveNameInfo = (nameInfo) => {
    let {name, gender} = nameInfo
    localStorage.setItem(name, gender)
}


let onSave = (event) => {
    event.preventDefault();
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let name = getNameFromInput();
    saveNameInfo({name, gender});
    let message = `Saved name: ${name}, gender: ${gender}`
    showMessage(message)

}


let onClear = (event) => {
    event.preventDefault();
    let name = getNameFromInput();
    deleteNameInfoFromLocalStorage(name);
    showSavedAnswer(name);
}





// document.getElementById('submit').onclick = onSubmit
// document.getElementById('save').onclick = saveMyAnswer