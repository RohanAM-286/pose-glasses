let video;
let poseNet;
let poses = []; // To store detected poses

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO); // Capture video from webcam
    video.size(width, height);
    video.hide(); // Hide the default video element

    // Initialize PoseNet
    poseNet = ml5.poseNet(video, modelReady);

    // Listen for pose estimations
    poseNet.on('pose', gotPoses);
}

function modelReady() {
    console.log('PoseNet model loaded!');
}

function gotPoses(results) {
    // Callback function when new poses are detected
    poses = results;
}
function draw() {
    image(video, 0, 0, width, height); // Display the video feed

    // Draw all the detected poses
    drawKeypoints();
    drawSkeleton();
    drawSpectacles();

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            // Only draw keypoints with a confidence score above a certain threshold
            if (keypoint.score > 0.2) {
                fill(255, 0, 0); // Red color for keypoints
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(0, 255, 0); // Green color for skeletons
            strokeWeight(2);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

let spectacles;
function preload() {
    spectacles = loadImage("specs2.png");
}


function drawSpectacles() {
    if (poses.length > 0) {
        let pose = poses[0].pose;

        let leftEye = pose.keypoints.find(k => k.part === 'leftEye');
        let rightEye = pose.keypoints.find(k => k.part === 'rightEye');

        if (leftEye.score > 0.5 && rightEye.score > 0.5) {
            // Calculate center and angle
            let eyeX = (leftEye.position.x + rightEye.position.x) / 2;
            let eyeY = (leftEye.position.y + rightEye.position.y) / 2;
            let eyeDist = dist(leftEye.position.x, leftEye.position.y, rightEye.position.x, rightEye.position.y);
            
            push();
            translate(eyeX, eyeY);
            
            imageMode(CENTER);
            image(spectacles, 0, 0, eyeDist * 2, eyeDist); // Adjust scale as needed
            pop();
        }
    }
}
