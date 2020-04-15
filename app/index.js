import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import userActivity from "user-activity";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const timeLabel = document.getElementById("timeLabel");
const dateLabel = document.getElementById("dateLabel");
const stepsCirc = document.getElementById("firstCirc");
const distCirc = document.getElementById("secondCirc");
const distText = document.getElementById("distText");
const stepsText = document.getElementById("stepsText");
const minsCirc = document.getElementById("thirdCirc");
const calsText = document.getElementById("calsText");
const minsText = document.getElementById("minsText");
const stairsText = document.getElementById("stairsText");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  timeLabel.text = `${hours}:${mins}`;
  let day = today.getDate();
  let monthnum = today.getMonth();
  monthnum++;
  let year = today.getFullYear();
  
  dateLabel.text = `${day}/${monthnum} ${year}`;
  
  let stepsGoal = userActivity.goals.steps;
  let distGoal = userActivity.goals.distance;
  let dist = (userActivity.today.adjusted["distance"] || 0);
  let steps = (userActivity.today.adjusted["steps"] || 0);
  let stepsPerc = steps / stepsGoal;
  let distPerc = dist / distGoal;
  let stairsPerc = (userActivity.today.adjusted["elevationGain"] || 0) / userActivity.goals.elevationGain;
  let calsPerc = userActivity.today.adjusted["calories"] / userActivity.goals.calories;
  let minsPerc = userActivity.today.adjusted["activeMinutes"] / userActivity.goals.activeMinutes;
 
  
  distText.text = `${(dist*0.001).toFixed(1)} km`; 
  stepsText.text = `${steps}`;
  stairsText.text = userActivity.today.adjusted["elevationGain"];
  minsText.text = `${userActivity.today.adjusted["activeMinutes"]} min`;
  calsText.text = `${userActivity.today.adjusted["calories"]} kcal`;
  
  drawAngle(stepsCirc, stepsPerc, 180);
  drawAngle(distCirc, distPerc, 180);
  drawAngle(minsCirc, minsPerc, 180);
}

function drawAngle(elem, stat, max) {
  if ((stat * 180) > max) {
    stat = 1;
  }
  elem.sweepAngle = stat * 180;
}
