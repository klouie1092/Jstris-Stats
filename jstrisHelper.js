// Used when I need to ensure that the extension is working properly by adding a red border to the edge of the window
// document.body.style.border = "5px solid red";


//Functions for later
function updateDiv(minutesPlayed, lastTime, bestTime, gamesPlayed, averageTime, ao10){
  let temp = '';
  temp += "Minutes Played: " + minutesPlayed + "<br>";
  temp += "Last Run: " + lastTime + "<br>";
  temp += "Best Run: " + bestTime + "<br>";
  temp += "Games Played: " + gamesPlayed + "<br>";
  temp += "Average Time: " + averageTime + "<br><br> Last 10: <br>";
  for(let i = 0; i < last10.length; i++){
    temp += (i + 1) + ": " + last10[i] + "s<br>"
  }
  temp += "Average of 10: " + ao10
  document.getElementById('statisticsDiv').innerHTML = temp;
}

function updateStats(inputString){
  //Updates the custom stats page

  //Keeps hands from dying
  if (minutesPlayed > 60){
    alert("What the fuck are you doing stop");}
	
  //First converts the time into seconds
  let temp = inputString.split(":");
  let timeSeconds = 0
  if(temp.length > 1){
    timeSeconds = 60 * parseFloat(temp[0]) + parseFloat(temp[1])
  }
  else{
    timeSeconds = parseFloat(temp[0])
  }

  //Then does things with the found time
  if(timeSeconds < bestTime){
    bestTime = timeSeconds;
  }
  gamesPlayed += 1;
  averageTime = (averageTime * (gamesPlayed - 1) + timeSeconds) / gamesPlayed
  last10.push(timeSeconds);
  if(last10.length > 10){
    last10.shift();
  }
  if(last10.length == 10){
    let sum = 0
    for(let i = 0; i < last10.length; i++){
      sum += last10[i]
    }
    updateDiv(minutesPlayed + " minutes", timeSeconds + "s", bestTime + "s", gamesPlayed, Math.round(averageTime * 1000) / 1000 + "s", Math.round(sum / last10.length*1000)/1000 + "s")
  }
  else{
    updateDiv(minutesPlayed + " minutes", timeSeconds + "s", bestTime + "s", gamesPlayed, Math.round(averageTime * 1000) / 1000, "Not Enough Runs Yet")
  }

}






// Finds certain portions of the jstris page that I need to affect
var targetNode = document.getElementById('chatBox');
var otherGames = document.getElementById('gameSlots');
var gamesPlayed = 0;
var bestTime = Infinity;
var averageTime = 10;
var last10 = [];
var minutesPlayed = 0;

//Custom text field over the other games in order to display certain statistics
var statisticsDiv = document.createElement("div");
var rect = otherGames.getBoundingClientRect();
statisticsDiv.style.position = 'absolute';
statisticsDiv.style.top = Math.floor(rect.top + 5) + "px";
statisticsDiv.style.left = Math.floor(rect.left) + "px";
statisticsDiv.style.width = Math.floor(rect.right - rect.left) + "px";
statisticsDiv.style.height = Math.floor(rect.bottom - rect.top) + "px";
statisticsDiv.style.zIndex = "10";
statisticsDiv.style.backgroundColor = 'black';
statisticsDiv.style.textAlign = 'left';
statisticsDiv.setAttribute("id","statisticsDiv")
document.body.appendChild(statisticsDiv);
updateDiv('No Runs Yet','No Runs Yet',gamesPlayed, 'No Runs Yet', "Not Enough Runs Yet")



//Creates the timer function that keeps me from destroying my hands
setInterval(function(){minutesPlayed++;}, 60000);

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
  for(var mutation of mutationsList) {
      if (mutation.type == 'childList') {
          // eventText = mutation.addedNodes[mutation.addedNodes.length - 1].textContent
          eventText = mutation.addedNodes[mutation.addedNodes.length - 1].innerHTML
          if(eventText[0] == "S"){
            eventText = eventText.split("<")[1].split(" ")[0].slice(2,eventText.length)
            updateStats(eventText)

          }
      }
  }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
