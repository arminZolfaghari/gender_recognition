const URL = "https://api.genderize.io/";



/**
 * send request to URL (https://api.genderize.io/) with param name
 * get json response
 * @param name
 * @returns {Promise<Response>}
 */
let sendRequest = async (name) => {
    let res = await fetch(URL + `?name=${name}`);
    return res.json()
}


/**
 * get information about name (gender and probability)
 * then set in document HTML
 * @param nameInfo
 */
let setPrediction = (nameInfo) => {
    let {gender, probability} = nameInfo;
    console.log(gender)
    console.log(probability)
    document.getElementById("response-gender").innerHTML = `Gender: ${gender}`;
    document.getElementById("response-prob").innerHTML = `Prob: ${probability}`;
}

/**
 * send request to URL and get response
 * then set prediction
 */
let handleRequest = async () => {
    let inputName = document.getElementById("input-name").value;
    console.log("name ", inputName)
    let nameInfo = await sendRequest(inputName)
    setPrediction(nameInfo)
}


/**
 * when click on submit => call handle request
 * @param event
 * @returns {Promise<void>}
 */
let onSubmit = async (event) => {
    event.preventDefault()
    await handleRequest();
}






// document.getElementById('submit').onclick = onSubmit
// document.getElementById('save').onclick = saveMyAnswer