var pm = document.querySelector('#pm');
var send = document.querySelector('#send');
var msg =document.querySelector('#msg');
var video = document.querySelector('video');


'use strict'

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
	audio: false,
	video:
			{ 
			  width: 500, 
			  height: 320,
			  frameRate: 2
			}
		    
};


function successCallback(stream){
	
	var Peer = require('simple-peer');
	var p = new Peer({ 
			initiator: location.hash === '#sender', 
			trickle: false,
			stream: stream 
	});

	p.on('error', function (err) { console.log('error', err) });

	p.on('signal', function (data) {
	  document.querySelector('#outgoing').textContent = JSON.stringify(data)
	});

	document.querySelector('form').addEventListener('submit', function (ev) {
	  ev.preventDefault();
	  p.signal(JSON.parse(document.querySelector('#incoming').value))
	});

	p.on('connect', function () {
	  console.log('CONNECTED');
	});

	send.addEventListener('click',()=>{
	     p.send(pm.value);
	});

	p.on('data',(data)=>{
	  msg.innerHTML += data + '<br>';
	});

	p.on('stream', stream=>{
        window.stream = stream;
		if(window.URL){
			video.src = window.URL.createObjectURL(stream);
		}else{
			video.src = stream;
		}     
	});
};


function errorCallback(error){
	console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

