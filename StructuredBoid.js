// Made by Cameron Pocisk

// Globals and html related vars from HTML fncalls
const canvas = document.getElementById("boidPlane");
const context = canvas.getContext("2d");
var mouseXPosition = 1;
var mouseYPosition = 1;

// Where do these functoins go into?
function StartProgram(){
    main(); // Happens here so everthing starts once loaded. Helps with sizing and potential bugs
}

function ReportWindowSize(){
    console.log("Resize calledback");
    // heightOfBoids = window.innerHeight / 15;
    // widthOfBoids = window.innerWidth / 50;
}

// Mouse movements
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

class BoidScape{
    // Should not have statics -- instances should be able to be diff.
    // Every instance will hold one var with new possibilities
    // Parameterize all statics
    widthOfBoids;
    heightOfBoids;
    widthOfBoidFrac;
    heightOfBoidFrac;
    defaultVelocity;
    distanceToAvoid;
    angleChangeTargeting;
    angleChangeAvoiding;
    angleChangeCohesion;
    angleRandomChange;
    //Bools for Rools
    shouldSeperate;
    shouldAllign;
    shouldCohere;

    mouseX;
    mouseY;

    // These are globals from main program
    boidScapeCanvas;
    boidScapeContext; 
    FrameRateInMsec = (1/60) * 1000;

    everyBoid = []; // empty dec here?
    numBoids;
    nearbyMap = new WeakMap(); // Weakmap should work but inspect it

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


    // HUUUUUGEGEEEE CONSTRUCTOR WITH GIANT LIST OF DEFAULT VALUES
    // framerate = 60,
    constructor(
    canvasRef,
    numberOfBoids = 5,
    velocityForBoids = 5,
    widthOfBoidDenomIn = 30,      // fraction of innerheight window.innerWidth
    heightOfBoidDenomIn = 15,     // fraction of innerheight window.innerHeight
    distanceToAvoidMultIn = 200,  // Make Multiple Of Width
    angleChangeTargetingIn =.05, // How much to turn when following
    angleChangeAvoidingIn = .06, // How much to turn avoiding
    angleChangeCohesionIn = .03, // How much to turn to cohere
    angleRandomChangeIn = .1,    // How much to turn randomly
    shouldSeperateIn = true,
    shouldAllignIn = true,
    shouldCohereIn = true){

        this.boidScapeCanvas = canvasRef;
        this.boidScapeContext = this.boidScapeCanvas.getContext("2d");
        this.numBoids = numberOfBoids;
        // Set statics here to var ins

        this.defaultVelocity = velocityForBoids;

        this.widthOfBoids = this.boidScapeCanvas.height / widthOfBoidDenomIn;
        this.heightOfBoids = this.boidScapeCanvas.height / heightOfBoidDenomIn;
        this.widthOfBoidFrac = widthOfBoidDenomIn;
        this.heightOfBoidFrac = heightOfBoidDenomIn;

        this.distanceToAvoid = distanceToAvoidMultIn; // * 30 FIX
        this.angleChangeTargeting = angleChangeTargetingIn;
        this.angleChangeAvoiding = angleChangeAvoidingIn;
        this.angleChangeCohesion = angleChangeCohesionIn;
        this.angleRandomChange = angleRandomChangeIn;
        //Bools for Rools = ;
        this.shouldSeperate = shouldSeperateIn;
        this.shouldAllign = shouldAllignIn;
        this.shouldCohere = shouldCohereIn;

        // this.InitBoidList(); // Should I do this?
        this.reportMousePosition = this.reportMousePosition.bind(this);
        this.boidScapeCanvas.addEventListener('mousemove', this.reportMousePosition);

        this.OnCanvasResize = this.OnCanvasResize.bind(this);
        this.boidScapeCanvas.addEventListener('resize', this.OnCanvasResize);
        // Attach the resize event listener
        this.OnCanvasResize();

        // Initial setup

        // window.addEventListener("load", StartProgram);
    }

    OnCanvasResize(event){
        const rect = this.boidScapeCanvas.getBoundingClientRect();
        this.widthOfBoids = this.boidScapeCanvas.width / this.widthOfBoidFrac;
        this.heightOfBoids = this.boidScapeCanvas.height / this.heightOfBoidFrac;
        console.log("Canvas resized");
    }
    reportMousePosition(event) {
        // Get mouse coordinates
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }


    InitBoidList(){
        //Reinitialize the boid arr from constants
        this.everyBoid = [];
        for(let i = 0; i < this.numBoids; i++){
            this.everyBoid.push(new Boid(RandomNumberBetween(0, window.innerWidth), //Starting X
            RandomNumberBetween(0, window.innerHeight), // Starting Y
            RandomNumberBetween(0, Math.PI*2), // Starting angle
            this.defaultVelocity)); // Velocity
        }
    }

    FillCloseMap(){
        // this.nearbyMap.clear();
        this.nearbyMap = new WeakMap();
        for(let i = 0; i < this.everyBoid.length; i++){
            this.nearbyMap.set(this.everyBoid[i], []);
        }
        
        for(let curBoidInd = 0; curBoidInd < this.everyBoid.length - 1; curBoidInd++){
            let mainKey = this.everyBoid[curBoidInd];
            let mainValue = this.nearbyMap.get(mainKey);
            
            for(let restItr = curBoidInd + 1; restItr < this.everyBoid.length; restItr++){
                
                let RelativeBoidKey = this.everyBoid[restItr];
                let RelativeBoidValue = this.nearbyMap.get(RelativeBoidKey);
                

                let distFromBoid = DistanceBetweenPoints(mainKey.xPosition, mainKey.yPosition, RelativeBoidKey.xPosition, RelativeBoidKey.yPosition);
                if(distFromBoid < this.distanceToAvoid){
                    // Could be one line but I this is easier to see for now
                    // let mainValue = this.nearbyMap.get(mainKey);
                    mainValue.push(RelativeBoidKey);
                    this.nearbyMap.set(mainKey, mainValue);
                    // Also add curboid boid to the restItr boid

                    RelativeBoidValue.push(mainKey);
                    this.nearbyMap.set(RelativeBoidKey, RelativeBoidValue);
                }
            }
        }
    }

    SetKeyNearbyToValue(){
        // This Calls back on every boid (key) to set its nearby (to value)
        // If change to weak map forEach does not work and loop throuh arr
        // this.nearbyMap.forEach (function(value, key) {
        //     key.nearbyBoids = value;
        // });
        for(let i = 0; i < this.everyBoid.length; i++){
            this.everyBoid[i].nearbyBoids = this.nearbyMap.get(this.everyBoid[i]);
        }
    }

    UpdateAllBoids(){
        // I believe these should be out of loop

        // Does this need to happen after update?
        this.FillCloseMap(); // Get the map
        this.SetKeyNearbyToValue(); // Set map elems near lists

        for(let i = 0; i < this.everyBoid.length; i++){
            // Fill map for needed info
            // Update each boid
            this.everyBoid[i].Update(
                this.boidScapeContext,
                this.everyBoid,
                this.widthOfBoids,
                this.heightOfBoids,
                // this.widthOfBoidFrac,
                // this.heightOfBoidFrac,
                // this.distanceToAvoid,
                this.angleChangeTargeting,
                this.angleChangeAvoiding,
                this.angleChangeCohesion,
                this.angleRandomChange);
        }
    }

    // Call in constructor??
    StartBoidProgram(){
        var frameCount = 0;
        setInterval(() => {
            this.boidScapeContext.clearRect(0, 0, this.boidScapeCanvas.width, this.boidScapeCanvas.height);
            if(frameCount >= 60){
                frameCount = 0;
            }
            frameCount++;
            
            this.UpdateAllBoids();
            
            // This main loop IS updating
            // console.log("Ran frame: " + frameCount);
        }, (this.FrameRateInMsec));
    }
};


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
        this.CalculateTrigAngleFactors();
    }
    
    CalculateTrigAngleFactors()
    {
        this.angle = (this.angle + 2*Math.PI) % (2*Math.PI); // simplify / wrap angle (0-360)
        this.sinAngle = Math.sin(this.angle);
        this.cosAngle = Math.cos(this.angle);
    }
    // Is triangle rn, can I pass in functons?
    DrawShape(canvasContext, shapeWidth, shapeHeight){ 
        let firstXPoint = this.xPosition + (this.cosAngle * shapeHeight * 1/2);
        let firstYPoint = this.yPosition - (this.sinAngle * shapeHeight * 1/2);
        let secondXPoint= this.xPosition + (-1/2 * ((this.cosAngle * shapeHeight) - this.sinAngle * shapeWidth));
        let secondYPoint= this.yPosition - (-1/2 * ((this.sinAngle * shapeHeight) + this.cosAngle * shapeWidth));
        let thirdXPoint = this.xPosition + (-1/2 * ((this.cosAngle * shapeHeight) + this.sinAngle * shapeWidth));
        let thirdYPoint = this.yPosition - (-1/2 * ((this.sinAngle * shapeHeight) - this.cosAngle * shapeWidth));

        canvasContext.beginPath();

        canvasContext.moveTo(firstXPoint, firstYPoint);
        canvasContext.lineTo(secondXPoint, secondYPoint);
        canvasContext.lineTo(thirdXPoint, thirdYPoint);
        canvasContext.fillStyle = "#56554E";
        canvasContext.fill();
    }
}

class Boid extends DrawableObject{ // BOID IS A DRAWABLE OBJECT INHHERIT FROM IT

    velocity;
    nearbyBoids = []; // Is this too much space or will this just be a ref to an obj so its chill
    angleChange; // needed?

    // Calls base constr with inps as well
    constructor(xPosInp, yPosInp, angleInp, velocityInp) {
        super(xPosInp, yPosInp, angleInp);
        this.velocity = velocityInp;
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

    RandomAngleChange(andgleDiff){
        this.angleChange += RandomNumberBetween(-1 * andgleDiff, andgleDiff);
        // this.angle += RandomNumberBetween(-1 * angleRandomChange, angleRandomChange);
    }
    MoveToCoords(coordX, coordY, angleDiff){ // make into  helpers
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
    MoveAwayFromCoords(coordX, coordY, angleDiff){
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
    MoveTowardsCursor(angleDiff){ 
        this.MoveToCoords(mouseXPosition, mouseYPosition, angleDiff); 
    } // Add fun thing for mouse off screen?

    MoveAwayFromObjectIfClose(objX, objY, avoidDist, angleDiff){  //distanceToAvoid
        if(DistanceBetweenPoints(this.xPosition, this.yPosition, objX, objY) < avoidDist){
            this.MoveAwayFromCoords(objX, objY, angleDiff);
        }
    }

    DrawLineToAllBoids(allBoids, canvasContextIn, strokeColor = "#00FF00"){
        for(let i = 0; i < allBoids.length; i++){
            canvasContextIn.beginPath();
            canvasContextIn.moveTo(this.xPosition, this.yPosition);
            canvasContextIn.lineTo(allBoids[i].xPosition, allBoids[i].yPosition);
            canvasContextIn.strokeStyle = strokeColor;
            canvasContextIn.stroke();
        }
    }
    DrawLineToNearbyBoids(canvasContextIn, strokeColor = "#FF0000"){
        for(let i = 0; i < this.nearbyBoids.length; i++){
            canvasContextIn.beginPath();
            canvasContextIn.moveTo(this.xPosition, this.yPosition);
            canvasContextIn.lineTo(this.nearbyBoids[i].xPosition, this.nearbyBoids[i].yPosition);
            canvasContextIn.strokeStyle = strokeColor;
            canvasContextIn.stroke();
        }
    }

    MoveAwayFromNearbyBoids(angleDiff){ // Will this work well without a formula for how much angle to change?
        if(this.nearbyBoids.length == 0){
            return; // unneded but here for debugging
        }
        for(let i = 0; i < this.nearbyBoids.length; i++){
            this.MoveAwayFromCoords(this.nearbyBoids[i].xPosition, this.nearbyBoids[i].yPosition, angleDiff);
        }
    }
    CoheasionToNearbyAngles(angleDiff){ // Change this function, maybe to get further away boids
        if(this.nearbyBoids.length == 0){
            return; // early exit
        }
        var nearbyBoidAngleAvg = 0; // Get the average
        for(let i = 0; i < this.nearbyBoids.length; i++){
            nearbyBoidAngleAvg += this.nearbyBoids[i].angle;
        }
        this.nearbyBoidAngleAvg /= this.nearbyBoids.length;
        // Relative angle as coordinate away from boid. 
        this.MoveToCoords(this.xPosition + Math.cos(nearbyBoidAngleAvg), this.yPosition + Math.sin(nearbyBoidAngleAvg), angleDiff);
    }
    // Should be done with auto callback after map in BoidScape
    // SetNearbyBoidListTo(nearbyIn){
    //     this.nearbyBoids = nearbyIn;
    // }

    Update(
        canvasContextIn,
        allBoidsIn,
        widthOfBoidIn,
        heightOfBoidIn,
        // widthOfBoidFracIn,
        // heightOfBoidFracIn,
        // distanceToAvoidIn,
        angleChangeTargetingIn,
        angleChangeAvoidingIn,
        angleChangeCohesionIn,
        angleRandomChangeIn,
    )
    {
        //First calculations
        this.angleChange = this.angle;
        this.CalculateTrigAngleFactors();
        
        // Visual for nearby
        this.DrawLineToAllBoids(allBoidsIn, canvasContextIn);
        this.DrawLineToNearbyBoids(canvasContextIn);
        
        // Handle angle
        this.RandomAngleChange(angleRandomChangeIn); // fun fun
        this.MoveTowardsCursor(angleChangeTargetingIn); // Cohesion (tweaking)
        // this.MoveAwayFromObjectIfClose(mouseXPosition, mouseYPosition, distanceToAvoidIn, angleChangeAvoidingIn);
        this.MoveAwayFromNearbyBoids(angleChangeAvoidingIn); // Seperation
        this.CoheasionToNearbyAngles(angleChangeCohesionIn); // Allignment 
        this.angle = this.angleChange; // Angle changes do not affect one another (Needed?)

        // Handle Movement
        this.MoveWithVelocity();
        this.HandleOutOfBounds();
        
        // Display Boid
        this.DrawShape(canvasContextIn, widthOfBoidIn, heightOfBoidIn);
    }
};

function main()
{
    SetupCanvas();

    const boidSim = new BoidScape(canvas, 5); // There is data here

    boidSim.InitBoidList(); // Should I do this?
    // boidSim.everyBoid[0].CalculateTrigAngleFactors();
    // boidSim.everyBoid[0].DrawShape(boidSim.boidScapeContext, 30, 40); // This is working at least
    boidSim.StartBoidProgram();

}

window.addEventListener("load", StartProgram);
