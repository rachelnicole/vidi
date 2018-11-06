// m = MIDIAccess object for you to make calls on
var m = null;

navigator.requestMIDIAccess().then(onSuccessCallback, onErrorCallback);

function onSuccessCallback(access) {
  // If the browser supports WebMIDI, access is a native MIDIAccess
  // object. If not, it is an instance of a custom class that mimics
  // the behavior of MIDIAccess using Jazz.
  m = access;

  // Things you can do with the MIDIAccess object:

  // inputs = MIDIInputMaps, you can retrieve the inputs with iterators
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

var r = function(max){
  return Math.floor(Math.random()*max)
}

function valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
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

  this.saveLinkToClipboard = function(){

    var url = '/?'
    url += 'pulsewidth1='+synth.waves[0].pulsewidth
    url += '&wavelength1A='+synth.waves[0].wavelength1
    url += '&wavelength1B='+synth.waves[0].wavelength2
    url += '&threshold1='+synth.waves[0].threshold
    url += '&pulsewidth2='+synth.waves[1].pulsewidth
    url += '&wavelength2A='+synth.waves[1].wavelength1
    url += '&wavelength2B='+synth.waves[1].wavelength2
    url += '&threshold2='+synth.waves[1].threshold
    url += '&pulsewidth3='+synth.waves[2].pulsewidth
    url += '&wavelength3A='+synth.waves[2].wavelength1
    url += '&wavelength3B='+synth.waves[2].wavelength2
    url += '&threshold3='+synth.waves[2].threshold
    url += '&bgRed='+synth.background[0]
    url += '&bgGreen='+synth.background[1]
    url += '&bgBlue='+synth.background[2]
    url += '&fgRed='+synth.foreground[0]
    url += '&fgGreen='+synth.foreground[1]
    url += '&fgBlue='+synth.foreground[2]

    window.history.replaceState({}, 'Jagged Pixel Synth', url)
    copyTextToClipboard(window.location.host+url)

  }
}


var synth = new Synth()
synth.init()

// this function handles which buttons are being pressed on the midifighter

function myMIDIMessagehandler(iteratorInputs) {
  console.log(iteratorInputs)
  switch (iteratorInputs.data[0]) {
    case 147: // side button press
      buttonControls(iteratorInputs.data[1]);

      break;
    case 146: // button press
      // refactor this, dont really want to put an if statement in a switch?
      console.log('button press');
      buttonControls(iteratorInputs.data[1]);
      
      break;
    case 130: // button release
      console.log('button release. note #' + iteratorInputs.data[1]);
      break;
    default:
      
  }
}

function buttonControls(buttonData) {
  switch(buttonData) {
    case 28: // side top. all randomized
      synth.randomize();
      break;
    case 27: // side middle. random background
    
      break;
    case 26: // side bottom. random foreground
    
      break;
    case 48: //
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