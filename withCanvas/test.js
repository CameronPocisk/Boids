// Made by Cameron Pocisk and Cristian Leyva

// Globals and Constants
var WINDOW_HEIGHT = window.innerWidth; // Add an event listener and make these plastic
var WINDOW_WIDTH = window.innerHeight;
// bools for - seperation, allignment, cohesion, WrapAround
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");

class Boid{

    angle; // Radians looooool (for Math)

    xPosition = WINDOW_WIDTH / 2; // These represent the Center of the boid
    yPosition = WINDOW_HEIGHT / 2; // Starts at the center of screen by default

    xVelocity;
    yVelocity;

    awarenessCircleRadius;

    // Triangle dimensions (all isococilies)
    base = window.innerWidth / 15;
    height = window.innerHeight / 10;
    color = "#000000"; // Hexstring?

    constructor(xPosInp, yPosInp, angleInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.angle = angleInp;
    }

    DrawBoid()
    { // Draws from the center of the boid
        context.beginPath();
        context.moveTo(this.xPosition + (Math.cos(this.angle) * this.height * 1/2),
        this.yPosition + (Math.sin(this.angle) * this.height * 1/2)); // Top of triangle

        context.lineTo(this.xPosition + (-1/2((Math.cos(this.angle) * this.height) - (Math.sin(this.angle) * this.base))),
        this.yPosition + (-1/2((Math.sin(this.angle) * this.height) + (Math.cos(this.angle) * this.base))));

        context.lineTo(this.xPosition + (-1/2((Math.cos(this.angle) * this.height) + (Math.sin(this.angle) * this.base))),
        this.yPosition + (-1/2((Math.sin(this.angle) * this.height) - (Math.cos(this.angle) * this.base))));
        context.fill();
    }

    Update(){
    }
  }

function main()
{
    console.log("hello world");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.border = "1px solid #FF0000";

    context.beginPath();
    // X, y Quad III
    context.moveTo(WINDOW_WIDTH/2, WINDOW_HEIGHT/2);
    context.lineTo(WINDOW_WIDTH/2 -15, WINDOW_HEIGHT/2 + 40);
    context.lineTo(WINDOW_WIDTH/2 +15, WINDOW_HEIGHT/2 + 40);
    context.fill();

    // New test triangle using boid
    const firstBoid = new Boid(WINDOW_WIDTH/2, WINDOW_HEIGHT/2, Math.PI);
    firstBoid.DrawBoid;
}

main();
