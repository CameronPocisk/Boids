class BoidScreen{
    boidFlock;
    canvasBackground;

    mouseX;
    mouseY;
    framerateInMsec;
    constructor(){
        // some code idk
    }

    // Init canvas
    // Get static vals
    // Update
    // Change Canvas size
};

class Boid extends DrawableObject{ // BOID IS A DRAWABLE OBJECT INHHERIT FROM IT
    velocity;

    // How work
    constructor(xPosInp, yPosInp, angleInp, velocityInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.angle = angleInp;
        this.velocity = velocityInp
    }

};

class DrawableObject{
    xPosition;
    yPosition;

    angle;
    sinAngle;
    cosAngle;

    constructor(xPosInp, yPosInp, angleInp) {
        this.xPosition = xPosInp;
        this.yPosition = yPosInp;
        this.angle = angleInp;
    }

    DrawShape(){

    }
};