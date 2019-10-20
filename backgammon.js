var gl;
var points = [];

window.onload = function() {
  var canvas = document.getElementById("gl-canvas");

  if (!gl) {
    alert("WebGL isn't available");
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
}
