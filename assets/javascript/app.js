let eta

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

document.querySelector('#submit').addEventListener('click', e => {
    calcTime()
    e.preventDefault()

    let id = db.collection('schedule').doc().id

    db.collection('schedule').doc(id).set({
        train: document.querySelector(`#train_name`).value,
        destination: document.querySelector(`#destination_name`).value,
        firstTrain: document.querySelector(`#train_time`).value,
        frequency: parseInt(document.querySelector(`#frequency`).value),
        eta: etaDoc,
        arrival: nextArrival

    })
   // console.log(doc.id)
    //console.log(document.querySelector(`#train_time`).value)
    document.querySelector(`#train_name`).value = ''
    document.querySelector(`#destination_name`).value = ''
    document.querySelector(`#train_time`).value = ''
    document.querySelector(`#frequency`).value = ''
})



db.collection('schedule').onSnapshot(({ docs }) => {
    
    document.querySelector('#info').innerHTML = ''

    docs.forEach(doc => {
        let { train, destination, firstTrain, frequency, eta, arrival } = doc.data()

        let tableBody = document.createElement('tr')
        tableBody.innerHTML = `
                <td>${train}</td>
                <td>${destination}</td>
                <td>${frequency}</td>
                <td>${eta}</td>
                <td>${arrival}</td>
            `
        document.querySelector('#info').append(tableBody)
    })



})

let nextArrival
let remainder
const calcTime = () => {
    //let now = moment(new Date())
    let now = moment()
    //let nowM = moment(now)
    let time = document.querySelector(`#train_time`).value
    console.log(time)
    let time2 = moment(time, "HH:mm:ss")
    //let timeM =moment(time2)

    console.log(moment.isMoment(time2))
    console.log(moment.isMoment(now))

    console.log(now.format("HH:mm"))
    console.log(time2)

    console.log(now.diff(time2, 'minutes'))

    let dur = now.diff(time2, 'minutes')

    console.log(dur)
    remainder = dur % parseInt(document.querySelector(`#frequency`).value)
    console.log(remainder)



    if (dur >= 0) {

        nextArrival = parseInt(document.querySelector(`#frequency`).value) - remainder
        eta = now.add(nextArrival, 'minutes')

        console.log(eta.format("HH:mm:ss"))
        console.log(nextArrival)
        etaDoc = eta.format("HH:mm:ss")
    }
    else {
        console.log(now.format("HH:mm:ss"))
        eta = time2
        console.log(eta.format("HH:mm:ss"))
        nextArrival = -(now.diff(time2, 'minutes'))
        console.log(nextArrival)
        etaDoc = eta.format("HH:mm:ss")
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