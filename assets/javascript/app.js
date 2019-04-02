
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCWaW0biS4TlExfDtXCR9HkV6zLfkhBU4c",
    authDomain: "train-time-a313d.firebaseapp.com",
    databaseURL: "https://train-time-a313d.firebaseio.com",
    projectId: "train-time-a313d",
    storageBucket: "train-time-a313d.appspot.com",
    messagingSenderId: "268042009744"
};
firebase.initializeApp(config);

const db = firebase.firestore()

//On Clicking submit, we store all the fields into the db
document.querySelector('#submit').addEventListener('click', e => {
    
    e.preventDefault()

    let id = db.collection('schedule').doc().id

    db.collection('schedule').doc(id).set({
        train: document.querySelector(`#train_name`).value,
        destination: document.querySelector(`#destination_name`).value,
        firstTrain: document.querySelector(`#train_time`).value,
        frequency: parseInt(document.querySelector(`#frequency`).value),

    })

    document.querySelector(`#train_name`).value = ''
    document.querySelector(`#destination_name`).value = ''
    document.querySelector(`#train_time`).value = ''
    document.querySelector(`#frequency`).value = ''
})


//Viewing the next arrival time along with some of the information we provided.
//Note ETA and next arrival in minutes are calculated and never stored in the db
db.collection('schedule').onSnapshot(({ docs }) => {
    
    document.querySelector('#info').innerHTML = ''

    docs.forEach(doc => {
        let { train, destination, firstTrain, frequency} = doc.data()

        calcTime(firstTrain, frequency)

        let tableBody = document.createElement('tr')
        tableBody.innerHTML = `
                <td>${train}</td>
                <td>${destination}</td>
                <td>${frequency}</td>
                <td>${eta.format("hh:mm A")}</td>
                <td>${nextArrival}</td>
            `
        document.querySelector('#info').append(tableBody)
    })

})

//variables to calculate next arrival and eta.
let nextArrival
let remainder
let eta

//Function to calculate the next time of arrival and time left until arrival.
//User must provide the initial train arrival time and frequency by submitting these values through the db
const calcTime = (firstTrain, frequency) => {
 
    let now = moment()
    let time = firstTrain
    let time2 = moment(time, "HH:mm:ss")

    //duration between first train time and current time
    let dur = now.diff(time2, 'minutes')

    //Remainder is used to calculate The time remaining until current time
    remainder = dur % parseInt(frequency)

    //If duration is greater than 0 that means the first train left before current time
    if (dur >= 0) {

        //So next arrival will be the difference between frequency and remainder of time left until current time
        //Adding nextArrival to current time will give us the next arrival time.
        nextArrival = parseInt(frequency) - remainder
        eta = now.add(nextArrival, 'minutes')

    }
    //if duration is a negative number, that means the first train has not arrived yet
    else {
        //in this case the eta is the first train arrival that the user inputs
        eta = time2
        //nextArrival is the difference between now and the first train arrival
        nextArrival = -(now.diff(time2, 'minutes'))
    }

}


// //this feature can be used in snapshot too
// //.get() returns a promise and does the same thing as snapshot
// //except it retrieves your data when you want it to than at any
// //time the db has been modified
// document.querySelector('#getData').addEventListener('click', e => {
//     //limit retreieves a certain number of docs
//     //order alphabetically or numerically depending on the type of param
//     //you can specify ascending or descending
//     db.collection('schedule').orderBy('train', 'desc').limit(2).get()
//         .then(({ docs }) => {
//             docs.forEach(doc => console.log(doc.data()))
//         })
//         .catch(e => console.error(e))
// })

// //where finds specific doc which matches the 3 parameters
// db.collection('schedule').where('train', '==', 'Dufferin East 501').limit(2).orderBy('train').get()


// //delete data  after id is stored in data
// db.collection('train').doc(target.dataset.uid).delete()