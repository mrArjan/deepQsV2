document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // CONFIGURATION
    // ==========================================
    const triggerNames = ['holly', 'hol', 'ly', 'h']; 
    const CORRECT_PASSCODE = 'CMB'; 

    // --- YOUR LETTERS ARCHIVE ---
    const SECRET_LETTERS = [
        {
            title: "12-29-25 | Letter no. 1", 
            content: `
                Dear Ms. Holly,<br /><br />
            I made this game for everyone, but I secretly made this specific
            part just for you.<br /><br />
            I hope you are having a great day! I hope you're enjoying this game
            - yung kwento kasi neto was like what I told you, ayokong bumili ng
            cards and this was supposed to be used if may get together kami ng
            friends ko sa sem hahaha. It is nice seeing your personality through
            this card game, somehow we're knowing each other little by little.
            <br></br>
            Until now I am enjoing every moment reading your messages, our short kwentuhan and sharing of experience. I know we are both busy and we take time before responding to each other but that's what makes it exciting - we're busy but still eager(?) to reply after a busy moment. 
            <br /><br />
            So far one thing you thaught me is Patience, in this era of fast phase dating, quick dates, fast getting to know each other stage; it really is a good process to know the person not just the basics but also in a deeper level. Very classic approach hahaha para tayong nag susulatan ng letter. I appreciate your willingness to know me and also your opennes.  
            <br /><br />
            Sorry if this is just an electronic letter, I promise I'll put this into handwriting and give it to you when we see each other. As much as I want to send it via mail (the classic way) or send it via lalamove, I think this is the easiest and wisest way to do hahaha. I hope you'll like my handwriting here hahahaha char. 
            <br /><br />
            Looking forward to see you next year and meet you in person! 
            <br /><br />
            - Arjan
            `
        },
         {
            title: "12-30-25", 
            content: `
                Dear Holly,<br><br>
                Hello, for this part I just want to thank you for appreciating the letter and for recognizing the effort I put into this project. Once a forgotten pieces of code now has purpose. So dito ko muna ilalagay mga letters ko for you until I can give it to you personally :) or if you decide to meet up someday.<br><br>
                I have no idea talaga on how to show you my effort or who I am, to be honest it is quite frustrating kasi di ko talaga alam if papadalhan ba kita ng letter or something. Yes I know we're just getting to know each other, but this is a part of who I am that I want to show you. Alam ko na game talaga dapat ito hahahaha nalagyan na ng letters and stuff for you, okay na din at least nakahanap din ako ng way to send a message to you. Ayaw ko kasi mag long message sa chat and I prefer writing the message instead. 
                <br><br>
                before ending this letter, I have a question if ever you are reading this. Are you still comfortable talking to me? or does it feel like a requirement to respond to my messages? 
                <br><br>
                Ayun lang, enjoy your day! and Thank you ulit for appreciating! 
                <br><br>
                - Arjan
            `
        },
        {
            title: "12-31-25", 
            content: `
                Dear Holly,<br><br>
                It's 4 hours before new year, after hours of updates and telling you what I'm doing - you finally replied hahaha. Hey just to clarify, I'm not mad or annoyed or what - I understand that you are busy, there's just this feeling of excitement when you reply after hours of being busy. I know I talk a lot and chat a lot. I hope you'll be able to read everything, it's okay if you'll not respond to each message.
                <br><br>
                I don't think you've responded to what I said after your long message pa ata, but I hope you can check it out and we can talk a little about that part kasi I feel like we're starting to understand each other. The real purpose of this letter is to let you know that amidst the silence and hours it takes I'll be here.
                <br><br>
                Ayun lang muna hahaha I'm cooking pizzas pa and some pizza rolls eh, have to get back to check it out. Just typed this quickly kasi I just feel to write this down, sorry if I misspelled some words ah di ko na kasi checheck hahaha - just a message right out of my mind. 
                <br><br>
                Enjoy your New Year's eve, I hope we'll still be talking by 2026. Thank you for showing me your true side and for appreciating my efforts. Happy Birth month na din! I hope I can see you before or after your birthday :) See you soon!
                <br><br>
                - Arjan
            `
        },
    ];
    // ==========================================


    // --- Elements ---
    const card = document.querySelector('.card');
    const questionText = document.getElementById('questionText');
    const languageSelect = document.getElementById('languageSelect');
    const shuffleButton = document.getElementById('shuffleButton');
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

    // Easter Egg / Security Elements
    const cardNameDisplay = document.getElementById('cardNameDisplay');
    const letterModal = document.getElementById('letterModal');
    const burntPaperContent = document.getElementById('burntPaperContent'); 
    const envelopeIcon = document.getElementById('envelopeIcon');
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
                    // SUSPICIOUS! Ask for CMB.
                    introModal.classList.remove('open');
                    setTimeout(() => {
                        securityModal.classList.add('open');
                        secretPasscode.focus();
                    }, 300);
                } else {
                    // Normal User
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
                
                // Unlock Envelope & Set Badge Count
                envelopeIcon.style.display = 'inline-flex';
                const badge = envelopeIcon.querySelector('.notification-badge');
                if(badge) badge.textContent = SECRET_LETTERS.length; 
                
                alert(`Welcome back, Ms. Holly. Check the envelope please.`);
            } else {
                alert("Incorrect location.");
            }
        });
    }

    // CANCEL BUTTON
    if(cancelSecurityBtn) {
        cancelSecurityBtn.addEventListener('click', () => {
            securityModal.classList.remove('open');
            // Resume game as normal user
        });
    }

    // --- 3. MULTI-LETTER SYSTEM ---
    
    function renderLetterMenu() {
        burntPaperContent.innerHTML = '';

        // If only 1 letter, just show it
        if (SECRET_LETTERS.length === 1) {
            renderOneLetter(0, false); 
            return;
        }

        // If multiple, show a list
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
        burntPaperContent.innerHTML = `
            <p class="letter-text">${letter.content}</p>
            <div style="margin-top: 30px;">
                ${showBackButton ? `<button class="back-btn" onclick="renderLetterMenu()">← Back</button>` : ''}
                <button id="closeLetterBtn">Keep Playing</button>
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

        // --- AUTO-TRIGGER REMOVED ---
        // The previous code block that opened the letter automatically
        // has been deleted. Now she must click the envelope icon.
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

    // Handle Envelope Click
    envelopeIcon.addEventListener('click', () => {
        renderLetterMenu(); 
        letterModal.classList.add('open');
        const badge = envelopeIcon.querySelector('.notification-badge');
        if(badge) badge.style.display = 'none'; 
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