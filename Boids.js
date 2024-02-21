// Made by Cameron Pocisk and Cristian Leyva

// Globals from HTML fncalls
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");
var mouseXPosition = 0;
var mouseYPosition = 0;

// Helpful constants
const FrameRateInMsec = (1/60) * 1000;
const aFewBoids = [];
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
    window.addEventListener("resize", ReportWindowSize);
    ReportWindowSize();
}

function RandomNumberBetween(min, max){
    return min + Math.random() * (max - min);
}
function DistanceBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

//This needs to be changed but its easiest like this rn
function SetBoidStaticVars(){
    distanceToAvoid = window.innerWidth / 12;
    angleChangeTargeting = .05;
    angleChangeAvoiding = .06;
    AngleChangeCohesion = .02;
}

class Boid{

    static distanceToAvoid;
    static widthOfBoid;
    static heightOfBoid;

    //Add static vars for angle change relative for each check
    static distanceToAvoid;
    static angleChangeTargeting;
    static angleChangeAvoiding;
    static AngleChangeCohesion;

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
    
    // Constructor for making boid with different shape functoins
    constructor(xPosInp, yPosInp, velocityInp, angleInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.velocity = velocityInp;
        this.angle = angleInp;
        this.nearbyBoids = []; // fast or slow?
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
        // } // look at the line below did i cook. This is used for screen coords as well
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

    MoveToCoords(coordX, coordY, angleDiff = angleChangeTargeting){
        //Find angle using arctan
        const relativeXPosition = coordX - this.xPosition;
        const relativeYPosition = -1*(coordY - this.yPosition);
        var angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);

        // Cope with arctan outputs
        if (relativeXPosition < 0){ 
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){
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
    MoveAwayFromCoords(coordX, coordY, angleDiff = angleChangeAvoiding){
        // opposite of MoveToCoords (same logic opp turn angle)
        const relativeXPosition = coordX - this.xPosition;
        const relativeYPosition = -1*(coordY - this.yPosition);
        var angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);

        if (relativeXPosition < 0){ // Handle weird Arctangent outputs
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){ // 4th quad will range from 270 - 360 with this
            angleFromBoid += Math.PI*2;
        }
        if((angleFromBoid > this.angle && angleFromBoid < this.angle + Math.PI) || angleFromBoid < this.angle - Math.PI){
            this.angle -= .07; // Turn Right
        }
        else{
            this.angle += .07; // Turn Left
        }
    }
    
    MoveTowardsCursor(){ this.MoveToCoords(mouseXPosition, mouseYPosition, angleChangeTargeting); } // Add fun thing for mouse off screen?

    MoveAwayFromObjectIfClose(objX, objY){  //distanceToAvoid
        if(DistanceBetweenPoints(this.xPosition, this.yPosition, objX, objY) < distanceToAvoid){
            this.MoveAwayFromCoords(objX, objY, angleChangeTargeting);
        }
    }

    DrawLineToAllBoids(){
        for(let i = 0; i < aFewBoids.length; i++){
            context.beginPath();
            context.moveTo(this.xPosition, this.yPosition);
            context.lineTo(aFewBoids[i].xPosition, aFewBoids[i].yPosition);
            context.strokeStyle = "#00FF00";
            context.stroke();
        }
    }
    DrawLineToNearbyBoids(){
        for(let i = 0; i < this.nearbyBoids.length; i++){
            context.beginPath();
            context.moveTo(this.xPosition, this.yPosition);
            context.lineTo(this.nearbyBoids[i].xPosition, this.nearbyBoids[i].yPosition);
            context.strokeStyle = "#FF0000";
            context.stroke();
        }
    }

    GetArrayOfNearbyBoidsFromAll(){
        this.nearbyBoids = [];
        for(let i = 0; i < aFewBoids.length; i++){
            var distFromBoid = DistanceBetweenPoints(this.xPosition, this.yPosition, aFewBoids[i].xPosition, aFewBoids[i].yPosition);
            if(distFromBoid < distanceToAvoid){
                this.nearbyBoids.push(aFewBoids[i]);
            }
        }
    }

    MoveAwayFromNearbyBoids(){ // Will this work well without a formula for how much angle to change?
        for(let i = 0; i < this.nearbyBoids.length; i++){
            this.MoveAwayFromCoords(this.nearbyBoids[i].xPosition, this.nearbyBoids[i].yPosition, angleChangeAvoiding);
        }
    }

    CoheasionToNearbyAngles(){
        if(this.nearbyBoids.length == 0){
            return; // early exit
        }
        var nearbyBoidAngleAvg = 0; // Get the average
        for(let i = 0; i < this.nearbyBoids.length; i++){
            nearbyBoidAngleAvg += this.nearbyBoids[i].angle;
        }
        this.nearbyBoidAngleAvg /= this.nearbyBoids.length;
        // Relative angle as coordinate away from boid. 
        this.MoveToCoords(this.xPosition + Math.cos(nearbyBoidAngleAvg), this.yPosition + Math.sin(nearbyBoidAngleAvg), AngleChangeCohesion);
    }

    Update()
    {
        //First calculations 
        this.CalculateTrigAngleFactors();
        
        // GetNeededInfo from nearby
        this.GetArrayOfNearbyBoidsFromAll();
        
        // Visual for nearby
        // this.DrawLineToAllBoids();
        // this.DrawLineToNearbyBoids();
        
        // Handle angle
        // this.RandomAngleChange(); // fun fun
        this.CoheasionToNearbyAngles(); // Allignment
        this.MoveAwayFromNearbyBoids(); // Seperatoin
        // this.MoveAwayFromObjectIfClose(mouseXPosition, mouseYPosition);
        this.MoveTowardsCursor(); // Cohesion

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
    SetBoidStaticVars();

    // Initialize boids

    for(let i = 0; i < numBoids; i++){
        aFewBoids.push(new Boid(RandomNumberBetween(0, window.innerWidth), 
        RandomNumberBetween(0, window.innerHeight),
        RandomNumberBetween(4, 5),
        Math.PI/2));
    }
    // for(let i = 0; i < numBoids; i++){
    //     aFewBoids.push(new Boid(window.innerWidth/2, 
    //     window.innerHeight/2,
    //     RandomNumberBetween(0, 0),
    //     Math.PI/2));
    // }

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
            aFewBoids[i].GetArrayOfNearbyBoidsFromAll(aFewBoids);
            aFewBoids[i].Update();
            // aFewBoids[i].DrawLineToAllBoids(aFewBoids);
        }

        // console.log("Ran frame: " + frameCount);
    }, FrameRateInMsec);
}

window.addEventListener("load", StartProgram);

