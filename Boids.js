// Made by Cameron Pocisk and Cristian Leyva

// Globals from HTML fncalls
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");
var mouseXPosition = 0;
var mouseYPosition = 0;

// Helpful constants
const FrameRateInMsec = (1/60) * 1000;
const numBoids = 20;

// bools for - seperation, allignment, cohesion, WrapAround?

function StartProgram(){
    main(); // Happens here so everthing starts once loaded. Helps with sizing and potential bugs
}

function ReportWindowSize(){
    heightOfBoid = window.innerHeight / 15;
    widthOfBoid = window.innerWidth / 50;
}
function UpdateMouseCoords(event) {
    mouseXPosition = event.clientX;
    mouseYPosition = event.clientY;
}

function SetupCanvas(){
    console.log("Running Program (Hello Boids)");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.style.border = "1px solid #FF0000";
    window.addEventListener("resize", ReportWindowSize);
    ReportWindowSize();
}

function RandomNumberBetween(min, max){
    return min + Math.random() * (max - min);
}

class Boid{

    static widthOfBoid;
    static heightOfBoid;
    static FeildOfView = Math.PI // When the boid will scan to find empty space

    xPosition;
    yPosition;
    velocity;
    angle; // Radians looooool (for Math)
    sinOfBoidAngle;
    cosOfBoidAngle;

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
    UpdateTriangleCoordinates()
    {   // Math for drawing an isocolese triangle from its center given its X, Y, Base, Height, Angle. (y acts in neg)
        this.firstXPoint = this.xPosition + (this.cosOfBoidAngle * heightOfBoid * 1/2);
        this.firstYPoint = this.yPosition - (this.sinOfBoidAngle * heightOfBoid * 1/2);
        this.secondXPoint= this.xPosition + (-1/2 * ((this.cosOfBoidAngle * heightOfBoid) - this.sinOfBoidAngle * widthOfBoid));
        this.secondYPoint= this.yPosition - (-1/2 * ((this.sinOfBoidAngle * heightOfBoid) + this.cosOfBoidAngle * widthOfBoid));
        this.thirdXPoint = this.xPosition + (-1/2 * ((this.cosOfBoidAngle * heightOfBoid) + this.sinOfBoidAngle * widthOfBoid));
        this.thirdYPoint = this.yPosition - (-1/2 * ((this.sinOfBoidAngle * heightOfBoid) - this.cosOfBoidAngle * widthOfBoid));
    }

    HandleOutOfBounds(){ // Uses modulous to ensure that it stays within the bounds. works all directoins with plus screenSize and mod
        this.xPosition = (this.xPosition + window.innerWidth) % window.innerWidth;
        this.yPosition = (this.yPosition + window.innerHeight) % window.innerHeight;
    }

    CalculateTrigAngleFactors()
    {
        // if(this.angle < 0){ // Needed?
        // this.angle += 2 * Math.PI;
        // } // look at the line below did i cook.
        this.angle = (this.angle + 2*Math.PI) % (2*Math.PI);

        this.angle %= 2 * Math.PI; // make sure spins dont affect point
        this.sinOfBoidAngle = Math.sin(this.angle);
        this.cosOfBoidAngle = Math.cos(this.angle);
    }

    MoveWithVelocity()
    {
        this.xPosition += this.cosOfBoidAngle * this.velocity;
        this.yPosition -= this.sinOfBoidAngle * this.velocity;
    }

    RandomAngleChange(){
        this.angle += RandomNumberBetween(-.1, .1);
    }
    
    MoveTowardsCursor()
    {
        const relativeXPosition = mouseXPosition - this.xPosition;
        const relativeYPosition = -1*(mouseYPosition - this.yPosition);
        var angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);

        if (relativeXPosition < 0){ // Handle weird Arctangent outputs
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){ // 4th quad will range from 270 - 360 with this
            angleFromBoid += Math.PI*2;
        }
        // console.log("Boid in deg: " + this.angle * 180 / Math.PI); console.log("Angle from : " + angleFromBoid * 180 / Math.PI);
        if((angleFromBoid > this.angle && angleFromBoid < this.angle + Math.PI) || angleFromBoid < this.angle - Math.PI){
            this.angle += .07; // Turn left
        }
        else{
            this.angle -= .07; // Turn right
        }
    }

    DrawLineToAllBoids(constBoidArray){
        
    }

    Update()
    {
        //First calculations 
        this.CalculateTrigAngleFactors();
        
        // Handle angle
        this.MoveTowardsCursor(); // Add fun thing for mouse off screen?
        // this.RandomAngleChange();

        // Handle Movement
        this.MoveWithVelocity();
        this.HandleOutOfBounds();
        
        // Display Boid
        this.UpdateTriangleCoordinates();
        this.DrawBoid();
    }

};

function main()
{
    SetupCanvas();

    // Initialize boids
    const aFewBoids = [];

    // for(let i = 0; i < numBoids; i++){
    //     aFewBoids.push(new Boid(RandomNumberBetween(0, window.innerWidth), 
    //     RandomNumberBetween(0, window.innerHeight),
    //     RandomNumberBetween(7, 8),
    //     Math.PI/2));
    // }
    for(let i = 0; i < numBoids; i++){
        aFewBoids.push(new Boid(window.innerWidth/2, 
        window.innerHeight/2,
        RandomNumberBetween(0, 0),
        Math.PI/2));
    }

    // Start main loop
    var frameCount = 0;
    setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if(frameCount >= 60){
            frameCount = 0;
        }
        frameCount++;
        
        // Do a majority of the work for boid updating
        for(let i = 0; i < numBoids; i++){
            aFewBoids[i].Update();
        }

        // console.log("Ran frame: " + frameCount);
    }, FrameRateInMsec);
}

window.addEventListener("load", StartProgram);

