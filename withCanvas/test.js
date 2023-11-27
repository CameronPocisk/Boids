// Made by Cameron Pocisk and Cristian Leyva

// Globals and Constants
// bools for - seperation, allignment, cohesion, WrapAround
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");

class Boid{

    angle; // Radians looooool (for Math)

    xPosition = window.width / 2; // These represent the Center of the boid
    yPosition = window.height / 2; // Starts at the center of screen by default

    xVelocity;
    yVelocity;

    awarenessCircleRadius;

    // Triangle dimensions (all isococilies)
    base = window.innerWidth / 15;
    height = window.innerHeight / 8;
    color = "#000000"; // Hexstring?

    constructor(xPosInp, yPosInp, angleInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.angle = angleInp;
    }

    DrawBoid()
    { // Draws from the center of the boid
        context.beginPath(); // I think that I need to add to account for the bias of (0,0) being the top left
        // I think that the best way to handle this is to treat it like the top rigjt quadrant
        context.moveTo(this.xPosition + (Math.cos(this.angle) * this.height * 1/2),
        this.yPosition + (Math.sin(this.angle) * this.height * 1/2)); // Top of triangle

        context.lineTo(this.xPosition + (-1/2 * ((Math.cos(this.angle) * this.height) - (Math.sin(this.angle) * this.base))),
        this.yPosition + (-1/2 * ((Math.sin(this.angle) * this.height) + (Math.cos(this.angle) * this.base))));

        context.lineTo(this.xPosition + (-1/2 * ((Math.cos(this.angle) * this.height) + (Math.sin(this.angle) * this.base))),
        this.yPosition + (-1/2 * ((Math.sin(this.angle) * this.height) - (Math.cos(this.angle) * this.base))));
        context.fill();

        console.log(this.xPosition + (Math.cos(this.angle) * this.height * 1/2));
    }
};

function main()
{
    console.log("hello world");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.border = "1px solid #FF0000";

    context.beginPath();
    // X, y Quad III
    // context.moveTo(window.innerWidth/2, window.innerHeight/2 );
    // context.lineTo(window.innerWidth/2 -100, window.innerHeight/2 +100);
    // context.lineTo(window.innerWidth/2 + 100, window.innerHeight/2 +100);
    // context.fill();

    // New test triangle using boid
    const firstBoid = new Boid(window.innerWidth/2, window.innerHeight/2, Math.PI/2);
    firstBoid.DrawBoid();
}

main();
