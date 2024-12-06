// Define custom heart icon for markers
var heartIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', // Heart image
    iconSize: [30, 30],  // Adjust size to fit better
    iconAnchor: [15, 30],  // Adjust anchor position
    popupAnchor: [0, -30],  // Popup anchor
});

// Extend locations with quiz data
var locations = [
    {
        name: "Liljeholmen",
        lat: 59.3115,
        lng: 18.0270,
        memory: "Man, that's the first time we met!",
        music: "https://open.spotify.com/embed/track/6ChdMi0GZVAM6ENMwNvyjk",  // Correct embed URL
        quiz: {
            question: "how old were u when we meet?",
            options: ["17", "18", "19"],
            correct: "18"
        },
        locked: false
    },
    {
        name: "Rågsved",
        lat: 59.2290,
        lng: 18.1061,
        memory: "You already know, but it was the first time I went to your house and met your sister and Ousman.",
        music: "https://open.spotify.com/embed/track/1mVLbFwad1wce7mAhFw2Ih",  // Correct embed URL
        quiz: {
            question: "What did we eat there your first birthday in Sweden and together?",
            options: ["pizza", "kotbullar and potatis", "rice and chicken"],
            correct: "kotbullar and potatis"
        },
        locked: true
    },
    {
        name: "Märsta",
        lat: 59.6156,
        lng: 17.6664,
        memory: "It was tough, but was the first time we were living together man!",
        music: "https://open.spotify.com/embed/track/7s2EPEksVMUpvoIC1YGbKq",  // Correct embed URL
        quiz: {
            question: "What did u steal from the house?",
            options: ["Food", "Frank's cap", "the body weight"],
            correct: "the body weight"
        },
        locked: true
    },
    {
        name: "Högdalen",
        lat: 59.2681,
        lng: 18.0867,
        memory: "I mostly remember this day because of the place you brought me, remember? The burger there was fire!!",
        music: "https://open.spotify.com/embed/track/6YOu6YH3Vzgi5Dfj1N6Cnx",  // Correct embed URL
        quiz: {
            question: "Why did you bring me there?",
            options: ["because you felt like", "I was mad and hungry", "we were celebrating after Ramadan"],
            correct: "we were celebrating after Ramadan"
        },
        locked: true
    },
    {
        name: "Älvsjö",
        lat: 59.2545,
        lng: 18.0212,
        memory: "I don't know if you remember but one day I shared something with you really personal, one clue? I wrote it.",
        music: "https://open.spotify.com/embed/track/720XllkKq9Pmjk1KOS7Z0F",  // Correct embed URL
        quiz: {
            question: "You froze one day because...?",
            options: ["winters are cold in Sweden", "we jumped naked to a pool", "you forgot your jacket"],
            correct: "we jumped naked to a pool"
        },
        locked: true
    },
    {
        name: "Fisksätra",
        lat: 59.2234,
        lng: 18.1105,
        memory: "You live there, and even though the old woman is evil asf and you're starving, I brought you some food <3",
        music: "https://open.spotify.com/embed/track/6oLANSb6vq2T5tIg92FxCW",  // Correct embed URL
        quiz: {
            question: "What was the first issue in the room?",
            options: ["Ousman stinky xd", "the evil woman", "the neighborhood"],
            correct: "Ousman stinky xd"
        },
        locked: true
    },
    {
        name: "Solna",
        lat: 59.3654,
        lng: 18.0224,
        memory: "That's when you started MMA, you're so big, you will make it I swear.",
        music: "https://open.spotify.com/embed/track/2fZ00UKwotKWzHPGdNtdK9",  // Correct embed URL
        quiz: {
            question: "During summer the coach sent your group to run and bust your asses, where?",
            options: ["in the gym man", "bro I don't remember", "in the park next to Allstars"],
            correct: "in the park next to Allstars"
        },
        locked: true
    }
];

var unlockedLocationsCount = 0; // Track how many locations have been unlocked
var totalLocations = locations.length; // Total locations

// Add markers with quiz functionality
locations.forEach(function(location) {
    var marker = L.marker([location.lat, location.lng], { icon: heartIcon }).addTo(map);

    // Generate quiz HTML
    var quizHTML = `
        <p><b>Quiz:</b> ${location.quiz.question}</p>
        ${location.quiz.options.map((option, index) => 
            `<button class="quiz-option" data-answer="${option}" data-correct="${location.quiz.correct}">${index + 1}. ${option}</button>`
        ).join("")}
        <div class="quiz-feedback" style="margin-top: 10px; font-weight: bold;"></div>
    `;

    // Add popup with quiz and music
    marker.bindPopup(
        `<b>${location.name}</b><br>${location.memory}<br>
        <iframe style="border-radius:12px" 
            src="${location.music.replace('open.spotify.com', 'open.spotify.com/embed')}" 
            width="300" height="80" frameborder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe><br>
        ${quizHTML}`
    );

    // Add event listener for quiz buttons
    marker.on('popupopen', function() {
        var popup = marker.getPopup();
        var popupContent = popup.getElement();
        var buttons = popupContent.querySelectorAll(".quiz-option");

        buttons.forEach(function(button) {
            button.addEventListener('click', function() {
                var userAnswer = button.getAttribute("data-answer");
                var correctAnswer = button.getAttribute("data-correct");
                var feedbackDiv = popupContent.querySelector(".quiz-feedback");

                if (userAnswer === correctAnswer) {
                    feedbackDiv.innerHTML = "🎉 Correct!";
                    feedbackDiv.style.color = "green";
                    unlockedLocationsCount++; // Increment unlocked locations count

                    // Check if all locations are unlocked
                    if (unlockedLocationsCount === totalLocations) {
                        displayCompletionMessage(); // Display completion message
                    }
                } else {
                    feedbackDiv.innerHTML = "❌ Incorrect! Try again.";
                    feedbackDiv.style.color = "red";
                }
            });
        });
    });
});

// Function to display completion message
function displayCompletionMessage() {
    // Create the completion message element
    var messageDiv = document.createElement('div');
    messageDiv.innerHTML = "<h3>You have already covered the entire map, I hope you liked it <3</h3>";
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "50%";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.backgroundColor = "#fff";
    messageDiv.style.padding = "20px";
    messageDiv.style.borderRadius = "10px";
    messageDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    messageDiv.style.zIndex = "1000";

    // Append the message to the body
    document.body.appendChild(messageDiv);
}

// Optionally, set the initial view to a better zoom level and fit all markers
map.setView([59.3293, 18.0686], 12); // Adjusting zoom level
map.fitBounds(locations.map(function(location) {
    return [location.lat, location.lng];
}));

// Define the correct password
const correctPassword = "111"; // Change this to your desired password

// Function to check password
function checkPassword() {
    const userPassword = document.getElementById("password-input").value.trim(); // Remove extra spaces
    const errorMessage = document.getElementById("error-message");

    // Clear any previous error message
    errorMessage.style.display = "none";

    if (userPassword === correctPassword) {
        // Hide the password modal and show the map
        document.getElementById("password-modal").style.display = "none";
        document.getElementById("map").style.visibility = "visible";
    } else {
        // Show an error message if the password is incorrect
        errorMessage.style.display = "block";
    }
}

// Event listener for the submit button
document.getElementById("password-submit").addEventListener('click', checkPassword);






// Function to check if all locations are unlocked
function checkAllLocationsUnlocked() {
    if (locations.every(location => !location.locked)) {
        // All locations unlocked, show the success message
        showUnlockMessage();
    }
}

// Function to display a success message after all locations are unlocked
function showUnlockMessage() {
    const unlockMessage = document.getElementById("unlock-message");
    unlockMessage.classList.add("visible");
    unlockMessage.classList.remove("hidden")}