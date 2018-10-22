// m = MIDIAccess object for you to make calls on
var m = null;

var buttonMap = {
  "36" : "viz/36.js",
  "37" : "viz/37.js",
  "38" : "viz/38.js",
  "39" : "viz/39.js",
  "40" : "40 was pushed",
  "41" : "41 was pushed",
  "42" : "42 was pushed",
  "43" : "43 was pushed",
  "44" : "44 was pushed",
  "45" : "45 was pushed",
  "46" : "46 was pushed",
  "47" : "47 was pushed",
  "48" : "48 was pushed",
  "49" : "49 was pushed",
  "50" : "50 was pushed",
  "51" : "51 was pushed",
  "52" : "51 was pushed"
}

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

// this function handles which buttons are being pressed on the midifighter

function myMIDIMessagehandler(iteratorInputs) {
  let vizState;
  switch (iteratorInputs.data[0]) {
    case 146: // button press
      // refactor this, dont really want to put an if statement in a switch?
      let buttonPress = iteratorInputs.data[1];

      if (buttonMap.hasOwnProperty(buttonPress)) {
        vizState = buttonMap[buttonPress];
        console.log(buttonMap[buttonPress]);
        var scriptTag = document.createElement('script');
          scriptTag.setAttribute('src',buttonMap[buttonPress]);

          document.body.appendChild(scriptTag);

          
      }

      break;
    case 130: // button release
      console.log('button release. note #' + iteratorInputs.data[1]);
      break;
    default:
      console.log('velocity');
  }

}
function onErrorCallback(err) {
  console.log('uh-oh! Something went wrong! Error code: ' + err.code);
}