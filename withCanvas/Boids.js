// Made by Cameron Pocisk and Cristian Leyva

// Globals and Constants
const FrameRateInMsec = Math.floor(1/60);
var BoidHeight = window.innerHeight / 4; // Var bc I think these will have to be plastic
var boidWidth = window.innerWidth / 15;
// bools for - seperation, allignment, cohesion, WrapAround
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");

function reportWindowSize() {
    BoidHeight = window.innerHeight /4;
    boidWidth = window.innerWidth / 15;
}


class Boid{

    angle; // Radians looooool (for Math)
    firstXPoint;
    firstYPoint;
    secondXPoint;
    secondYPoint;
    thirdXPoint;
    thirdYPoint;

    xPosition = window.width / 2; // These represent the Center of the boid
    yPosition = window.height / 2; // Starts at the center of screen by default

    xVelocity;
    yVelocity;

    constructor(xPosInp, yPosInp, angleInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.angle = angleInp;
    }

    DrawBoid()
    { // Draws from the center of the boid
        context.beginPath();

        context.moveTo(this.firstXPoint, this.firstYPoint);
        context.lineTo(this.secondXPoint, this.secondYPoint);
        context.lineTo(this.thirdXPoint, this.thirdYPoint);
        context.fill();
    }

    UpdateTriangleCoordinates()
    {   // Math for drawing an isocolese triangle from its center given its X, Y, Base, Height, Angle.
        this.firstXPoint = this.xPosition + (Math.cos(this.angle) * BoidHeight * 1/2);
        this.firstYPoint = this.yPosition + (Math.sin(this.angle) * BoidHeight * 1/2);
        this.secondXPoint =this.xPosition + (-1/2 * ((Math.cos(this.angle) * BoidHeight) - (Math.sin(this.angle) * boidWidth)));
        this.secondYPoint =this.yPosition + (-1/2 * ((Math.sin(this.angle) * BoidHeight) + (Math.cos(this.angle) * boidWidth)));
        this.thirdXPoint = this.xPosition + (-1/2 * ((Math.cos(this.angle) * BoidHeight) + (Math.sin(this.angle) * boidWidth)));
        this.thirdYPoint = this.yPosition + (-1/2 * ((Math.sin(this.angle) * BoidHeight) - (Math.cos(this.angle) * boidWidth)));
    }

    Update()
    {
        this.UpdateTriangleCoordinates();
        this.DrawBoid();
    }
};

function main()
{
    console.log("hello world");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.border = "1px solid #FF0000";
    window.addEventListener("resize", reportWindowSize);

    const firstBoid = new Boid(window.innerWidth/2, window.innerHeight/2, Math.PI/2);
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Move this outside of class, This has to happen upon each 'frame'
        firstBoid.angle += .015;

        firstBoid.xPosition += 2;
        if(firstBoid.xPosition > window.innerWidth){
            firstBoid.xPosition = 0;
        }

        firstBoid.Update();
        console.log("thing happened");
    }, FrameRateInMsec);
}

main();
