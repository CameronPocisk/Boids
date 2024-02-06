// Made by Cameron Pocisk and Cristian Leyva

// Globals and Constants
const FrameRateInMsec = 1/60;
var BoidHeight = window.innerHeight / 8; // Var bc I think these will have to be plastic
var boidWidth = window.innerWidth / 30;
const numBoids = 2;
// bools for - seperation, allignment, cohesion, WrapAround
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");

function SetupCanvas(){
    console.log("Running Program");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.border = "1px solid #FF0000";
    window.addEventListener("resize", ReportWindowSize);
}

function ReportWindowSize(){
    BoidHeight = window.innerHeight / numBoids;
    boidWidth = window.innerWidth / 15;
}
function RandomNumberBetween(min, max){
    range = max - min;
    return max - Math.random() * range;
}

class Boid{
    xPosition; // These represent the Center of the boid
    yPosition;
    velocity;
    angle; // Radians looooool (for Math)

    firstXPoint; // Triangle things
    firstYPoint;
    secondXPoint;
    secondYPoint;
    thirdXPoint;
    thirdYPoint;

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

    CheckForOutOfBounds(){
        if(this.xPosition > window.innerWidth){
            this.xPosition = 0;
        }
        else if(this.xPosition < 0)
        {
            this.xPosition = window.innerWidth
        }

        if(this.yPosition > window.innerHeight){
            this.yPosition = 0;
        }
        else if(this.yPosition < 0)
        {
            this.yPosition = window.innerHeight
        }
    }

    UpdateTriangleCoordinates()
    {   // Math for drawing an isocolese triangle from its center given its X, Y, Base, Height, Angle.
        // Worth performance wise to save sin and cos' as vars? (5 each per frame) (Do Later)
        this.firstXPoint = this.xPosition + (Math.cos(this.angle) * BoidHeight * 1/2);
        this.firstYPoint = this.yPosition + (Math.sin(this.angle) * BoidHeight * 1/2);
        this.secondXPoint= this.xPosition + (-1/2 * ((Math.cos(this.angle) * BoidHeight) - (Math.sin(this.angle) * boidWidth)));
        this.secondYPoint= this.yPosition + (-1/2 * ((Math.sin(this.angle) * BoidHeight) + (Math.cos(this.angle) * boidWidth)));
        this.thirdXPoint = this.xPosition + (-1/2 * ((Math.cos(this.angle) * BoidHeight) + (Math.sin(this.angle) * boidWidth)));
        this.thirdYPoint = this.yPosition + (-1/2 * ((Math.sin(this.angle) * BoidHeight) - (Math.cos(this.angle) * boidWidth)));
    }

    MoveWithVelocity()
    {
        this.xPosition += Math.cos(this.angle) * this.velocity;
        this.yPosition += Math.sin(this.angle) * this.velocity;
    }

    Update()
    {
        
        this.MoveWithVelocity();
        this.CheckForOutOfBounds();
        this.UpdateTriangleCoordinates();
        this.DrawBoid();
    }
};

function main()
{
    SetupCanvas();

    // Initialize boids
    const aFewBoids = []
    for(let i = 0; i < numBoids; i++){
        aFewBoids.push(new Boid(RandomNumberBetween(0, window.innerWidth), 
        RandomNumberBetween(0, window.innerHeight),
        RandomNumberBetween(2, 6),
        Math.PI/2));
    }
    var frameCount = 0
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear frame so you can draw on it
        if(frameCount >= 60){
            frameCount = 0
        }
        frameCount++
        
        for(let i = 0; i < numBoids; i++){ // Move into class?
            aFewBoids[i].angle += RandomNumberBetween(-.02, .02);
        }
        
        // Do a majority of the work for boid updating
        for(let i = 0; i < numBoids; i++){
            aFewBoids[i].Update();
        }

        // In html put fiun bkg behind canvas?

        console.log("thing happened on frame :" + frameCount);
    }, FrameRateInMsec);
}

main();
