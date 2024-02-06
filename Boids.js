// Made by Cameron Pocisk and Cristian Leyva

// Globals and Constants
const FrameRateInMsec = 1/60;
var BoidHeight = window.innerHeight / 8; // Var bc I think these will have to be plastic
var boidWidth = window.innerWidth / 30;
// bools for - seperation, allignment, cohesion, WrapAround
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");

function ReportWindowSize(){
    BoidHeight = window.innerHeight /4;
    boidWidth = window.innerWidth / 15;
}
function RandomNumberBetween(min, max){
    range = max - min;
    return max - Math.random() * range;
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

    velocity;
    // Used to save space and time but always derived from velocity
    xVelocity; 
    yVelocity;

    constructor(xPosInp, yPosInp, velocityInp, angleInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.velocity = velocityInp;
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
        this.secondXPoint= this.xPosition + (-1/2 * ((Math.cos(this.angle) * BoidHeight) - (Math.sin(this.angle) * boidWidth)));
        this.secondYPoint= this.yPosition + (-1/2 * ((Math.sin(this.angle) * BoidHeight) + (Math.cos(this.angle) * boidWidth)));
        this.thirdXPoint = this.xPosition + (-1/2 * ((Math.cos(this.angle) * BoidHeight) + (Math.sin(this.angle) * boidWidth)));
        this.thirdYPoint = this.yPosition + (-1/2 * ((Math.sin(this.angle) * BoidHeight) - (Math.cos(this.angle) * boidWidth)));
    }

    GetVelocityComponents()
    {
        this.xVelocity = Math.cos(this.angle) * this.velocity;
        this.yVelocity = Math.sin(this.angle) * this.velocity;
    }

    MoveWithVelocity()
    {
        this.xPosition += this.xVelocity;
        this.yPosition += this.yVelocity;
    }

    Update()
    {
        this.GetVelocityComponents();
        this.MoveWithVelocity();
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
    window.addEventListener("resize", ReportWindowSize);

    const firstBoid = new Boid(window.innerWidth/2, window.innerHeight/2, 5, Math.PI/2);
    frameCount = 0
    setInterval(() => {
        if(frameCount >= 60){
            frameCount = 0
        }
        frameCount++
        context.clearRect(0, 0, canvas.width, canvas.height); // Move this outside of class, This has to happen upon each 'frame'
        
        if(frameCount % 5 == 0){   
            firstBoid.angle += RandomNumberBetween(-.08, .08);
        }


        if(firstBoid.xPosition > window.innerWidth){
            firstBoid.xPosition = 0;
        }
        else if(firstBoid.xPosition < 0)
        {
            firstBoid.xPosition = window.innerWidth
        }
        if(firstBoid.yPosition > window.innerHeight){
            firstBoid.yPosition = 0;
        }
        else if(firstBoid.yPosition < 0)
        {
            firstBoid.yPosition = window.innerHeight
        }

        firstBoid.Update();
        console.log("thing happened");
        console.log(frameCount);
    }, FrameRateInMsec);
}

main();
