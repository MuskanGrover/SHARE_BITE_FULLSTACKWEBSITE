const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let hero = { x: 50, y: 300, width: 50, height: 50, speed: 5, dx: 0, dy: 0 }; // Hero's initial position
let foodItems = []; // Array to hold food objects
let score = 0; // Player score
let gameOver = false; // Game status
let timeLeft = 50; // Time limit in seconds
let maxScore = 500; // Maximum allowed score

// Example hero image
const heroImg = new Image();
heroImg.src = "hero.png"; // Correct path to the hero image

// Food sound
let foodSound = new Audio("sound.mp3"); // Correct path to the sound file

// Listen for keyboard input to control the hero
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Function to move the hero based on key input
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        hero.dx = hero.speed;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        hero.dx = -hero.speed;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
        hero.dy = -hero.speed;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        hero.dy = hero.speed;
    }
}

function keyUpHandler(e) {
    if (["Right", "ArrowRight", "Left", "ArrowLeft"].includes(e.key)) {
        hero.dx = 0;
    }
    if (["Up", "ArrowUp", "Down", "ArrowDown"].includes(e.key)) {
        hero.dy = 0;
    }
}

// Function to update hero position
function moveHero() {
    hero.x += hero.dx;
    hero.y += hero.dy;

    // Prevent hero from moving out of bounds
    hero.x = Math.max(0, Math.min(canvas.width - hero.width, hero.x));
    hero.y = Math.max(0, Math.min(canvas.height - hero.height, hero.y));
}

// Function to spawn multiple food items
function createFood(count = 10) {
    for (let i = 0; i < count; i++) {
        let food = {
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * (canvas.height - 30),
            width: 30,
            height: 30,
            img: new Image()
        };
        food.img.src = "gamefood.jpeg"; // Correct path to the food image
        foodItems.push(food);
    }
}

// Draw food items on the canvas
function drawFood() {
    foodItems.forEach(food => {
        ctx.drawImage(food.img, food.x, food.y, food.width, food.height);
    });
}

// Check if hero collides with food
function checkFoodCollision() {
    for (let i = foodItems.length - 1; i >= 0; i--) {
        let food = foodItems[i];
        if (
            hero.x < food.x + food.width &&
            hero.x + hero.width > food.x &&
            hero.y < food.y + food.height &&
            hero.y + hero.height > food.y
        ) {
            // Play sound
            foodSound.play();

            // Increase score but limit it to maxScore
            if (score < maxScore) {
                score = Math.min(score + 10, maxScore);
            }
            
            foodItems.splice(i, 1); // Remove the collected food

            // Spawn a new food item
            createFood(1);

            // Update score display
            document.getElementById("score").textContent = score;
        }
    }
}

// Check if the game is over (time runs out or no food items)
function checkGameOver() {
    if (timeLeft <= 0 || foodItems.length === 0 || score >= maxScore) {
        gameOver = true;
        sendScoreToBackend();
    }
}

// Function to draw the hero on the canvas
function drawHero() {
    ctx.drawImage(heroImg, hero.x, hero.y, hero.width, hero.height);
}

// Function to update the timer
function updateTimer() {
    const timerElement = document.getElementById("timer");
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;
    } else {
        gameOver = true;
        sendScoreToBackend();
    }
}

// Function to send score to the backend
let scoreSubmitted = false; // Prevent multiple score submissions

function sendScoreToBackend() {
    if (scoreSubmitted) return; // Prevent duplicate requests
    scoreSubmitted = true;

    const email = localStorage.getItem("userEmail"); // Retrieve stored email
    if (!email) {
        alert("No user email found. Score not saved.");
        return;
    }

    fetch("/gametwo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, score })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Game Over! Your score: ${score}. ${data.message}`);
    })
    .catch(error => {
        console.error("Error saving score:", error);
    });
}

// Game loop function
function gameLoop() {
    if (gameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw hero and move it
    drawHero();
    moveHero();

    // Draw food and check for collisions
    drawFood();
    checkFoodCollision();

    // Check if the game is over
    checkGameOver();

    // Request a new frame
    requestAnimationFrame(gameLoop);
}

// Start the game by creating initial food items
createFood(5); // Start with 5 food items

// Start the game loop and timer
gameLoop();
setInterval(updateTimer, 1000);
