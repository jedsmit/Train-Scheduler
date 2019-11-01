var firebaseConfig = {
    apiKey: "AIzaSyAzyiYXXVZbV6MEc_zkkfulbpjFj8_c-RE",
    authDomain: "train-scheduler-2f68d.firebaseapp.com",
    databaseURL: "https://train-scheduler-2f68d.firebaseio.com",
    projectId: "train-scheduler-2f68d",
    storageBucket: "train-scheduler-2f68d.appspot.com",
    messagingSenderId: "1042424167571",
    appId: "1:1042424167571:web:d2cf07a706df9db86e6166"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//on load, display data from firebase 

//user fills out form to add a train, presses submit button
//on submit, add form data to database
$("#submit").on("click", function (event) {
    event.preventDefault();
    //get form data
    var nameInput = $("#train-name-input").val().trim();
    var destInput = $("#destination-input").val().trim();
    var timeInput = moment($("#first-time-input").val().trim(), "HH:mm").format("X");
    var freqInput = $("#freq-input").val().trim();

    //temporary new train object
    var newTrain = {
        name: nameInput,
        destination: destInput,
        start: timeInput,
        frequency: freqInput
    };
    console.log(newTrain);

    database.ref().push(newTrain);

    //clears the form
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#freq-input").val("");

    return false;

});//end of sumbit click function

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store snapshots
    var snapName = childSnapshot.val().name;
    var snapDestination = childSnapshot.val().destination;
    var snapFirstTime = childSnapshot.val().start;
    var snapFrequency = childSnapshot.val().frequency;

    // Convert time to unix 
    var unixTime = moment.unix(snapFirstTime, "hh:mm A").subtract(1, "years");
    console.log(unixTime);

    // Do math to determine arrival

    //gets difference from start time to now
    var diffTime = moment().diff(moment(unixTime), "minutes");
    //gets remainder of frequency to now
    var timeRemainder = diffTime % snapFrequency;

    var minAway = snapFrequency - timeRemainder;

    //adds time now plus remainder to get next train time
    var nextArrival = moment().add(minAway, "minutes");

    //format next arrival time to 12 hr 
    var trainArrival = moment(nextArrival).format("hh:mm A");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(snapName),
        $("<td>").text(snapDestination),
        $("<td>").addClass("text-center").text(snapFrequency),
        $("<td>").addClass("text-center").text(trainArrival),
        $("<td>").addClass("text-center").text(minAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});





//do math with moment.js, using the the first departure time and the frequency to calculate minutes until the next departure
