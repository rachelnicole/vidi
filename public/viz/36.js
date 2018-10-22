  var r = function(max){
    return Math.floor(Math.random()*max)
  }
  
  function valBetween(v, min, max) {
      return (Math.min(max, Math.max(min, v)));
  }
  
  var Synth = function(){
  
    this.ctx = null
    this.imageData = null
  
    this.background = [255, 0, 25]
    this.foreground = [5, 0, 255]
  
    this.waves = [
      {
        value:2,
        counter:0,
        pulsewidth:0.51,
        wavelength1:80.8888888880,
        wavelength2:39,
        threshold:0.9,
      },
      {
        value:0,
        counter:0,
        pulsewidth:0.28,
        wavelength1:94,
        wavelength2:115,
        threshold:0.029466553767993224,
      },
      {
        value:0,
        counter:0,
        pulsewidth:1.1664690939881457,
        wavelength1:755,
        wavelength2:6226,
        threshold:0.14,
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
  
      // get initial URL params of synth
      // used to recall synth falues from URL
      //synth.randomize()
    }
  
    this.refreshWave = function(index){
      s = this.waves[index]
      s.value = Math.sin( s.counter ) + s.pulsewidth 
      s.counter += Math.PI * s.wavelength1 / s.wavelength2
    }
  }
  
  
  var synth = new Synth()
  synth.init()
  
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