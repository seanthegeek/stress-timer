/*
Copyright (C) 2012 Sean Whalen

Distributed under the terms of the MIT license.
 http://www.opensource.org/licenses/mit-license.html

This notice shall be included in all copies or substantial portions of the Software.
 */

// These values below may be edited
    minutes = 3;
    
    // Volume between 0 and 1
    volume = 0.05;
    volumeStep = 0.01;
    
 // Do not edit below this line! 

$(document).ready(function(){
    "use strict";
    
	var remaining, elapsed;
	
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
		remaining = minutes * 60;
		elapsed = 0;
		
		createjs.SoundJS.stop();
		exitFullScreen();
		
		draw();
		$("#message").hide();
		$("#status").text(minutes + " minutes");
		$("#ui").show();
	}
	
	function handleFileError (e) {
	  var message = $("#message");
	  message.text("Could not load the sound file :(");
	  message.show();
	}
	
	function init () {
	     var soundPath, item, queue;

		 // Initialize the base path from this document to the Flash Plugin
		 createjs.FlashPlugin.BASE_PATH = "js/vendor/";
		
		// Add the sounds to the queue
		 soundPath = "sound/34855__jackstrebor__clock-ticking";
		item = {src:soundPath+".mp3|"+soundPath+".ogg", id:"tick"};
		
		// Instantiate a queue.
		queue = new createjs.PreloadJS();
		
		// Plug in SoundJS to handle browser-specific paths
		queue.installPlugin(createjs.SoundJS);
		
		// Load the file
		queue.onComplete = reset;
		queue.onFileError = handleFileError;
		queue.loadFile(item, true);
	}
	
	function tick () {
		remaining -= 1;
		elapsed += 1;
		draw();
		if (volume < 1) {
			volume += volumeStep;
			createjs.SoundJS.setVolume(volume);	
		}
	  if (remaining > 0) {
	      // Update every second
	      setTimeout(function(){tick();}, 1000);
	  } else {
	      reset();
	  }
	}
	
	function start () {
		$("#ui").hide();
		fullScreen();
		createjs.SoundJS.play("tick", null , null, null, -1, volume);
		tick();
	}
	   $("#start").click(function (event) {
        start();
    });

	init();
 });