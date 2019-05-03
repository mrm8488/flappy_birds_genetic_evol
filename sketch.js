// Daniel Shiffman & Manuel Romero
// Neuro-Evolution Flappy Bird with TensorFlow.js
// http://thecodingtrain.com
// https://youtu.be/cdUNkwXx-I4

const TOTAL = 250;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;

let bg;
let slider;
let displayGeneration;
let displaySpeed;
let generationNumber = 1;

function keyPressed() {
  if (key === "S" || key === "s") {
    let bird = birds[0];
    saveJSON(bird.brain, "bird.json");
  }
}

function setup() {
  bg = loadImage("background.png");
  createCanvas(640, 480);
  displayGeneration = createP("Generation");
  displaySpeed = createP("Speed");
  slider = createSlider(1, 10, 1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }

  tf.setBackend('cpu');
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length === 0) {
      counter = 0;
      generationNumber++;
      nextGeneration();
      pipes = [];
    }
  }

  // All the drawing stuff
  background(bg);

  displayGeneration.html(
    `Generation Number: <strong>${generationNumber}</strong>`
  );

  displaySpeed.html(`Speed:`);

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }
}

// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
// }
