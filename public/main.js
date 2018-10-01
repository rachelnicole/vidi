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

// this function handles which buttons are being pressed on the midifighter

function myMIDIMessagehandler(iteratorInputs) {
  switch (iteratorInputs.data[0]) {
    case 146: // button press
      console.log('button press. note #' + iteratorInputs.data[1]);
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