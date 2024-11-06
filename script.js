// script.js

// Pastel colors for the cards
const pastelColors = [
    "#FFB3BA",
    "#FFDFBA",
    "#FFFFBA",
    "#BAFFB3",
    "#BAE1FF",
    "#FFC3BA",
    "#FFABAB",
    "#FFC3A0",
    "#D5AAFF",
    "#A0CED9"
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
  
      // Re-enable language selection when shuffle button is clicked
      languageSelect.disabled = false;
    }
  }
  
  // Event listeners
  card.addEventListener("click", flipCard);
  
  shuffleButton.addEventListener("click", () => {
    resetCard();
    // Set new random pastel colors for the front and back of the card on shuffle
    card.querySelector('.card-front').style.backgroundColor = getRandomPastelColor();
    card.querySelector('.card-back').style.backgroundColor = getRandomPastelColor();
  });
  
  // Change language when selecting from dropdown
  languageSelect.addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    resetQuestions(); // Reset questions for the new language
    resetCard(); // Reset the card when language is changed
  });
  
  
  // timer function
  