/*
Copyright (C) 2012 Sean Whalen

Distributed under the terms of the MIT license.
 http://www.opensource.org/licenses/mit-license.html

This notice shall be included in all copies or substantial portions of the Software.
*/

// The values below may be edited

    // The amount of time to allot
    minutes = 3;
    
    // The initial volume level, between 0 and 1
    volume = 0.05;
    
    // The volume increases by this amount every second
    volumeStep = 0.01;
    
 // Do not edit below this line! 

$(document).ready(function(){
    "use strict";
    
    // Declare storage
	var remaining, elapsed, message, ui, status, soundPath, item, queue;
	
	// Get elements
	message = $("#message");
	status = $("#status");
	ui = $("#ui");
	
	
	function draw () {
		var data = [{color: "black", data: remaining},
			    {color: "white", data: elapsed}];
			    
			    $.plot($("#chart"), data,
{
        series: {
            pie: {
                show: true
            }
        }});
	}
	
	function fullScreen () {
		var docElm = document.documentElement;
		if (docElm.requestFullscreen) {
		    docElm.requestFullscreen();
		}
		else if (docElm.mozRequestFullScreen) {
		    docElm.mozRequestFullScreen();
		}
		else if (docElm.webkitRequestFullScreen) {
		    docElm.webkitRequestFullScreen();
		}
	}
	
	function exitFullScreen () {
		 if (document.exitFullscreen) {
		    document.exitFullscreen();
		}
		else if (document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		}
		else if (document.webkitCancelFullScreen) {
		    document.webkitCancelFullScreen();
		}
	}
	
	function reset () {
	    // Reset the timer
		remaining = minutes * 60;
		elapsed = 0;
		
		// Exit full screen (if needed)
		exitFullScreen();
		
		// Update the chart
		draw();
		
		// Hide the loading message
		message.hide();
		
		// Set the status message text
		status.text(minutes + " minutes");
		
		// Show the UI
		ui.show();
	}
	
	function handleFileError (e) {
	  message.text("Could not load the sound file :(");
	  message.show();
	}
	
	function tick () {
	    // Update the timer
		remaining -= 1;
		elapsed += 1;
		
		// Play the tick sound 
		createjs.SoundJS.play("tick", null , null, null, null, volume);
		
		// Update the chart
		draw();
		
		// Gradually increase the volume 
		if (volume < 1) {
			volume += volumeStep;
		}
		
		// Repeat until the time runs out
	  if (remaining > 0) {
	      // Update every second (1000 milliseconds)
	      setTimeout(function(){tick();}, 1000);
	  } else {
	      reset();
	  }
	}
	
	function start () {
		// Hide the UI
		ui.hide();
		
		// Go full screen (if supported by the browser)
		fullScreen();
		
		// Start the timer loop
		tick();
	}
	
     // Initialize the base path from this document to the Flash Plugin
     createjs.FlashPlugin.BASE_PATH = "js/vendor/";
    
    // Add the sounds to the queue
     soundPath = "sound/34855__jackstrebor__clock-ticking";
    item = {src:soundPath+".mp3|"+soundPath+".ogg", id:"tick"};
    
    // Instantiate a queue.
    queue = new createjs.PreloadJS();
    
    // Plug in SoundJS to handle browser-specific paths
    queue.installPlugin(createjs.SoundJS);
    
    // Load the sound file
    queue.onComplete = reset;
    queue.onFileError = handleFileError;
    queue.loadFile(item, true);
	
	// Check for volume control
	if (createjs.SoundJS.getCapability("volume") == false) {
	    message.text("Warning - This browser does not support volume control.");
		message.show();
	}
    
    // Bind the start function to the start button
    $("#start").click(function (event) {
        start();
        });
 });