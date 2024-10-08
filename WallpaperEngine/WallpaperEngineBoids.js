class BoidScape{
    // Should not have statics -- instances should be able to be diff.
    // Every instance will hold one var with new possibilities
    // Functionality
    defaultVelocity;
    distanceToAvoid;
    angleChangeTargeting;
    angleChangeAvoiding;
    angleChangeCohesion;
    angleRandomChange;
    // Style
    widthOfBoids;
    heightOfBoids;
    widthOfBoidFrac;
    heightOfBoidFrac;
    nearStrokeColor;
    allStrokeColor;
    boidColor;
    backgroundColor;
    //Bools for Rools
    shouldSeperate;
    shouldAllign;
    shouldCohere;

    // These are globals from main program
    boidScapeCanvas;
    boidScapeContext; 
    mouseX;
    mouseY;
    FrameRateInMsec = (1/60) * 1000;

    nearbyMap = new WeakMap(); // Weakmap should work but inspect it
    everyBoid = []; // empty dec here?
    numBoids;

    constructor(
    canvasRef,
    numberOfBoids = 6,
    velocityForBoids = 5,         // Speed of each boid
    distanceToAvoidMultIn = 150,  // Make Multiple Of Width
    angleChangeTargetingIn =.05,  // How much to turn when following
    angleChangeAvoidingIn = .12,  // How much to turn avoiding
    angleChangeCohesionIn = .03,  // How much to turn to cohere
    angleRandomChangeIn = .04,    // How much to turn randomly
    widthOfBoidDenomIn = 50,      // fraction of canvas width
    heightOfBoidDenomIn = 25,     // fraction of canvas height
    nearStrokeColorIn = "#FFFFFF",
    allStrokeColorIn = "#50409A",
    boidColorIn = "#964EC2",
    backgroundColorIn = "#272530",
    shouldSeperateIn = true,
    shouldAllignIn = true,
    shouldCohereIn = true,
    shouldDrawToNearIn = true,
    shouldDrawToAlleIn = true){

        // General Items
        this.boidScapeCanvas = canvasRef;
        this.boidScapeCanvas.width = canvasRef.clientWidth; // This was a big bug fix, super annoying but makes sure that 
        this.boidScapeCanvas.height = canvasRef.clientHeight; // The canvas become the correct size from the html file
        this.boidScapeContext = this.boidScapeCanvas.getContext("2d");
        this.numBoids = numberOfBoids;
        
        // Functionality properties
        this.defaultVelocity = velocityForBoids;
        this.distanceToAvoid = distanceToAvoidMultIn;
        this.angleChangeTargeting = angleChangeTargetingIn;
        this.angleChangeAvoiding = angleChangeAvoidingIn;
        this.angleChangeCohesion = angleChangeCohesionIn;
        this.angleRandomChange = angleRandomChangeIn;
        
        //Styling
        this.widthOfBoidFrac = widthOfBoidDenomIn;
        this.heightOfBoidFrac = heightOfBoidDenomIn;
        this.widthOfBoids = this.boidScapeCanvas.height / this.widthOfBoidFrac;
        this.heightOfBoids = this.boidScapeCanvas.height / this.heightOfBoidFrac;
        this.boidScapeCanvas.style.backgroundColor = backgroundColorIn
        this.nearStrokeColor = nearStrokeColorIn;
        this.allStrokeColor = allStrokeColorIn;
        this.boidColor = boidColorIn;

        //Bools for Rools = ;
        this.shouldSeperate = shouldSeperateIn;
        this.shouldAllign = shouldAllignIn;
        this.shouldCohere = shouldCohereIn;

        this.reportMousePosition = this.reportMousePosition.bind(this);
        this.boidScapeCanvas.addEventListener('mousemove', this.reportMousePosition);
        
        this.reportResize = this.reportResize.bind(this);
        window.addEventListener('resize', this.reportResize); // This should not be in my thing I think but maybe not
        this.reportResize();

        this.InitBoidList(); // Should I do this?
    }

    reportMousePosition(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }
    reportResize(event){
        let canvasDiagonal = Math.sqrt(this.boidScapeCanvas.width**2 + this.boidScapeCanvas.height**2); 
        this.widthOfBoids = canvasDiagonal  / this.widthOfBoidFrac;
        this.heightOfBoids = canvasDiagonal / this.heightOfBoidFrac;        
    }

    // Calculation stuff / member functions used
    RandomNumberBetween(min, max){
        return min + Math.random() * (max - min);
    }
    DistanceBetweenPoints(x1, y1, x2, y2){
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    InitBoidList(){
        //Reinitialize the boid arr from constants
        this.everyBoid = [];
        for(let i = 0; i < this.numBoids; i++){
            this.everyBoid.push(new Boid
            // (this.RandomNumberBetween(0, this.boidScapeCanvas.width), //Starting X
            // this.RandomNumberBetween(0, this.boidScapeCanvas.height), // Starting Y
            (this.boidScapeCanvas.width/2, //Starting X
            this.boidScapeCanvas.height/2, // Starting Y
            this.RandomNumberBetween(0, Math.PI*2), // Starting angle
            this.defaultVelocity)); // Velocity
        }
    }

    FillCloseMap(){
        // Should I try to run this every few frames?
        // this.nearbyMap = new WeakMap();
        for(let i = 0; i < this.everyBoid.length; i++){
            this.nearbyMap.set(this.everyBoid[i], []);
        }
        
        for(let curBoidInd = 0; curBoidInd < this.everyBoid.length - 1; curBoidInd++){
            let mainKey = this.everyBoid[curBoidInd];
            let mainValue = this.nearbyMap.get(mainKey);
            
            for(let restItr = curBoidInd + 1; restItr < this.everyBoid.length; restItr++){
                
                let RelativeBoidKey = this.everyBoid[restItr];
                let RelativeBoidValue = this.nearbyMap.get(RelativeBoidKey);
                
                let distFromBoid = this.DistanceBetweenPoints(mainKey.xPosition, mainKey.yPosition, RelativeBoidKey.xPosition, RelativeBoidKey.yPosition);
                if(distFromBoid < this.distanceToAvoid){
                    // Could be one line but I this is easier to see for now
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
        for(let i = 0; i < this.everyBoid.length; i++){
            this.everyBoid[i].nearbyBoids = this.nearbyMap.get(this.everyBoid[i]);
        }
    }

    UpdateAllBoids()
    {
        this.FillCloseMap(); // Get the map
        this.SetKeyNearbyToValue(); // Set map elems nearbyLists

        for(let i = 0; i < this.everyBoid.length; i++){
            this.everyBoid[i].Update(this);
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
    DrawShape(canvasContext, shapeWidth, shapeHeight, shapeColor){ 
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
        canvasContext.fillStyle = shapeColor;
        canvasContext.fill();
    }
}

class Boid extends DrawableObject{

    velocity;
    nearbyBoids = [];
    angleChange; // needed?

    // Calls base constr with inps as well
    constructor(xPosInp, yPosInp, angleInp, velocityInp) {
        super(xPosInp, yPosInp, angleInp);
        this.velocity = velocityInp;
    }
    MoveWithVelocity()
    {
        this.xPosition += this.cosAngle * this.velocity;
        this.yPosition -= this.sinAngle * this.velocity;
    }

    HandleOutOfBounds(canvasIn){ // Uses modulous to ensure that it stays within the bounds. works all directoins with plus screenSize and mod
        this.xPosition = (this.xPosition + canvasIn.width) % canvasIn.width;
        this.yPosition = (this.yPosition + canvasIn.height) % canvasIn.height;
    }


    RandomAngleChange(andgleDiff, randomFn){
        this.angleChange += randomFn(-1 * andgleDiff, andgleDiff);
    }

    MoveToCoords(coordX, coordY, angleDiff){ // make into  helpers
        //Find angle using arctan
        let relativeXPosition = coordX - this.xPosition;
        let relativeYPosition = -1*(coordY - this.yPosition);
        let angleFromBoid = Math.atan(relativeYPosition / relativeXPosition);
        
        // Cope with arctan outputs
        if(relativeXPosition < 0){ 
            angleFromBoid += Math.PI;
        }
        else if(relativeYPosition < 0){
            angleFromBoid += Math.PI*2;
        }
        // console.log("Boid in deg: " + this.angle * 180 / Math.PI); console.log("Angle from : " + angleFromBoid * 180 / Math.PI);
        if((angleFromBoid > this.angle && angleFromBoid < this.angle + Math.PI) || angleFromBoid < this.angle - Math.PI){
            this.angleChange += angleDiff;
        }
        else{
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
            this.angleChange -= angleDiff;
        }
        else{
            this.angleChange += angleDiff; 
        }
    }

    MoveTowardsCursor(mouseXIn, MouseYIn, angleDiff){ 
        this.MoveToCoords(mouseXIn, MouseYIn, angleDiff); 
    } // Add fun thing for mouse off screen?
    MoveAwayFromObjectIfClose(objX, objY, avoidDist, angleDiff, distFn){
        if(distFn(this.xPosition, this.yPosition, objX, objY) < avoidDist){
            this.MoveAwayFromCoords(objX, objY, angleDiff);
        }
    }

    DrawLineToAllBoids(allBoids, canvasContextIn, strokeColor){
        for(let i = 0; i < allBoids.length; i++){
            canvasContextIn.beginPath();
            canvasContextIn.moveTo(this.xPosition, this.yPosition);
            canvasContextIn.lineTo(allBoids[i].xPosition, allBoids[i].yPosition);
            canvasContextIn.strokeStyle = strokeColor;
            canvasContextIn.stroke();
        }
    }
    DrawLineToNearbyBoids(canvasContextIn, strokeColor){
        for(let i = 0; i < this.nearbyBoids.length; i++){
            canvasContextIn.beginPath();
            canvasContextIn.moveTo(this.xPosition, this.yPosition);
            canvasContextIn.lineTo(this.nearbyBoids[i].xPosition, this.nearbyBoids[i].yPosition);
            canvasContextIn.strokeStyle = strokeColor;
            canvasContextIn.stroke();
        }
    }

    MoveAwayFromNearbyBoids(angleDiff){ // Will this work well without a formula for how much angle to change?
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

    Update(boidScapeIn)
    {
        //First calculations
        this.CalculateTrigAngleFactors();
        // Make sure angle change assignment (w/ modulous) comes first!
        // Avoids a bug where the angle can never get %'d and moves incorrectly
        this.angleChange %= Math.PI * 2;
        this.angleChange = this.angle;
        
        // Visual for nearby
        this.DrawLineToAllBoids(boidScapeIn.everyBoid, boidScapeIn.boidScapeContext, boidScapeIn.allStrokeColor);
        this.DrawLineToNearbyBoids(boidScapeIn.boidScapeContext, boidScapeIn.nearStrokeColor);
        
        // Handle angle
        this.RandomAngleChange(boidScapeIn.angleRandomChange, boidScapeIn.RandomNumberBetween); // fun fun
        this.MoveTowardsCursor(boidScapeIn.mouseX, boidScapeIn.mouseY, boidScapeIn.angleChangeTargeting); // Cohesion (tweaking)
        // this.MoveAwayFromObjectIfClose(mouseXPosition, mouseYPosition, distanceToAvoidIn, angleChangeAvoidingIn, boidScapeIn.DistanceBetweenPoints);
        this.MoveAwayFromNearbyBoids(boidScapeIn.angleChangeAvoiding); // Seperation
        this.CoheasionToNearbyAngles(boidScapeIn.angleChangeCohesion); // Allignment 
        this.angle = this.angleChange; // Angle changes do not affect another changes

        // Handle Movement
        this.MoveWithVelocity();
        this.HandleOutOfBounds(boidScapeIn.boidScapeCanvas);
        
        // Display Boid
        this.DrawShape(boidScapeIn.boidScapeContext, boidScapeIn.widthOfBoids, boidScapeIn.heightOfBoids, boidScapeIn.boidColor);
    }
};


// function StartProgram(){
//     main(); // Happens here so everthing starts once loaded. Helps with sizing and potential bugs
// }

// Make the canvas which resizes to whole wallpaper

const canvas = document.getElementById("wallpaperCanvas");
canvas.width = window.innerWidth; // Should happen onces bc wallpaper engine?
canvas.height = window.innerHeight; // As in there are no resizes

const wallpaperBoids = new BoidScape(canvas, 4);
wallpaperBoids.StartBoidProgram();


// Start adding user properties
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        console.log("Entering wallpaper properties tab")
        if (properties.customcolor) {
            // Convert the custom color to 0 - 255 range for CSS usage
            var customColor = properties.customcolor.value.split(' ');
            
            var colorFromWallp = '#' + (customColor[0]*255 << 8).toString(16) + 
            (customColor[1]*255 << 4).toString(16) + (customColor[2]*255).toString(16);
            console.log(colorFromWallp);
            wallpaperBoids.boidColor = colorFromWallp;
            // customColor = customColor.map(function(c) {
            //     return Math.ceil(c * 255);
            // });
            var customColorAsCSS = 'rgb(' + customColor + ')';
            // Do something useful with the value here or assign it to a global variable
        }
    },
};

// The first milestone will be to change the color
//  of the boids in the wallpaper boidscape isntance


// Another Goal will be to make sure that the screen 
// will cover the users wallpaper and the canvas will reflect the values