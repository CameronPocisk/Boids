// Made by Cameron Pocisk and Cristian Leyva

// Globals from HTML fncalls
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");
var mouseXPosition = 0;
var mouseYPosition = 0;

// Helpful constants
const FrameRateInMsec = (1/60) * 1000;
const aFewBoids = [];
const numBoids = 4;

// Where do these functoins go into?
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
    console.log("Running Program (Hello Strucutred Boids)");

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
    distanceToAvoid = window.innerWidth / 10; // Make fractoin of diagonal?
    angleChangeTargeting =.05;
    angleChangeAvoiding = .06;
    angleChangeCohesion = .03;
    angleRandomChange = .1;
}

class BoidScape{
    // These are globals from main program
    canvas = document.getElementById("boidPlane");
    context = canvas.getContext("2d");
    FrameRateInMsec = (1/60) * 1000;
    mouseXPosition = 0;
    mouseYPosition = 0;

    // Globals that I think belong here
    everyBoid = [];
    nearbyMap = new Map();

    // BIG IDEA
    // MAKE A DICTIONARY (MAP IN JS)
    // THIS MAP WILL HAVE A KEY FOR EVERY BOID
    // EVERY KEY WILL HAVE A VALUE THAT IS A LIST OF THE NEARBY BOIDS
    // GO THROUGH THE FIRST ELEM TO LAST
    // THEN SECOND TO LAST
    // ETC UNTIL THE MAP IS FULL 
    // EATCH MATCH WILL HAVE TO MAKE THEM BOTH ADD THEM TO THE MAP

    // KEY      VALUE
    // boid1    [boid 2, boid 3]
    // boid2    [boid 1]
    // boid3    [boid 1, boid 2]


    numBoids;
    
    //Bools for Rools
    shouldSeperate;
    shouldAllign;
    shouldCohere;


    constructor(){

    }

    FillCloseMap(){
        this.nearbyMap.clear();
    }

};

// This class will be used to store the nearby Boids
class XYAngFromBoid{
    xPosition;
    yPosition;
    angle;
    // ShouldAvoid; // Potential boolean for rule following
    constructor(xIn, yIn, angleIn){
        this.xPosition = xIn;
        this.yPosition = yIn;
        this.angle = angleInIn;
        // this.shouldAvoid = shouldAvoidIn
    }
}

class DrawableObject{
    xPosition;
    yPosition;
    angle;
    sinAngle;
    cosAngle;
    // Should I extend the constructor for draw functoin?
    constructor(xPosInp, yPosInp, angleInp){
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.angle = angleInp;
    }
    //Grab statics from higher class?

    // Is triangle rn, can I pass in functons?
    DrawShape(){ // 
        let firstXPoint = this.xPosition + (this.cosAngle * heightOfBoid * 1/2);
        let firstYPoint = this.yPosition - (this.sinAngle * heightOfBoid * 1/2);
        let secondXPoint= this.xPosition + (-1/2 * ((this.cosAngle * heightOfBoid) - this.sinAngle * widthOfBoid));
        let secondYPoint= this.yPosition - (-1/2 * ((this.sinAngle * heightOfBoid) + this.cosAngle * widthOfBoid));
        let thirdXPoint = this.xPosition + (-1/2 * ((this.cosAngle * heightOfBoid) + this.sinAngle * widthOfBoid));
        let thirdYPoint = this.yPosition - (-1/2 * ((this.sinAngle * heightOfBoid) - this.cosAngle * widthOfBoid));

        context.beginPath();

        context.moveTo(firstXPoint, firstYPoint);
        context.lineTo(secondXPoint, secondYPoint);
        context.lineTo(thirdXPoint, thirdYPoint);
        context.fillStyle = "#56554E";
        context.fill();
    }
    CalculateTrigAngleFactors()
    {
        this.angle = (this.angle + 2*Math.PI) % (2*Math.PI); // simplify / wrap angle (0-360)
        this.sinAngle = Math.sin(this.angle);
        this.cosAngle = Math.cos(this.angle);
    }
}

class Boid2 extends DrawableObject{ // BOID IS A DRAWABLE OBJECT INHHERIT FROM IT
    static distanceToAvoid;
    static widthOfBoid;
    static heightOfBoid;

    //Add static vars for angle change relative for each check
    static distanceToAvoid;
    static angleChangeTargeting;
    static angleChangeAvoiding;
    static angleChangeCohesion;
    static angleRandomChange;

    velocity;
    nearbyBoids = [];
    // angleChange;

    // How work
    constructor(xPosInp, yPosInp, angleInp, velocityInp) {
        super(xPosInp, yPosInp, angleInp);
        this.velocity = velocityInp
    }

    HandleOutOfBounds(){ // Uses modulous to ensure that it stays within the bounds. works all directoins with plus screenSize and mod
        this.xPosition = (this.xPosition + window.innerWidth) % window.innerWidth;
        this.yPosition = (this.yPosition + window.innerHeight) % window.innerHeight;
    }

    MoveWithVelocity()
    {
        this.xPosition += this.cosAngle * this.velocity;
        this.yPosition -= this.sinAngle * this.velocity;
    }
    RandomAngleChange(){
        this.angleChange += RandomNumberBetween(-1 * angleRandomChange, angleRandomChange);
        // this.angle += RandomNumberBetween(-1 * angleRandomChange, angleRandomChange);
    }
    MoveToCoords(coordX, coordY, angleDiff = angleChangeTargeting){ // make into  helpers
        //Find angle using arctan
        let relativeXPosition = coordX - this.xPosition;
        let relativeYPosition = -1*(coordY - this.yPosition);
        let angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);

        // Cope with arctan outputs
        if (relativeXPosition < 0){ 
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){
            angleFromBoid += Math.PI*2;
        }
        // console.log("Boid in deg: " + this.angle * 180 / Math.PI); console.log("Angle from : " + angleFromBoid * 180 / Math.PI);
        if((angleFromBoid > this.angle && angleFromBoid < this.angle + Math.PI) || angleFromBoid < this.angle - Math.PI){
            // this.angle += angleDiff; // Turn left
            this.angleChange += angleDiff;
        }
        else{
            // this.angle -= angleDiff; // Turn right
            this.angleChange -= angleDiff;
        }
    }
    MoveAwayFromCoords(coordX, coordY, angleDiff = angleChangeAvoiding){
        // opposite of MoveToCoords (same logic opp turn angle)
        let relativeXPosition = coordX - this.xPosition;
        let relativeYPosition = -1*(coordY - this.yPosition);
        let angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);

        if (relativeXPosition < 0){ // Handle weird Arctangent outputs
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){ // 4th quad will range from 270 - 360 with this
            angleFromBoid += Math.PI*2;
        }
        if((angleFromBoid > this.angle && angleFromBoid < this.angle + Math.PI) || angleFromBoid < this.angle - Math.PI){
            // this.angle -= angleDiff; // Turn Right
            this.angleChange -= angleDiff;
        }
        else{
            // this.angle += angleDiff; // Turn Left
            this.angleChange += angleDiff; 
        }
    }
    MoveTowardsCursor(){ 
        this.MoveToCoords(mouseXPosition, mouseYPosition, angleChangeTargeting); 
    } // Add fun thing for mouse off screen?

    MoveAwayFromObjectIfClose(objX, objY){  //distanceToAvoid
        if(DistanceBetweenPoints(this.xPosition, this.yPosition, objX, objY) < distanceToAvoid){
            this.MoveAwayFromCoords(objX, objY, angleChangeTargeting);
        }
    }
    GetArrayOfNearbyBoidsFromAll(){
        this.nearbyBoids = [];
        for(let i = 0; i < aFewBoids.length; i++){
            let distFromBoid = DistanceBetweenPoints(this.xPosition, this.yPosition, aFewBoids[i].xPosition, aFewBoids[i].yPosition);
            if(distFromBoid < distanceToAvoid && distFromBoid != 0){ // Do not add oneself to the arr this will cause issues
                this.nearbyBoids.push(aFewBoids[i]);
            }
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
    MoveAwayFromNearbyBoids(){ // Will this work well without a formula for how much angle to change?
        if(this.nearbyBoids.length == 0){
            return; // unneded but here for debugging
        }
        for(let i = 0; i < this.nearbyBoids.length; i++){
            this.MoveAwayFromCoords(this.nearbyBoids[i].xPosition, this.nearbyBoids[i].yPosition, angleChangeAvoiding);
        }
    }

    CoheasionToNearbyAngles(){ // Change this function, maybe to get further away boids
        if(this.nearbyBoids.length == 0){
            return; // early exit
        }
        var nearbyBoidAngleAvg = 0; // Get the average
        for(let i = 0; i < this.nearbyBoids.length; i++){
            nearbyBoidAngleAvg += this.nearbyBoids[i].angle;
        }
        this.nearbyBoidAngleAvg /= this.nearbyBoids.length;
        // Relative angle as coordinate away from boid. 
        this.MoveToCoords(this.xPosition + Math.cos(nearbyBoidAngleAvg), this.yPosition + Math.sin(nearbyBoidAngleAvg), angleChangeCohesion);
    }

    Update()
    {
        //First calculations
        this.angleChange = this.angle;
        this.CalculateTrigAngleFactors();
        
        // GetNeededInfo
        this.GetArrayOfNearbyBoidsFromAll();
        
        // Visual for nearby
        this.DrawLineToAllBoids();
        this.DrawLineToNearbyBoids();
        
        // Handle angle
        this.RandomAngleChange(); // fun fun
        this.MoveTowardsCursor(); // Cohesion (tweaking)
        // this.MoveAwayFromObjectIfClose(mouseXPosition, mouseYPosition);
        this.MoveAwayFromNearbyBoids(); // Seperation
        this.CoheasionToNearbyAngles(); // Allignment 
        this.angle = this.angleChange; // Angle changes do not affect one another (Needed?)

        // Handle Movement
        this.MoveWithVelocity();
        this.HandleOutOfBounds();
        
        // Display Boid
        this.DrawShape();
    }
};

function main()
{
    SetupCanvas();
    SetBoidStaticVars();

    // Initialize boids
    for(let i = 0; i < numBoids; i++){
        aFewBoids.push(new Boid2(RandomNumberBetween(0, window.innerWidth), 
        RandomNumberBetween(0, window.innerHeight),
        RandomNumberBetween(4, 5),
        Math.PI/2));
    }
    // for(let i = 0; i < numBoids; i++){
    //     aFewBoids.push(new Boid2(window.innerWidth/2, 
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
            aFewBoids[i].Update();
        }

        // console.log("Ran frame: " + frameCount);
    }, FrameRateInMsec);
}

window.addEventListener("load", StartProgram);

