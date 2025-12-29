document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const card = document.querySelector('.card');
    const questionText = document.getElementById('questionText');
    const languageSelect = document.getElementById('languageSelect');
    const shuffleButton = document.getElementById('shuffleButton');
    const cardFaceBack = document.querySelector('.card-back');
    const cardContainer = document.querySelector('.card-container');
    const categoryButtons = document.querySelectorAll('.cat-btn');

    // --- GLOW COLORS (For Box Shadow) ---
    // These create a magical halo behind the card instead of a sharp border
    const glowColors = [
        '#FF9A9E', // Pink
        '#a18cd1', // Purple
        '#84fab0', // Aqua
        '#fccb90', // Sunset Orange
        '#e0c3fc', // Lavender
        '#ffffff'  // Pure White
    ];

    // --- STATE ---
    let currentLang = 'en';
    let currentCategory = 'random';
    let currentDeck = [];
    let isFlipped = false;

    // --- CORE LOGIC ---
    function initDeck() {
        currentLang = languageSelect.value || 'en';
        
        const langData = questions[currentLang];
        
        if (langData) {
            if (currentCategory === 'random') {
                currentDeck = [...langData.family, ...langData.goals, ...langData.relationship];
            } else if (langData[currentCategory]) {
                currentDeck = [...langData[currentCategory]];
            } else {
                currentDeck = ["Category Error"];
            }
            shuffleArray(currentDeck);
        }
        
        // Reset to Front
        if (isFlipped) {
            card.classList.remove('flipped');
            isFlipped = false;
            // Remove glow
            setTimeout(() => {
                card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
            }, 300);
        }

        // Update Text for Front
        setTimeout(() => {
            const label = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
            const tapText = document.querySelector('.card-front span');
            if(tapText) tapText.textContent = `Tap for ${label}`;
        }, 300);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleCardClick() {
        if (isFlipped) {
            card.classList.remove('flipped');
            isFlipped = false;
            // Reset to dark shadow when closed
            setTimeout(() => {
                card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
            }, 300);
            return;
        }

        if (currentDeck.length === 0) {
            alert(currentLang === 'en' ? "Reshuffling deck!" : "Ihahalo ulit!");
            initDeck();
            return;
        }

        const nextQuestion = currentDeck.pop();
        questionText.textContent = nextQuestion;

        // APPLY GLOW EFFECT
        const randomColor = glowColors[Math.floor(Math.random() * glowColors.length)];
        // The '80' at the end adds transparency (about 50% opacity)
        card.style.boxShadow = `0 0 30px ${randomColor}90`;

        card.classList.add('flipped');
        isFlipped = true;
    }

    function performShuffleAnimation() {
        if (isFlipped) {
            card.classList.remove('flipped');
            isFlipped = false;
            card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
        }
        cardContainer.classList.add('shuffle-active');
        shuffleButton.disabled = true;
        setTimeout(() => {
            initDeck();
            cardContainer.classList.remove('shuffle-active');
            shuffleButton.disabled = false;
        }, 600);
    }

    // --- EVENT LISTENERS ---
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            performShuffleAnimation(); 
        });
    });

    card.addEventListener('click', handleCardClick);
    languageSelect.addEventListener('change', initDeck);
    shuffleButton.addEventListener('click', performShuffleAnimation);

    // --- GALAXY BACKGROUND ---
    function createBackgroundStars() {
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.width = star.style.height = `${Math.random() * 2}px`; // Smaller stars
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            document.body.appendChild(star);
        }
    }
    
    function createShootingStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        // Start mostly from top/left
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 40}vh`;
        
        const moveX = (Math.random() - 0.5) * 400 + 200;
        const moveY = Math.random() * 300 + 200;
        
        star.style.setProperty('--endX', `${moveX}px`);
        star.style.setProperty('--endY', `${moveY}px`);
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 3000);
    }

    initDeck();
    createBackgroundStars();
    setInterval(createShootingStar, 3000);
});