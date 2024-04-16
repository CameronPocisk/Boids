Personal project on Boids, neat flocking simulation!

Boids are similar to Birds, they are bird-oid objects! 
Boids represent a flocking simulation by following three simple rules 
1. Alignment  - Boids will move towards a point
2. Avoidance  - Boids will avoid each other
3. Cohesion   - Boids will steer in the same general direction

Much like Conway's Game of Life, It's typically a zero-player game
However, in my version, Boids will follow the mouse!
Although zero-player games are fascinating, this causes it to have a 'player', YOU!


Open the Boids.html file and watch the boids interactively jostle for position!


DESIGN DECISIONS:

Setup:

    Creating the boids and running the program is very simple
        1. Create a canvas that follows your rules
        2. Initialize a 'BoidScape' that inputs the canvas and desired # of boids and optional parameters
        3. Start the program with the method StartBoidProgram()

    I wanted to get to a design point where the boidscape would be isolated and simple
    This is so that the user could put inside smaller moving/non-moving divs

    The setup has many optional parameters that can be set from the get-go, try them out


Boid avoidance:

    Boids avoid other boids by adjusting their angle from the closest boid
    The amount it can steer at once is the 'angleChangeAvoiding' property. It can be adjusted at will
    This is why you may have noticed the boids touching each other. Higher angles reduce collisions

    I made an interesting algorithm to get the list of nearby boids for every boid - 
    The algorithm makes a map with the keys representing each Boid and the values storing the nearby ones
    The first boid iterates through the rest of the boids and marks boids that are nearby
    It then adds nearbys to its value and itself the nerby boids values
    This allows the next boid to not have to look at all of the previous boids and speed up the program

    
Cursor following:

    You may be asking why have the Boids follow the cursor instead of the usual pointing position?
    I thought that this was a very fun way to observe the behavior of the boids, unlike any other demonstration
    It is sad that it no longer is 0-player, however it is similar in that it still shows emergent behaviors




FUTURE PLANS:

    Code still needs to be cleaned up in some places

    Add wallpaper engine parameter support
    (wallpaper engine is software that allows users to make their background an html file)
    Progress is already made and this was intended to be made into a wallpaper from the start