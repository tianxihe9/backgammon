var gl;
var points = [];
var dice = [];
var aspectRatio = 1.0;
var cubeSize = 10;
var cubeSize2 = cubeSize / 2.0;
var t=0;
var start=false;
var ready=false;
var index = [
  // TOP of Board
  15, 12, 11, 8, 4, 10, 14, 8, 7, 13, 3, 10, 13, 14, 3, 8, 14, 9, 9, 10, 8, 11, 16, 15, 4, 10, 3, 3, 14, 7,

  // Base
  1, 6, 2, 1, 6, 5,
  // Front
  1, 4, 3, 1, 3, 2,
  // FrontLeft
  11, 10, 18, 19, 11, 18,
  // FrontRight
  13, 20, 12, 20, 21, 13,
  // Left
  8, 4, 1, 1, 5, 8,
  // Inner Left
  18, 10, 9, 9, 17, 18,
  // Back
  7, 8, 5, 7, 5, 6,
  // BackLeft
  24, 9, 16, 24, 17, 9,
  // BackRight
  15, 14, 22, 22, 23, 15,
  // Right
  2, 3, 7, 7, 6, 2,
  // Inner Right
  14, 13, 21, 21, 22, 14,
  // mid Right
  15, 23, 12, 23, 20, 12,
  // mid Left
  16, 11, 19, 19, 24, 16,

  // Black triangles
  47, 48, 49,
  43, 44, 45,
  39, 40, 41,
  33, 34, 35,
  29, 30, 31,
  25, 26, 27,
  54, 56, 55,
  58, 60, 59,
  62, 64, 63,
  68, 70, 69,
  72, 74, 73,
  76, 78, 77,

  // White Triangles

  49, 50, 51,
  45, 46, 47,
  41, 42, 43,
  35, 36, 37,
  31, 32, 33,
  27, 28, 29,
  52, 54, 53,
  56, 58, 57,
  60, 62, 61,
  66, 68, 67,
  70, 72, 71,
  74, 76, 75
]
var verticesTest = [
  vec4(0, 0, 0, 1),//1
  vec4(-4, 0, 0, 1),//2
  vec4(36, 0, 0, 1),//3
  vec4(36, 3, 0, 1),//4
  vec4(-4, 3, 0, 1),//5
  vec4(-4, 0, -26, 1),//6
  vec4(36, 0, -26, 1),//7
  vec4(36, 3, -26, 1),//8
  vec4(-4, 3, -26, 1),//9
  vec4(1, 3, -25, 1),//10
  vec4(1, 3, -1, 1),//11
  vec4(15, 3, -1, 1),//12
  vec4(17, 3, -1, 1),//13
  vec4(31, 3, -1, 1),//14
  vec4(31, 3, -25, 1),//15
  vec4(17, 3, -25, 1),//16
  vec4(15, 3, -25, 1),//17
  vec4(1, 0, -25, 1),//18
  vec4(1, 0, -1, 1),//19
  vec4(15, 0, -1, 1),//20
  vec4(17, 0, -1, 1),//21
  vec4(31, 0, -1, 1),//22
  vec4(31, 0, -25, 1),//23
  vec4(17, 0, -25, 1),//24
  vec4(15, 0, -25, 1),//25
];
var colors = [
  vec4(0.5976, 0.2968, 0, 1.0),
  vec4(128 / 255, 128 / 255, 128 / 255, 1.0),
  vec4(0, 0, 0, 1),
  vec4(1, 1, 1, 1),
  vec4(193 / 255, 154 / 255, 107 / 255, 1),
  vec4(171 / 255, 22 / 255, 22 / 255, 1)
];
var  mat1 = mat4(1.0, 0.0, 0.0, -16,
    0.0, 1.0, 0.0, -1.5,
    0.0, 0.0, 1.0, -13,
    0.0, 0.0, 0.0, 1.0);
var mat2 = mat4(1.0, 0.0, 0.0, 5,
    0.0, 1.0, 0.0, -18,
    0.0, 0.0, 1.0, 0,
    0.0, 0.0, 0.0, 1.0);

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
  aspect = canvas.width / canvas.height;
  gl.clearColor(1, 1, 1, 1.0);
  gl.enable(gl.DEPTH_TEST);

  generateBoard();

  // Testing die
  var die = new Die(vec2(0, 0));
  die.roll();
  alert(die.getValue());

  document.getElementById("play").onclick=function () {
    if(!start) {
      start = true;
      document.getElementById("play").innerHTML="Stop The Game"
    }else{
      document.getElementById("play").innerHTML="Start The Game"
      start = false;
    }
  }

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorLoc = gl.getUniformLocation(program, "color");
  modelViewLoc = gl.getUniformLocation(program, "modelView");
  projectionLoc = gl.getUniformLocation(program, "projection");

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTest), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(index), gl.STATIC_DRAW);

  StartRender();
};


function StartRender() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if(start && t!=90){
    t=t+0.5;
    ready=false;
  }else if (!start && t!=0){
    t=t-0.5;
    ready=false;
  }else if(t==90){
    ready=true;
  }

  ThreeDCalculation();
  draw();
  requestAnimFrame(StartRender);
};


function ThreeDCalculation(){
  mat = mat4(1.0, 0.0, 0.0, 0.0,
      0.0, Math.cos(radians(t)), -Math.sin(radians(t)), 0.0,
      0.0, Math.sin(radians(t)), Math.cos(radians(t)), 0.0,
      0.0, 0.0, 0.0, 1.0);
  angle = lookAt(vec3(cubeSize2, cubeSize2, 4 * cubeSize), vec3(cubeSize2,
      cubeSize2, 0), vec3(0.0, 1.0, 0.0));
  projection = perspective(45.0, aspect, 1, 10 * cubeSize);
  modelView = mult(angle, mult(mat2, mult(mat, mat1)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
  gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));
}

function draw(){
  gl.uniform4fv(colorLoc, colors[2]);
  for (var i = 12; i < 14; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[1]);
  for (var i = 14; i < 36; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[4]);
  for (var i = 0; i < 10; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[0]);
  for (var i = 10; i < 12; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[2]);
  for (var i = 36; i < 48; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[3]);
  for (var i = 48; i < 60; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
}


function  generateBoard(){
  for (i = 3; i < 30; i++) {
    if (i % 2 === 1) {
      verticesTest.push(vec4(i, 0.01, -1, 1));
    } else {
      verticesTest.push(vec4(i, 0.01, -9, 1));
    }
  }

  for (i = 3; i < 30; i++) {
    if (i % 2 === 1) {
      verticesTest.push(vec4(i, 0.01, -25, 1));
    } else {
      verticesTest.push(vec4(i, 0.01, -17, 1));
    }
  }
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
