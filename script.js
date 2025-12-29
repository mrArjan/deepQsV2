document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const card = document.querySelector('.card');
    const questionText = document.getElementById('questionText');
    const languageSelect = document.getElementById('languageSelect');
    const shuffleButton = document.getElementById('shuffleButton');
    const cardFaceBack = document.querySelector('.card-back');
    const cardContainer = document.querySelector('.card-container');
    const categoryButtons = document.querySelectorAll('.cat-btn');

    // Favorites Elements
    const cardHeart = document.getElementById('cardHeart');
    const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');
    const favModal = document.getElementById('favModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const favoritesList = document.getElementById('favoritesList');
    const emptyState = document.getElementById('emptyState');

    // Intro / Personalization Elements
    const introModal = document.getElementById('introModal');
    const introForm = document.getElementById('introForm');
    const userNameInput = document.getElementById('userNameInput');
    const genderBtns = document.querySelectorAll('.gender-btn');
    const startGameBtn = document.getElementById('startGameBtn');

    // Easter Egg Elements
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const letterModal = document.getElementById('letterModal');
    const closeLetterBtn = document.getElementById('closeLetterBtn');

    // --- GLOW COLORS ---
    const glowColors = ['#FF9A9E', '#a18cd1', '#84fab0', '#fccb90', '#e0c3fc', '#ffffff'];

    // --- STATE ---
    let currentLang = 'en';
    let currentCategory = 'random';
    let currentDeck = [];
    let isFlipped = false;
    let savedFavorites = JSON.parse(localStorage.getItem('deepQsFavorites')) || [];

    let userData = { name: null, gender: null };
    
    // Easter Egg State
    let isHolly = false;
    let hollyCardCount = 0; 
    const triggerNames = ['holly', 'h', 'ly', 'hol']; 

    // --- 1. INTRO & PERSONALIZATION ---

    genderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            genderBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            userData.gender = btn.getAttribute('data-value');
            checkFormValidity();
        });
    });

    userNameInput.addEventListener('input', (e) => {
        userData.name = e.target.value.trim();
        checkFormValidity();
    });

    function checkFormValidity() {
        if (userData.name && userData.name.length > 0 && userData.gender) {
            startGameBtn.classList.add('active');
            startGameBtn.disabled = false;
        } else {
            startGameBtn.classList.remove('active');
            startGameBtn.disabled = true;
        }
    }

    if(introForm) {
        introForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            introModal.classList.remove('open');
            
            // CHECK FOR EASTER EGG
            if (userData.name) {
                const lowerName = userData.name.toLowerCase();
                if (triggerNames.includes(lowerName)) {
                    isHolly = true;
                    // Show Engraved Name
                    cardNameDisplay.style.display = 'block';
                    cardNameDisplay.textContent = userData.name.charAt(0).toUpperCase() + userData.name.slice(1);
                }
            }
        });
    }

    // --- 2. CORE GAME LOGIC ---

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
        
        if (isFlipped) {
            card.classList.remove('flipped');
            isFlipped = false;
            setTimeout(() => { card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)"; }, 300);
        }

        setTimeout(() => {
            const label = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
            const tapText = document.querySelector('.card-front span');
            if(tapText) tapText.textContent = `Tap for ${label}`;
            cardHeart.classList.remove('active');
        }, 300);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleCardClick(e) {
        if (e.target.closest('#cardHeart')) return;

        if (isFlipped) {
            card.classList.remove('flipped');
            isFlipped = false;
            setTimeout(() => { card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)"; }, 300);
            return;
        }

        if (currentDeck.length === 0) {
            alert(currentLang === 'en' ? "Reshuffling deck!" : "Ihahalo ulit!");
            initDeck();
            return;
        }

        let nextQuestion = currentDeck.pop();
        questionText.textContent = nextQuestion;

        if (savedFavorites.includes(nextQuestion)) {
            cardHeart.classList.add('active');
        } else {
            cardHeart.classList.remove('active');
        }

        const randomColor = glowColors[Math.floor(Math.random() * glowColors.length)];
        card.style.boxShadow = `0 0 30px ${randomColor}90`;
        card.classList.add('flipped');
        isFlipped = true;

        // --- EASTER EGG TRIGGER (UPDATED) ---
        if (isHolly) {
            hollyCardCount++;
            // Trigger after the FIRST card (count === 1)
            if (hollyCardCount === 1) {
                setTimeout(() => {
                    letterModal.classList.add('open');
                }, 1500); // 1.5 second delay so she has time to read the first question
            }
        }
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

    // --- 3. FAVORITES & MODALS ---

    function toggleFavorite(e) {
        e.stopPropagation(); 
        if (!isFlipped) return;
        const currentQ = questionText.textContent;
        if (savedFavorites.includes(currentQ)) {
            savedFavorites = savedFavorites.filter(q => q !== currentQ);
            cardHeart.classList.remove('active');
        } else {
            savedFavorites.push(currentQ);
            cardHeart.classList.add('active');
        }
        localStorage.setItem('deepQsFavorites', JSON.stringify(savedFavorites));
    }

    function renderFavorites() {
        favoritesList.innerHTML = '';
        if (savedFavorites.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            savedFavorites.forEach(q => {
                const item = document.createElement('div');
                item.classList.add('fav-item');
                const escapedQ = q.replace(/'/g, "\\'");
                item.innerHTML = `<span>${q}</span><button class="delete-btn" onclick="removeFav('${escapedQ}')">&times;</button>`;
                favoritesList.appendChild(item);
            });
        }
    }

    window.removeFav = function(question) {
        savedFavorites = savedFavorites.filter(q => q !== question);
        localStorage.setItem('deepQsFavorites', JSON.stringify(savedFavorites));
        renderFavorites();
        if (questionText.textContent === question) cardHeart.classList.remove('active');
    };

    // --- EVENT LISTENERS ---

    categoryButtons.forEach(btn => {
        if (btn.id === 'viewFavoritesBtn') return;
        btn.addEventListener('click', (e) => {
            categoryButtons.forEach(b => {
                if (b.id !== 'viewFavoritesBtn') b.classList.remove('active');
            });
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            performShuffleAnimation(); 
        });
    });

    viewFavoritesBtn.addEventListener('click', () => {
        renderFavorites();
        favModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => favModal.classList.remove('open'));
    favModal.addEventListener('click', (e) => { if (e.target === favModal) favModal.classList.remove('open'); });

    // Letter Modal Close
    closeLetterBtn.addEventListener('click', () => {
        letterModal.classList.remove('open');
    });

    card.addEventListener('click', handleCardClick);
    cardHeart.addEventListener('click', toggleFavorite);
    languageSelect.addEventListener('change', initDeck);
    shuffleButton.addEventListener('click', performShuffleAnimation);

    // --- BACKGROUND ---
    function createBackgroundStars() {
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.width = star.style.height = `${Math.random() * 2}px`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            document.body.appendChild(star);
        }
    }
    
    function createShootingStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 40}vh`;
        star.style.setProperty('--endX', `${(Math.random() - 0.5) * 400 + 200}px`);
        star.style.setProperty('--endY', `${Math.random() * 300 + 200}px`);
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 3000);
    }

    initDeck();
    createBackgroundStars();
    setInterval(createShootingStar, 3000);
});