
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCW1nYQP3wHP6QcVso64-LNxNs04NncFFQ",
  authDomain: "train-activity-bd087.firebaseapp.com",
  databaseURL: "https://train-activity-bd087.firebaseio.com",
  projectId: "train-activity-bd087",
  storageBucket: "train-activity-bd087.appspot.com",
  messagingSenderId: "640587826388"
};

firebase.initializeApp(config);


var database = firebase.database();

// general variables
  var trainName = "";
  var trainDestination = "";
  var trainTime = "";
  var trainFrequency = "";


  $(".form-field").on("keyup", function () {

      var traintemp = $("#train-name").val().trim();
      var citytemp = $("#destination").val().trim();
      var timetemp = $("#first-train").val().trim();
      var freqtemp = $("#frequency").val().trim();

      sessionStorage.setItem("train", traintemp);
      sessionStorage.setItem("city", citytemp);
      sessionStorage.setItem("time", timetemp);
      sessionStorage.setItem("freq", freqtemp);
  });

  $("#train-name").val(sessionStorage.getItem("train"));
  $("#destination").val(sessionStorage.getItem("city"));
  $("#first-train").val(sessionStorage.getItem("time"));
  $("#frequency").val(sessionStorage.getItem("freq"));

  $("#submit").on("click", function (event) {
    event.preventDefault();

    if ($("#train-name").val().trim() === "" ||
      $("#destination").val().trim() === "" ||
      $("#first-train").val().trim() === "" ||
      $("#frequency").val().trim() === "") {

      alert("Please fill in all details to add new train");

  } else {

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    $(".form-field").val("");

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    sessionStorage.clear();
  }

});

database.ref().on("child_added", function (childSnapshot) {
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;

  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

  if (minToArrival < 6) {
    newrow.addClass("info");
  }

  $("#train-table-rows").append(newrow);

});

$(document).on("click", ".arrival", function () {
  keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
});



setInterval(function () {
  window.location.reload();
}, 60000);



