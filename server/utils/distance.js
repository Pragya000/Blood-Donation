import geolib from 'geolib';

export function getRandomCoordinates(center, radius) {
    const distance = radius * 1000; // Convert km to meters
    const randomDistance = Math.random() * distance;
    const randomBearing = Math.random() * 360; // Random bearing in degrees

    // Generate a random destination point
    const randomPoint = geolib.computeDestinationPoint(center, randomDistance, randomBearing);
    
    return randomPoint;
}