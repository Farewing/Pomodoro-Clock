var width = 960,
    height = 400,
    radius = 60,
    x = Math.sin(2 * Math.PI / 3),
    y = Math.cos(2 * Math.PI / 3);

var speed = 4,
	offset = 0,
    start = Date.now(); 


function gear(d) {
  var n = d.teeth,
      r2 = Math.abs(d.radius),
      r0 = r2 - 8,
      r1 = r2 + 8,
      r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 24) : 20,
      da = Math.PI / n,
      a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
      i = -1,
      path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];

  while (++i < n) path.push(
      "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
      "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
      "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
      "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));

  path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");

  return path.join("");
}

$(document).ready(function() {

$("a,input,button").focus(function(){this.blur()});


var flag = 0,
	pre = 1,
	workDuration = 1500,
	breakDuration = 300;
var stopDuration = workDuration;

d3.timer(function() {
	    angle = (Date.now() - start) * speed,
      	transform = function(d) { return "rotate(" + angle / d.radius + ")"; };
 	frame.selectAll("path").attr("transform", transform);
 // svg.attr("transform", "rotate(" + (angle / (5 * radius)) + ")");
    frame.attr("transform", transform); // frame of reference
});

$("#start").on("click",function() {
	if(flag == 0 || flag == 2) {
		flag = pre;
		//var angle = (Date.now() - start) * speed;
    	frame.datum({radius: Infinity});
      	svg.attr("transform", "rotate(" + (offset += angle / (radius * 5)) + ")");
		Timer(stopDuration);
		$("#start").text("Stop");		
		$("#show").css("color", "rgb(91,192,222)");

	} else {	
		pre = flag;
		flag = 2;	
		//var angle = (Date.now() - start) * speed;
		frame.datum({radius: radius * 5});
      	svg.attr("transform", "rotate(" + (offset += 0 - angle / (radius * 5)) + ")");
		clearInterval(refresh);
		$("#start").text("Start");
		$(".display").css("opacity", "0.8");
		$("#show").text("Stop ...");
		stopDuration = counter;		
	} 
});

function Timer(duration) {
	counter = duration;

	if (flag == 1) {
		$("#show").empty();
		$("#show").text("Timing ...");
		$(".display").css("opacity", "1");
	} else if(flag == 3) {
		$("#show").text("Break ...");
		$(".display").css("opacity", "0.8");
	}

	refresh = setInterval(function(){
     	showTime(counter);
        if (--counter < 0) {
        	clearInterval(refresh);
        	flag = (flag == 3) ? 1 : 3;
        	console.log(flag);
        	if(flag == 3) {
        		Timer(breakDuration);
        	} else if(flag == 1){
        		Timer(workDuration);     		
        	}
        } 

	}, 1000);
}


function showTime(num) {
	var min = parseInt(num / 60),
		sec = parseInt(num % 60);

	var strTime = String(min < 10 ? "0" + min : min) + String(sec < 10 ? "0" + sec : sec);
	$("#timer1").text(strTime[0]);
	$("#timer2").text(strTime[1]);
	$("#timer4").text(strTime[2]);
	$("#timer5").text(strTime[3]);
}

$("#reset").on("click", function() {
	workDuration = 1500;
	breakDuration = 300;
	flag = 0;
	pre = 1;
	stopDuration = workDuration;
	showTime(workDuration);
	$("#show").empty().html("<br>");
	clearInterval(refresh);
	$("#start").text("Start");
	$(".display").css("opacity", "0.4");
	frame.datum({radius: radius * 5});
    svg.attr("transform", "rotate(" + (offset += 0 - angle / (radius * 5)) + ")");
});

$("#deBreak").on("click", function() {
	var tt = parseInt($("#breakTime").html(), 10);
	if(flag == 0 && tt >= 1) {
		breakDuration = (tt - 1) * 60;
		$("#breakTime").text(breakDuration / 60);
	}
});

$("#inBreak").on("click", function() {
	var tt = parseInt($("#breakTime").html(), 10);
	if(flag == 0 && tt < 99) {
		breakDuration = (tt + 1) * 60;
		$("#breakTime").text(breakDuration / 60);
	}
});

$("#deTime").on("click", function() {
	var tt = parseInt($("#workTime").html(), 10);
	if(flag == 0 && tt >= 1) {
		workDuration = (tt - 1) * 60;
		stopDuration = workDuration;
		$("#workTime").text(workDuration / 60);
		showTime(workDuration);
	}
});

$("#inTime").on("click", function() {
	var tt = parseInt($("#workTime").html(), 10);
	if(flag == 0 && tt < 99) {
		workDuration = (tt + 1) * 60;
		stopDuration = workDuration;
		$("#workTime").text(workDuration / 60);
		showTime(workDuration);
	}
});


var svg = d3.select(".gear").append("svg")
            .attr("width", width)
            .attr("height", height)
         .append("g")
            .attr("transform", "translate(" + width / 4 + "," + 203 + ")scale(.55)")
            .attr("fill", "red")
         .append("g");

var frame = svg.append("g")
               .datum({radius: radius * 5});

frame.append("g")
     .attr("class", "annulus")
     .datum({teeth: 60, radius: -radius * 5, annulus: true})
  .append("path")
     .attr("d", gear);

frame.append("g")
     .attr("class", "sun")
     .datum({teeth: 12, radius: radius})
  .append("path")
     .attr("d", gear);

frame.append("g")
     .attr("class", "planet")
     .attr("transform", "translate(0,-" + radius * 3 + ")")
     .datum({teeth: 24, radius: -radius * 2})
  .append("path")
     .attr("d", gear);

frame.append("g")
     .attr("class", "planet")
     .attr("transform", "translate(" + -radius * 3 * x + "," + -radius * 3 * y + ")")
     .datum({teeth: 24, radius: -radius * 2})
  .append("path")
     .attr("d", gear);

frame.append("g")
     .attr("class", "planet")
     .attr("transform", "translate(" + radius * 3 * x + "," + -radius * 3 * y + ")")
     .datum({teeth: 24, radius: -radius * 2})
  .append("path")
     .attr("d", gear);

});