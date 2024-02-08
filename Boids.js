// Made by Cameron Pocisk and Cristian Leyva

// Globals and Constants
const FrameRateInMsec = (1/60) * 1000;
var BoidHeight = window.innerHeight / 16; // Var bc I think these will have to be plastic
var boidWidth = window.innerWidth / 60;
const numBoids = 1;
var mouseXPosition = 0;
var mouseYPosition = 0;
// bools for - seperation, allignment, cohesion, WrapAround
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");

function SetupCanvas(){
    console.log("Running Program");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.style.border = "1px solid #FF0000";
    window.addEventListener("resize", ReportWindowSize);
}

function ReportWindowSize(){
    BoidHeight = window.innerHeight / 8;
    boidWidth = window.innerWidth / 15;
}
function UpdateMouseCoords(event) {
    mouseXPosition = event.clientX;
    mouseYPosition = event.clientY;
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
    sinVelocityFactor;
    cosVelocityFactor;

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
        context.fillStyle = "#56554E";
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

    CalculateTrigAngleFactors()
    {
        this.sinVelocityFactor = Math.sin(this.angle);
        this.cosVelocityFactor = Math.cos(this.angle);
    }

    UpdateTriangleCoordinates()
    {   // Math for drawing an isocolese triangle from its center given its X, Y, Base, Height, Angle.
        // Worth performance wise to save sin and cos' as vars? (5 each per frame) (Do Later)
        this.firstXPoint = this.xPosition + (this.cosVelocityFactor * BoidHeight * 1/2);
        this.firstYPoint = this.yPosition + (this.sinVelocityFactor * BoidHeight * 1/2);
        this.secondXPoint= this.xPosition + (-1/2 * ((this.cosVelocityFactor * BoidHeight) - this.sinVelocityFactor * boidWidth));
        this.secondYPoint= this.yPosition + (-1/2 * ((this.sinVelocityFactor * BoidHeight) + this.cosVelocityFactor * boidWidth));
        this.thirdXPoint = this.xPosition + (-1/2 * ((this.cosVelocityFactor * BoidHeight) + this.sinVelocityFactor * boidWidth));
        this.thirdYPoint = this.yPosition + (-1/2 * ((this.sinVelocityFactor * BoidHeight) - this.cosVelocityFactor * boidWidth));
    }

    MoveWithVelocity()
    {
        this.xPosition += this.cosVelocityFactor * this.velocity;
        this.yPosition += this.sinVelocityFactor * this.velocity;
    }

    MoveTowardsCursor()
    {
        const relativeXPosition = mouseXPosition - this.xPosition;
        const relativeYPosition = -1 * (mouseYPosition - this.yPosition);
        var angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);
        if (relativeXPosition < 0){
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){ // 4th quad will range from 270 - 360 with this
            angleFromBoid += Math.PI*2;
        }

        // Everything below here is tweaky
        console.log("Boid in deg: " + this.angle * 180 / Math.PI);
        this.angle %= 2 * Math.PI; // make sure spins dont affect point

        if(this.angle > angleFromBoid){
            this.angle -= .05;
            console.log("Right");
        }
        else{
            this.angle += .05;
            console.log("Left");
        }
        // Add cursor positions here.
        // event.clientX;  // Horizontal
    }

    Update()
    {
        // Handle angle
        this.MoveTowardsCursor();

        // Handle Movement
        this.CalculateTrigAngleFactors();
        this.MoveWithVelocity();
        this.CheckForOutOfBounds();
        
        // Display Boid
        this.UpdateTriangleCoordinates();
        this.DrawBoid();
    }

};

function main()
{
    SetupCanvas();

    // Initialize boids
    const aFewBoids = []
    // for(let i = 0; i < numBoids; i++){
    //     aFewBoids.push(new Boid(RandomNumberBetween(0, window.innerWidth), 
    //     RandomNumberBetween(0, window.innerHeight),
    //     RandomNumberBetween(2, 3),
    //     Math.PI/2));
    // }
    // for(let i = 0; i < numBoids; i++){
    //     aFewBoids.push(new Boid(window.innerWidth/2, 
    //     window.innerHeight/2,
    //     RandomNumberBetween(0, 0),
    //     Math.PI/2));
    // }
    for(let i = 0; i < numBoids; i++){
        aFewBoids.push(new Boid(window.innerWidth/5, 
        window.innerHeight/5,
        RandomNumberBetween(0, 0),
        0));
    }
    // aFewBoids[0].angle += Math.PI;
    var frameCount = 0
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear frame so you can draw on it
        if(frameCount >= 60){
            frameCount = 0
        }
        frameCount++
        
        // for(let i = 0; i < numBoids; i++){ // Move into class?
        //     aFewBoids[i].angle += RandomNumberBetween(-.02, .02);
        // }
        
        // Do a majority of the work for boid updating
        for(let i = 0; i < numBoids; i++){
            aFewBoids[i].Update();
        }

        // console.log("thing happened on frame :" + frameCount);
    }, FrameRateInMsec);
}

main();
