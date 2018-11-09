/*jshint esversion: 6 */ 

// m = MIDIAccess object for you to make calls on
var m = null;

navigator.requestMIDIAccess().then(onSuccessCallback, onErrorCallback);

function onSuccessCallback(access) {
  // If the browser supports WebMIDI, access is a native MIDIAccess
  // object. If not, it is an instance of a custom class that mimics
  // the behavior of MIDIAccess using Jazz.
  m = access;

  // Things you can do with the MIDIAccess object:

  // inputs = MIDIInputMaps, you q can retrieve the inputs with iterators
  var inputs = m.inputs;

  // outputs = MIDIOutputMaps, you can retrieve the outputs with iterators
  var outputs = m.outputs;

  // returns an iterator that loops over all inputs
  var iteratorInputs = inputs.values()

  // get the first input
  var input = iteratorInputs.next().value

  // onmidimessage(event), event.data & event.receivedTime are populated
  input.onmidimessage = myMIDIMessagehandler;

  // returns an iterator that loops over all outputs
  var iteratorOutputs = outputs.values()

  // grab first output device
  var output = iteratorOutputs.next().value;

  // full velocity note on A4 on channel zero
  output.send([0x90, 0x45, 0x7f]);
};


function onErrorCallback(err) {
  console.log('uh-oh! Something went wrong! Error code: ' + err.code);
}

// Start pixelsynth code here. you rule donald. https://pixelsynth.com/ 

// helper functions
var r = function(max){
  return Math.floor(Math.random()*max)
}

function valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
}

var Synth = function(){

  this.ctx = null
  this.imageData = null

  this.background = [0, 100, 255]
  this.foreground = [0, 255, 100]

  this.waves = [
    {
      value:0,
      counter:0,
      pulsewidth:0.5,
      wavelength1:10,
      wavelength2:50,
      threshold:1,
    },
    {
      value:0,
      counter:0,
      pulsewidth:0.5,
      wavelength1:11,
      wavelength2:50,
      threshold:1,
    },
    {
      value:0,
      counter:0,
      pulsewidth:0.25,
      wavelength1:11,
      wavelength2:50,
      threshold:1,
    },
    {
      value:0,
      counter:0,
      pulsewidth:0.5,
      wavelength1:11,
      wavelength2:50,
      threshold:1,
    }  
  ]

  this.resetSize = function(){
    width  = window.innerWidth/4
    height = window.innerHeight/4
    _canvas = document.getElementById('canvas')
    _canvas.style.width  = width+'px'
    _canvas.setAttribute('width',width)
    _canvas.style.height = height+'px'
    _canvas.setAttribute('height',height)
    this.ctx = _canvas.getContext('2d')
    this.imageData = this.ctx.getImageData(0, 0, width, height)
    return this.imageData
  }

  this.init = function(){ 
    
    this.resetSize()

    synth.randomize()
  }

  this.refreshWave = function(index){
    s = this.waves[index]
    s.value = Math.sin( s.counter ) + s.pulsewidth 
    s.counter += Math.PI * s.wavelength1 / s.wavelength2
  }

  this.randomize = function(){
    synth.background = [r(255),r(255),r(255)]
    synth.foreground = [r(255),r(255),r(255)]

    synth.waves[0].pulsewidth = r(100)/100
    synth.waves[0].wavelength1 = r(10)
    synth.waves[0].wavelength2 = r(100)
    synth.waves[0].threshold = r(150) / 100

    synth.waves[1].pulsewidth = r(100)/100
    synth.waves[1].wavelength1 = r(100)
    synth.waves[1].wavelength2 = r(1000)
    synth.waves[1].threshold = r(150) / 100

    synth.waves[2].pulsewidth = r(100)/100
    synth.waves[2].wavelength1 = r(1000)
    synth.waves[2].wavelength2 = r(10000)
    synth.waves[2].threshold = r(150) / 100
  }

  this.randomBg = function() {
    synth.background = [r(255),r(255),r(255)]
  }
  
  this.randomFg = function() {
    synth.foreground = [r(255),r(255),r(255)]
  }
}


var synth = new Synth();
synth.init();

// this function handles which buttons are being pressed on the midifighter

function myMIDIMessagehandler(iteratorInputs) {
  var midiInput = iteratorInputs.data[0];
  if (midiInput == 147 || midiInput == 146) {
    buttonControls(iteratorInputs.data[1]);
  } else {
    // tilt logic later. 
  }
}

function buttonControls(buttonData) {
  switch(buttonData) {
    case 22: // side top. all randomized
      synth.randomize();
      break;
    case 21: // side middle. random background
      synth.randomBg();
      break;
    case 20: // side bottom. random foreground
      synth.randomFg();
      break;
    // FIRST WAVE GROUP
    case 48: // synth.waves[0] pulsewidth minus
      if (synth.waves[0].pulsewidth >= 0) {
        console.log(synth.waves[0].pulsewidth = synth.waves[0].pulsewidth - .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[0].pulsewidth);
      break;
    case 49: // synth.waves[0] pulsewidth plus
      if (synth.waves[0].pulsewidth <= 2) {
        console.log(synth.waves[0].pulsewidth = synth.waves[0].pulsewidth + .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[0].pulsewidth);
      break;
    case 50: // synth.waves[0] wavelength1 minus
      if (synth.waves[0].wavelength1 >= 1) {
        console.log(synth.waves[0].wavelength1 = synth.waves[0].wavelength1 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[0].wavelength1);
      break;
    case 51: // synth.waves[0] wavelength1 plus
      if (synth.waves[0].wavelength1 < 100) {
        console.log(synth.waves[0].wavelength1 = synth.waves[0].wavelength1 + 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[0].pulsewidth);
      break;
    case 44: // synth.waves[0] wavelength2 minus
      if (synth.waves[0].wavelength2 >= 1) {
        console.log(synth.waves[0].wavelength2 = synth.waves[0].wavelength2 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[0].wavelength2);
      break;
    case 45: // synth.waves[0] wavelength2 plus
      if (synth.waves[0].wavelength2 < 100) {
        console.log(synth.waves[0].wavelength2 = synth.waves[0].wavelength2 + 5);
      } else {
        console.log('hit zero');
      }
      
      break;
    case 46: // synth.waves[0] threshold minus
      if (synth.waves[0].threshold >= 0) {
        console.log(synth.waves[0].threshold = synth.waves[0].threshold - .1);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[0].threshold);
      break;
    case 47: // synth.waves[0] threshold plus
      if (synth.waves[0].threshold < 1.5) {
        console.log(synth.waves[0].threshold = synth.waves[0].threshold + .1);
      } else {
        console.log('hit zero');
      }
      
      break;
    // SECOND WAVE GROUP
    case 40: // synth.waves[1] pulsewidth minus
      if (synth.waves[1].pulsewidth >= 0) {
        console.log(synth.waves[1].pulsewidth = synth.waves[1].pulsewidth - .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].pulsewidth);
      break;
    case 41: // synth.waves[1] pulsewidth plus
      if (synth.waves[1].pulsewidth <= 2) {
        console.log(synth.waves[1].pulsewidth = synth.waves[1].pulsewidth + .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].pulsewidth);
      break;
    case 42: // synth.waves[1] wavelength1 minus
      if (synth.waves[1].wavelength1 >= 1) {
        console.log(synth.waves[1].wavelength1 = synth.waves[1].wavelength1 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].wavelength1);
      break;
    case 43: // synth.waves[1] wavelength1 plus
      if (synth.waves[1].wavelength1 < 100) {
        console.log(synth.waves[1].wavelength1 = synth.waves[1].wavelength1 + 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].pulsewidth);
      break;
    case 36: // synth.waves[1] wavelength2 minus
      if (synth.waves[1].wavelength2 >= 1) {
        console.log(synth.waves[1].wavelength2 = synth.waves[1].wavelength2 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].wavelength2);
      break;
    case 37: // synth.waves[1] wavelength2 plus
      if (synth.waves[1].wavelength2 < 100) {
        console.log(synth.waves[1].wavelength2 = synth.waves[1].wavelength2 + 5);
      } else {
        console.log('hit zero');
      }
      
      break;
    case 38: // synth.waves[1] threshold minus
      if (synth.waves[1].threshold >= 0) {
        console.log(synth.waves[1].threshold = synth.waves[1].threshold - .1);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].threshold);
      break;
    case 39: // synth.waves[1] threshold plus
      if (synth.waves[1].threshold < 1.5) {
        console.log(synth.waves[1].threshold = synth.waves[1].threshold + .1);
      } else {
        console.log('hit zero');
      }
      
      break;
// SECOND WAVE GROUP
    case 40: // synth.waves[1] pulsewidth minus
      if (synth.waves[1].pulsewidth >= 0) {
        console.log(synth.waves[1].pulsewidth = synth.waves[1].pulsewidth - .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].pulsewidth);
      break;
    case 41: // synth.waves[1] pulsewidth plus
      if (synth.waves[1].pulsewidth <= 2) {
        console.log(synth.waves[1].pulsewidth = synth.waves[1].pulsewidth + .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].pulsewidth);
      break;
    case 42: // synth.waves[1] wavelength1 minus
      if (synth.waves[1].wavelength1 >= 1) {
        console.log(synth.waves[1].wavelength1 = synth.waves[1].wavelength1 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].wavelength1);
      break;
    case 43: // synth.waves[1] wavelength1 plus
      if (synth.waves[1].wavelength1 < 100) {
        console.log(synth.waves[1].wavelength1 = synth.waves[1].wavelength1 + 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].pulsewidth);
      break;
    case 36: // synth.waves[1] wavelength2 minus
      if (synth.waves[1].wavelength2 >= 1) {
        console.log(synth.waves[1].wavelength2 = synth.waves[1].wavelength2 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].wavelength2);
      break;
    case 37: // synth.waves[1] wavelength2 plus
      if (synth.waves[1].wavelength2 < 100) {
        console.log(synth.waves[1].wavelength2 = synth.waves[1].wavelength2 + 5);
      } else {
        console.log('hit zero');
      }
      
      break;
    case 38: // synth.waves[1] threshold minus
      if (synth.waves[1].threshold >= 0) {
        console.log(synth.waves[1].threshold = synth.waves[1].threshold - .1);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[1].threshold);
      break;
    case 39: // synth.waves[1] threshold plus
      if (synth.waves[1].threshold < 1.5) {
        console.log(synth.waves[1].threshold = synth.waves[1].threshold + .1);
      } else {
        console.log('hit zero');
      }
      
      break;

    // THIRD WAVE GROUP
    case 64: // synth.waves[2] pulsewidth minus
      if (synth.waves[2].pulsewidth >= 0) {
        console.log(synth.waves[2].pulsewidth = synth.waves[2].pulsewidth - .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[2].pulsewidth);
      break;
    case 65: // synth.waves[2] pulsewidth plus
      if (synth.waves[2].pulsewidth <= 2) {
        console.log(synth.waves[2].pulsewidth = synth.waves[2].pulsewidth + .05);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[2].pulsewidth);
      break;
    case 66: // synth.waves[2] wavelength1 minus
      if (synth.waves[2].wavelength1 >= 1) {
        console.log(synth.waves[2].wavelength1 = synth.waves[2].wavelength1 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[2].wavelength1);
      break;
    case 67: // synth.waves[2] wavelength1 plus
      if (synth.waves[2].wavelength1 < 100) {
        console.log(synth.waves[2].wavelength1 = synth.waves[2].wavelength1 + 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[2].pulsewidth);
      break;
    case 60: // synth.waves[2] wavelength2 minus
      if (synth.waves[2].wavelength2 >= 1) {
        console.log(synth.waves[2].wavelength2 = synth.waves[2].wavelength2 - 5);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[2].wavelength2);
      break;
    case 61: // synth.waves[2] wavelength2 plus
      if (synth.waves[2].wavelength2 < 100) {
        console.log(synth.waves[2].wavelength2 = synth.waves[2].wavelength2 + 5);
      } else {
        console.log('hit zero');
      }
      
      break;
    case 62: // synth.waves[2] threshold minus
      if (synth.waves[2].threshold >= 0) {
        console.log(synth.waves[2].threshold = synth.waves[2].threshold - .1);
      } else {
        console.log('hit zero');
      }
      console.log(synth.waves[2].threshold);
      break;
    case 63: // synth.waves[2] threshold plus
      if (synth.waves[2].threshold < 1.5) {
        console.log(synth.waves[2].threshold = synth.waves[2].threshold + .1);
      } else {
        console.log('hit zero');
      }
      
      break;
  }
}



// add all controls to the GUI
// var gui = new dat.GUI()

// gui.addColor(synth, 'background').listen()
// gui.addColor(synth, 'foreground').listen()

// gui.add(synth.waves[0], 'pulsewidth', 0, 2).listen()
// gui.add(synth.waves[0], 'wavelength1', 1, 100).listen()
// gui.add(synth.waves[0], 'wavelength2', 1, 100).listen()
// gui.add(synth.waves[0], 'threshold', 0, 1.5).listen()

// gui.add(synth.waves[1], 'pulsewidth', 0, 2).listen()
// gui.add(synth.waves[1], 'wavelength1', 1, 100).listen()
// gui.add(synth.waves[1], 'wavelength2', 1, 100).listen()
// gui.add(synth.waves[1], 'threshold', 0, 1.5).listen()

// gui.add(synth.waves[2], 'pulsewidth', 0, 2).listen()
// gui.add(synth.waves[2], 'wavelength1', 1, 100).listen()
// gui.add(synth.waves[2], 'wavelength2', 1, 100).listen()
// gui.add(synth.waves[2], 'threshold', 0, 1.5).listen()

// gui.add(synth, 'randomize')
// gui.add(synth, 'saveLinkToClipboard')

// on window resize also resize synth
var resizeTimer;
window.onresize = function(){
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(function(){
    synth.imageData = synth.resetSize()
  }, 100)
}




var fps = 10
function draw() {

  setTimeout( draw, 1000/fps )

  pixels = synth.imageData.data

  // set every pixel
  // each pixel is four subsequent indexes (rgba)

  for (var i = 0; i < pixels.length; i += 4) {

    synth.refreshWave(0)
    synth.refreshWave(1)
    synth.refreshWave(2)

    // default to bg color
    pixels[i]     = synth.background[0]
    pixels[i + 1] = synth.background[1]
    pixels[i + 2] = synth.background[2]
    pixels[i + 3] = 255
    
    // do fg color if threshold is met
    if( 
        synth.waves[0].value > synth.waves[0].threshold || 
        synth.waves[1].value > synth.waves[1].threshold || 
        synth.waves[2].value > synth.waves[2].threshold
      ){
  
      pixels[i]     = valBetween( synth.foreground[0] + synth.waves[0].value * 100, 0, 255)
      pixels[i + 1] = valBetween( synth.foreground[1] + synth.waves[1].value * 100, 0, 255)
      pixels[i + 2] = valBetween( synth.foreground[2] + synth.waves[2].value * 100, 0, 255)
      pixels[i + 3] = 255
    }

  }

  synth.ctx.putImageData(synth.imageData,0,0)
}

draw();