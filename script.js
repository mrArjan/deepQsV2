// Pastel colors for the cards
const pastelColors = [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFB3", "#BAE1FF",
  "#FFC3BA", "#FFABAB", "#FFC3A0", "#D5AAFF", "#A0CED9"
];

// Elements
const languageSelect = document.getElementById("languageSelect");
const cardContainer = document.getElementById("cardContainer");
const card = cardContainer.querySelector(".card");
const questionText = document.getElementById("questionText");
const shuffleButton = document.getElementById("shuffleButton");

let currentLanguage = "en"; // Default language is English
let remainingQuestions = [...questions[currentLanguage]]; // Copy of questions in the selected language

// Function to reset the questions when they run out
function resetQuestions() {
  remainingQuestions = [...questions[currentLanguage]]; // Refresh the list for the selected language
}

// Function to pick a random question without repetition
function getRandomQuestion() {
  if (remainingQuestions.length === 0) {
    alert("All questions have been asked. Resetting the questions.");
    resetQuestions();
  }
  const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
  const question = remainingQuestions[randomIndex];
  remainingQuestions.splice(randomIndex, 1); // Remove selected question from remaining
  return question;
}

// Function to get a random pastel color
function getRandomPastelColor() {
  const randomIndex = Math.floor(Math.random() * pastelColors.length);
  return pastelColors[randomIndex];
}

// Function to flip the card to show the back with the question
function flipCard() {
  if (!card.classList.contains("flipped")) {
    questionText.innerText = getRandomQuestion();
    card.classList.add("flipped");

    // Disable language selection when question is revealed
    languageSelect.disabled = true;
  }
}

// Function to reset the card to the front
function resetCard() {
  if (card.classList.contains("flipped")) {
    card.classList.remove("flipped");
    questionText.innerText = "";
  }

  // Re-enable language selection after reset or shuffle
  languageSelect.disabled = false;
}

// Function to change the card's color with a delay for a smooth transition
function changeCardColor() {
  card.querySelector('.card-front').style.backgroundColor = getRandomPastelColor();
  card.querySelector('.card-back').style.backgroundColor = getRandomPastelColor();
}

// Function to simulate shuffle animation
function shuffleCards() {
  if (card.classList.contains("flipped")) {
    card.classList.remove("flipped");

    // Wait for the flip back animation before starting shuffle
    setTimeout(() => {
      cardContainer.classList.add("shuffle-active");

      setTimeout(() => {
        cardContainer.classList.remove("shuffle-active");
        resetCard(); // Reset the card after shuffle

        // Smoothly change color after shuffle animation
        setTimeout(changeCardColor, 200); // Delay to wait for shuffle to complete
      }, 600); // Shuffle duration matches CSS animation
    }, 800); // Flip back duration
  } else {
    cardContainer.classList.add("shuffle-active");

    setTimeout(() => {
      cardContainer.classList.remove("shuffle-active");
      resetCard(); // Reset the card after shuffle

      // Smoothly change color after shuffle animation
      setTimeout(changeCardColor, 200); // Delay to wait for shuffle to complete
    }, 600); // Shuffle duration matches CSS animation
  }
}

// Event listeners
card.addEventListener("click", flipCard);
shuffleButton.addEventListener("click", shuffleCards);

// Change language when selecting from dropdown
languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;
  resetQuestions(); // Reset questions for the new language
  resetCard(); // Reset the card when language is changed
});
