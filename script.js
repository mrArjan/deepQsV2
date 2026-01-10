document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // CONFIGURATION
    // ==========================================
    const triggerNames = ['holly', 'hol', 'ly', 'h', 'olly','oli']; 
    const CORRECT_PASSCODE = 'BLUE'; 
    
    const HOLLY_MODE_COUNT = 10; 

    // --- YOUR LETTERS ARCHIVE ---
    const SECRET_LETTERS = [
        {
            title: "First Note", 
            // 1. Put the EXACT filename of your image here (inside the quotes)
            // Example: "holly.jpg" or "us.png"
            
            image: "png.jpg", 
            
            // 2. Put the EXACT filename of your PDF here
            // Example: "letter.pdf"
            pdf: "toHOLLY2.pdf", 
            
            content: `
                Dear Holly,<br><br>
               Hey! This might be the last letter here! :(
                <br><br><br><br>
                Don't be sad, it'll be moved to a different site! Yes! A site that I'll call - The Holly Archive! Basta just wait for it! HAHAHAHA! Scroll down till the end ha!
                <br><br><br><br>
                Just download my letter - di yan virus wag ka mag alala!
                <br><br><br><br>
                Yun lang! 
                <br><br><br><br>
               
                - Arjan
            `
        },
    ];

    // --- OBSERVATION DECK ---
    // These will now appear in EXACT ORDER (1 to 10)
    const OBSERVATION_DECK = [
        "Observation 1: We wore the same color way! Black and white!",
        "Observation 2: Your smile... so contagious!",
        "Observation 3: Ang gaan mo kasama - you're easy to be with! ",
        "Observation 4: Yung gulat mo nung nakita mo yung flowers!",
        "Observation 5: Onti mo kumain (no hard feelings!)",
        "Observation 6: Daldal mo din - much better!",
        "Observation 7: Your Vibe... 10/10",
        "Observation 8: You showed me that you really are interested.",
        "Observation 9: Tama nga, ikaw palang ang nakikita kong maganda sa bulacan... don't irap - it's an honest compliment!",
        "Observation 10: I can be who I am around you."
    ];
    // ==========================================


    // --- Elements ---
    const card = document.querySelector('.card');
    const questionText = document.getElementById('questionText');
    const languageSelect = document.getElementById('languageSelect');
    const shuffleButton = document.getElementById('shuffleButton');
    const cardContainer = document.querySelector('.card-container');
    const categoryButtons = document.querySelectorAll('.cat-btn');
    const controlsContainer = document.getElementById('controlsContainer'); 
    const cardCounter = document.getElementById('cardCounter'); 

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

    // Easter Egg / Security Elements
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const letterModal = document.getElementById('letterModal');
    const burntPaperContent = document.getElementById('burntPaperContent'); 
    const envelopeIcon = document.getElementById('envelopeIcon');
    const openThisTooltip = document.getElementById('openThisTooltip'); 
    const securityModal = document.getElementById('securityModal');
    const securityForm = document.getElementById('securityForm');
    const secretPasscode = document.getElementById('secretPasscode');
    const cancelSecurityBtn = document.getElementById('cancelSecurityBtn');

    // --- GLOW COLORS ---
    const glowColors = ['#FF9A9E', '#a18cd1', '#84fab0', '#fccb90', '#e0c3fc', '#ffffff'];

    // --- STATE ---
    let currentLang = 'en';
    let currentCategory = 'random';
    let currentDeck = [];
    let isFlipped = false;
    let savedFavorites = []; 
    let userData = { name: null, gender: null };
    
    // Easter Egg State
    let isVerifiedHolly = false;
    let isHollyMode = false; 
    let hasSeenAllCards = false; // Tracks if she finished the loop

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

    // --- 2. SECURITY FLOW ---
    if(introForm) {
        introForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            if (userData.name) {
                const lowerName = userData.name.toLowerCase();
                const isSuspectedHolly = triggerNames.some(trigger => lowerName.includes(trigger));

                if (isSuspectedHolly) {
                    introModal.classList.remove('open');
                    setTimeout(() => {
                        securityModal.classList.add('open');
                        secretPasscode.focus();
                    }, 300);
                } else {
                    introModal.classList.remove('open');
                }
            }
        });
    }

    if(securityForm) {
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredCode = secretPasscode.value.trim().toUpperCase();

            if (enteredCode === CORRECT_PASSCODE) {
                isVerifiedHolly = true;
                securityModal.classList.remove('open');
                
                // Show Engraved Name
                cardNameDisplay.style.display = 'block';
                cardNameDisplay.textContent = userData.name.charAt(0).toUpperCase() + userData.name.slice(1);
                
                // NOTE: We do NOT unlock the envelope here yet. 
                // It waits until the deck is finished.
                const badge = envelopeIcon.querySelector('.notification-badge');
                if(badge) badge.textContent = SECRET_LETTERS.length; 
                
                // --- HOLLY MODE LOGIC ---
                if (HOLLY_MODE_COUNT === 10) {
                    isHollyMode = true;
                    controlsContainer.style.display = 'none';
                    cardCounter.style.display = 'block';
                    cardCounter.textContent = `Card 1 of ${HOLLY_MODE_COUNT}`;
                    
                    // --- REVERSE ORDER (1 to 10) ---
                    currentDeck = [...OBSERVATION_DECK].reverse();
                    
                    alert(`Welcome back, Ms. Holly. Mode activated.`);
                } else {
                    alert(`Welcome back, Ms. Holly. Check the envelope please.`);
                }
                // ------------------------

            } else {
                alert("Incorrect! Anteh anuna?");
            }
        });
    }

    if(cancelSecurityBtn) {
        cancelSecurityBtn.addEventListener('click', () => {
            securityModal.classList.remove('open');
        });
    }

    // --- 3. MULTI-LETTER SYSTEM ---
    
    function renderLetterMenu() {
        burntPaperContent.innerHTML = '';

        if (SECRET_LETTERS.length === 1) {
            renderOneLetter(0, false); 
            return;
        }

        const header = document.createElement('h3');
        header.textContent = "Letters to Holly";
        header.style.marginBottom = "25px";
        burntPaperContent.appendChild(header);

        SECRET_LETTERS.forEach((letter, index) => {
            const btn = document.createElement('button');
            btn.classList.add('letter-menu-item');
            btn.textContent = `${index + 1}. ${letter.title}`;
            btn.onclick = () => renderOneLetter(index, true);
            burntPaperContent.appendChild(btn);
        });
        
        const closeBtn = document.createElement('button');
        closeBtn.id = 'closeLetterBtn';
        closeBtn.textContent = 'Close Envelope';
        closeBtn.onclick = () => letterModal.classList.remove('open');
        burntPaperContent.appendChild(closeBtn);
    }

    function renderOneLetter(index, showBackButton) {
        const letter = SECRET_LETTERS[index];
        
        // Build Image HTML if it exists
        let imageHTML = '';
        if(letter.image && letter.image !== "") {
            imageHTML = `<img src="${letter.image}" class="letter-img" alt="Attached Image">`;
        }

        // Build Download Button HTML if PDF exists
        let pdfHTML = '';
        if(letter.pdf && letter.pdf !== "") {
            pdfHTML = `<a href="${letter.pdf}" download class="download-btn">Download PDF</a>`;
        }

        burntPaperContent.innerHTML = `
            ${imageHTML}
            <p class="letter-text">${letter.content}</p>
            <div style="margin-top: 30px;">
                ${pdfHTML}
                ${showBackButton ? `<button class="back-btn" onclick="renderLetterMenu()">← Back</button>` : ''}
                <button id="closeLetterBtn">Close</button>
            </div>
        `;

        const newCloseBtn = burntPaperContent.querySelector('#closeLetterBtn');
        if(newCloseBtn) {
            newCloseBtn.onclick = () => letterModal.classList.remove('open');
        }
    }
    
    window.renderLetterMenu = renderLetterMenu;


    // --- 4. CORE GAME LOGIC ---
    function initDeck() {
        if (isHollyMode) return;

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
        if (e.target.closest('.engraved-name')) return;
        
        // 1. If card is open, just close it.
        if (isFlipped) {
            card.classList.remove('flipped');
            isFlipped = false;
            setTimeout(() => { card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)"; }, 300);
            return;
        }

        // 2. Check if deck is empty (Refill Logic for Infinite Loop)
        if (currentDeck.length === 0) {
            if(isHollyMode) {
                // Refill - SEQUENTIAL REVERSE
                currentDeck = [...OBSERVATION_DECK].reverse();
            } else {
                // NORMAL MODE LOGIC
                alert(currentLang === 'en' ? "Reshuffling deck!" : "Ihahalo ulit!");
                initDeck();
                return; 
            }
        }

        // 3. Draw Card
        let nextQuestion = currentDeck.pop();
        questionText.textContent = nextQuestion;

        // --- 4. NEW: TRIGGER ENVELOPE IMMEDIATELY (ON LAST CARD) ---
        if (isHollyMode && currentDeck.length === 0 && !hasSeenAllCards) {
            hasSeenAllCards = true;
            envelopeIcon.style.display = 'inline-flex';
            if(openThisTooltip) openThisTooltip.style.display = 'block';
        }

        // 5. Update Counter (Holly Mode Only)
        if (isHollyMode) {
            const currentCardNum = HOLLY_MODE_COUNT - currentDeck.length;
            cardCounter.textContent = `Card ${currentCardNum} of ${HOLLY_MODE_COUNT}`;
        }

        if (savedFavorites.includes(nextQuestion)) {
            cardHeart.classList.add('active');
        } else {
            cardHeart.classList.remove('active');
        }

        const randomColor = glowColors[Math.floor(Math.random() * glowColors.length)];
        card.style.boxShadow = `0 0 30px ${randomColor}90`;
        card.classList.add('flipped');
        isFlipped = true;
    }

    function performShuffleAnimation() {
        if (isHollyMode) return;

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

    // --- 5. MODALS & INTERACTIONS ---
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
        renderFavorites();
        if (questionText.textContent === question) cardHeart.classList.remove('active');
    };

    // --- EVENT LISTENERS ---
    categoryButtons.forEach(btn => {
        if (btn.id === 'viewFavoritesBtn' || btn.id === 'envelopeIcon') return;
        btn.addEventListener('click', (e) => {
            categoryButtons.forEach(b => {
                if (b.id !== 'viewFavoritesBtn' && b.id !== 'envelopeIcon') b.classList.remove('active');
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

    envelopeIcon.addEventListener('click', () => {
        renderLetterMenu(); 
        letterModal.classList.add('open');
        
        // Hide tooltip and badge when clicked
        const badge = envelopeIcon.querySelector('.notification-badge');
        if(badge) badge.style.display = 'none'; 
        if(openThisTooltip) openThisTooltip.style.display = 'none';
    });

    closeModalBtn.addEventListener('click', () => favModal.classList.remove('open'));
    favModal.addEventListener('click', (e) => { if (e.target === favModal) favModal.classList.remove('open'); });

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