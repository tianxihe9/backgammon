var gl;
var points = [];
var dice = [];
var aspectRatio = 1.0;

// Setting up game constants
const WHITE = vec4(1.0, 1.0, 1.0, 1.0);
const BLACK = vec4(0.0, 0.0, 0.0, 1.0);
const GOLD = vec4(1.0, 0.84, 0.0, 1.0);
const RED = vec4(1.0, 0.0, 0.0, 1.0);
const BROWN = vec4(0.82, 0.41, 0.12, 1.0);
const SPACE_WIDTH = 50;

window.onload = function() {
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  aspectRatio = canvas.height / canvas.width;

  if (!gl) {
    alert("WebGL isn't available");
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Testing die
  var die = new Die(vec2(0, 0));
  die.roll();
  alert(die.getValue());
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
}

class Die {
  constructor(topLeft) {
    this.topLeft = vec2(topLeft[0] * aspectRatio, topLeft[1]);
    this.topRight = vec2((topLeft[0] + SPACE_WIDTH) * aspectRatio, topLeft[1]);
    this.botttomLeft = vec2(topLeft[0] * aspectRatio, -topLeft[1]);
    this.bottomRight = vec2(
      (topLeft[0] + SPACE_WIDTH) * aspectRatio,
      -topLeft[1]
    );

    this.value = 1;
  }

  getVertices() {
    return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
  }

  roll() {
    this.value = Math.floor(Math.random() * 6) + 1;
  }

  getValue() {
    return this.value;
  }
}
