let db;
let words = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  noStroke();

  setupFirebase();

  // Add handlers
  select('#clearBtn').mousePressed(clearCollage);
  select('#saveBtn').mousePressed(() => saveCanvas("word_collage", "png"));
}

function setupFirebase() {
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.database();

  db.ref("words").on("child_added", (data) => {
    const w = data.val();
    words.push(w);
    drawWord(w);
  });

  db.ref("words").on("value", (snapshot) => {
    if (!snapshot.exists()) {
      words = [];
      clear();
      background(255);
    }
  });
}

function draw() {
  // No continuous draw needed
}

function mousePressed() {
  let input = document.getElementById("textInput").value.trim();
  if (!input) return;

  let wordObj = {
    text: input,
    x: mouseX,
    y: mouseY,
    size: random(20, 60),
    angle: random(-45, 45),
    color: [random(0, 255), random(0, 255), random(0, 255)]
  };

  db.ref("words").push(wordObj);
  document.getElementById("textInput").value = "";
}

function drawWord(w) {
  push();
  translate(w.x, w.y);
  rotate(w.angle);
  fill(w.color[0], w.color[1], w.color[2]);
  textSize(w.size);
  text(w.text, 0, 0);
  pop();
}

function clearCollage() {
  const confirmClear = confirm("Clear all words from the collage?");
  if (confirmClear) {
    db.ref("words").remove();
  }
}
