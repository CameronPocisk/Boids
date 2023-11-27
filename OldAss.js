// Boid Rules
const seperaion = false;
const alignment = false;
const cohesion = false;

const vertexData = [
// x   y  
   0,  1, 0,
   1, -1, 0,
  -1, -1, 0,
];
class Boid{

  angle = 90; // Degrees

  xPosition;
  yPosition;

  xVelocity;
  yVelocity;
  vectorVelocity;

  awarenessCircleRadius;

  // Triangle dimensions (all isococilies)
  base;
  height;
  color; // Hextstring?

  constructor(xPosition) {
      this.xPosition = xPosition;
      this.yPosition;
  }

  setXPosition(newXPosition){
    this.x = newXPosition;
  }

  DrawBoid(){
  }

  Update(){
  }
}

function main(){

  const canvas = document.getElementById('boidPlane'); // const canvas = document.querySelector('canvas'); 
  const gl = canvas.getContext('webgl');

  if (!gl){
    throw new Error('WebGL not supported')
  }

  // Create a black canvas
  gl.clearColor(.2, .2, .3, 1); // full opaque dark purple bkg
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // creating buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer) // means that the buffer is an array of vertices
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW) // loads data into the array buffer and how often we redraw

  // creating vertex shader
  const vertexShader = gl.createShader(gl. VERTEX_SHADER); // A shader is like a mini program and it needs some code to run
  gl.shaderSource(vertexShader, `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 2);
  }
  `); // The code it runs (its not javascript, its the gl shading language which runs on the GPU)
  gl.compileShader(vertexShader); // compiles the shader


  // creating fragment shader
  const fragmentShader = gl.createShader(gl. FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, `
  void main() {
    gl_FragColor = vec4(.8, .75, .60, 1);
  }
  `);
  gl.compileShader(fragmentShader);

  // creating program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // enabling vertex attributes (disabled by default)
  const positionLocation = gl.getAttribLocation(program, 'position'); // this get the number that webGL has assigned to the attribute in the shaders
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0) // describe how webGL should retrieve attribute data from the buffer

  gl.useProgram(program); // will create the executable program on the GPU
  gl.drawArrays(gl.TRIANGLES, 0, 3);



  const firstBoid = new Boid(25);
  firstBoid.xPosition = 6; // Public??????
  console.log(firstBoid.xPosition);
}

main();