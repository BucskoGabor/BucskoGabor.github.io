document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn, .dropdown-item');
    const sections = document.querySelectorAll('.section');

    // About Elements
    const companyNameEl = document.getElementById('company-name');
    const companyDescEl = document.getElementById('company-desc');
    const companyVisionEl = document.getElementById('company-vision');
    const companyCrestEl = document.getElementById('company-crest');
    const companySocialEl = document.getElementById('company-social');

    // Members Grid
    const membersGridEl = document.getElementById('members-grid');

    // Events Table Elements
    const futureEventsBodyEl = document.getElementById('future-events-body');
    const pastEventsBodyEl = document.getElementById('past-events-body');

    // Dialog Elements
    const dialog = document.getElementById('event-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogDate = document.getElementById('dialog-date');
    const dialogLocation = document.getElementById('dialog-location');
    const dialogDesc = document.getElementById('dialog-desc');
    const dialogFbLink = document.getElementById('dialog-fb-link');

    // 1. Fetch Data
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderAbout(data.company);
            renderMembers(data.members);
            renderEvents(data.events);
            renderGeneralGallery(data.gallery); // New function
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            companyDescEl.textContent = 'Hiba történt az adatok betöltése közben. Kérlek frissítsd az oldalt.';
        });

    // 2. Tab Navigation
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (!tabId) return; // Ignore buttons that don't switch tabs (e.g. dropdown toggle)

            // Remove active class from all buttons and sections
            navButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.dropdown-item').forEach(b => b.classList.remove('active'));
            sections.forEach(s => {
                s.classList.remove('active');
                s.classList.add('hidden'); // Helper class for display none
            });

            // Activate clicked button
            btn.classList.add('active');

            // Show target section
            const targetSection = document.getElementById(tabId);
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');

            // Close dropdown by removing focus
            btn.blur();
            // Also remove 'show' class from all dropdowns
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('show'));
        });
    });

    // Dropdown Mobile Toggle
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            const dropdown = btn.closest('.dropdown');
            dropdown.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('show'));
        }
    });

    // 3. Render Functions
    function renderAbout(company) {
        if (!company) return;
        companyNameEl.textContent = company.name;
        companyDescEl.textContent = company.description;
        companyVisionEl.textContent = company.vision;

        if (company.coatOfArms) {
            companyCrestEl.src = company.coatOfArms;
            companyCrestEl.style.display = 'block';
        }

        if (company.social) {
            const socialLinks = [];

            if (company.social.facebook) {
                socialLinks.push(`
                    <a href="${company.social.facebook}" target="_blank" class="social-icon" title="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                    </a>
                `);
            }

            if (company.social.instagram) {
                socialLinks.push(`
                    <a href="${company.social.instagram}" target="_blank" class="social-icon" title="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                `);
            }

            if (company.social.email) {
                socialLinks.push(`
                    <div class="social-icon email-container" title="Kattints az email megjelenítéséhez" onclick="this.classList.toggle('expanded')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                        </svg>
                        <span class="email-text">${company.social.email}</span>
                    </div>
                `);
            }

            companySocialEl.innerHTML = socialLinks.join('');
        }
    }

    function renderMembers(members) {
        if (!members || members.length === 0) {
            membersGridEl.innerHTML = '<p>Nincsenek megjeleníthető tagok.</p>';
            return;
        }

        membersGridEl.innerHTML = members.map(member => `
            <div class="member-card">
                <img src="${member.image}" alt="${member.name}" class="member-img">
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <span class="member-role">${member.role}</span>
                </div>
            </div>
        `).join('');
    }

    function renderEvents(events) {
        if (!events || events.length === 0) {
            futureEventsBodyEl.innerHTML = '<tr><td colspan="5">Nincsenek események.</td></tr>';
            pastEventsBodyEl.innerHTML = '<tr><td colspan="5">Nincsenek események.</td></tr>';
            return;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const futureEvents = events.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
        const pastEvents = events.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

        renderEventList(futureEvents, futureEventsBodyEl, "Nincsenek jövőbeli események.");
        renderEventList(pastEvents, pastEventsBodyEl, "Nincsenek múltbeli események.");
    }

    // --- Game Logic ---
    const games = [
        { name: "Cerevis", type: "Kártyajáték", description: "Hagyományos selmeci kártyajáték 32 lapos magyar kártyával." },
        { name: "Tarokk", type: "Kártyajáték", description: "Stratégiai kártyajáték, melyet speciális tarokk kártyával játszanak." },
        { name: "Ulti", type: "Kártyajáték", description: "Népszerű magyar kártyajáték, rablóulti és talonmáriás változatokkal." }
    ];

    // Quiz Variables
    let quizQuestions = [];
    let currentQuizSet = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let maxScore = 0;
    let userAnswers = []; // Store {question, userAnswer, correctAnswer, isCorrect, points}

    // DOM Elements - Quiz
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizContainer = document.getElementById('quiz-container');
    const questionText = document.getElementById('question-text');
    const questionImage = document.getElementById('question-image');
    const quizOptions = document.getElementById('quiz-options');
    const progressEl = document.getElementById('quiz-progress');
    const scoreEl = document.getElementById('quiz-score');

    // DOM Elements - Results
    const resultsContainer = document.getElementById('results-container');
    const resultsList = document.getElementById('results-list');
    const finalScoreEl = document.getElementById('final-score');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }

    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', startQuiz);
    }

    async function startQuiz() {
        try {
            const response = await fetch('documents/cerevis-kviz/quiz_data.json');
            const allQuestions = await response.json();

            // Randomize and select 30
            // Fisher-Yates shuffle
            for (let i = allQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
            }
            currentQuizSet = allQuestions.slice(0, 30);

            // Reset State
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = [];

            // Calculate Max Score
            maxScore = currentQuizSet.reduce((total, q) => total + getPoints(q.question), 0);

            scoreEl.textContent = `Pontszám: 0 / ${maxScore}`;

            // UI Updates
            startQuizBtn.parentElement.classList.add('hidden'); // Hide start button container
            quizContainer.classList.remove('hidden');
            resultsContainer.classList.add('hidden');

            loadQuestion();
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert('Hiba történt a kvíz betöltésekor.');
        }
    }

    function getPoints(questionString) {
        const match = questionString.match(/\((\d+)\s*pont/i);
        return match ? parseInt(match[1]) : 1;
    }

    function loadQuestion() {
        const q = currentQuizSet[currentQuestionIndex];
        const points = getPoints(q.question);

        // Update Progress
        progressEl.textContent = `Kérdés: ${currentQuestionIndex + 1} / ${currentQuizSet.length} (${points} pont)`;

        // Set Question Text
        questionText.textContent = q.question;

        // Handle Image
        // If question has image AND it is NOT a "draw this" task (which uses image as answer option), show it.
        // Heuristic: If we have bad_answers that are images, then the MAIN image is likely the correct answer option, NOT the question illustration.
        // However, some questions might be "What is in this picture?".
        // Based on data: "Rajzolj..." questions have image as answer. "Mit jelent..." might have illustration.
        // Let's check if bad_answers look like images.
        const optionsAreImages = q.bad_answers && q.bad_answers.some(ans => ans.includes('/') || ans.toLowerCase().endsWith('.png'));

        if (q.image && !optionsAreImages) {
            questionImage.src = q.image;
            questionImage.classList.remove('hidden');
        } else {
            questionImage.classList.add('hidden');
        }

        // Generate Options
        renderOptions(q, optionsAreImages);
    }

    function renderOptions(q, optionsAreImages) {
        quizOptions.innerHTML = ''; // Clear previous

        let options = [];
        // Add Correct Answer
        if (optionsAreImages) {
            // If the expected answers are images, we need to find the correct image path.
            // For "Drawing" tasks, q.answer is usually "Lásd a képet." and q.image contains the correct image.
            if (q.image) {
                options.push({ text: q.image, isCorrect: true, isImage: true });
            } else {
                // Fallback if no image property but it's supposed to be an image answer
                console.error("Missing image property for question:", q.question);
                options.push({ text: "Hiányzó kép", isCorrect: true, isImage: false });
            }
        } else {
            options.push({ text: q.answer, isCorrect: true, isImage: false });
        }

        // Add Bad Answers
        if (q.bad_answers) {
            q.bad_answers.forEach(bad => {
                options.push({ text: bad, isCorrect: false, isImage: optionsAreImages });
            });
        }

        // Shuffle Options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        // Render Buttons
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';

            if (opt.isImage) {
                const img = document.createElement('img');
                img.src = opt.text;
                img.setAttribute('alt', 'Válaszlehetőség');
                img.className = 'quiz-option-img';
                btn.appendChild(img);
            } else {
                btn.textContent = opt.text;
            }

            btn.onclick = () => handleAnswer(opt.isCorrect, opt.text);
            quizOptions.appendChild(btn);
        });
    }

    function handleAnswer(isCorrect, userAnswerText) {
        const q = currentQuizSet[currentQuestionIndex];
        const points = getPoints(q.question);

        // Update Score
        if (isCorrect) {
            score += points;
        }

        // Log Result
        userAnswers.push({
            question: q.question,
            userAnswer: userAnswerText,
            correctAnswer: (q.answer === "Lásd a képet." && q.image) ? q.image : q.answer,
            isCorrect: isCorrect,
            points: points,
            earned: isCorrect ? points : 0
        });

        scoreEl.textContent = `Pontszám: ${score} / ${maxScore}`;

        // Next Question
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuizSet.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        finalScoreEl.textContent = `Végeredmény: ${score} / ${maxScore} pont`;
        resultsList.innerHTML = '';

        userAnswers.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `result-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

            let userAnswerDisplay = item.userAnswer;
            let correctAnswerDisplay = item.correctAnswer;

            // Handle Image paths in summary
            if (userAnswerDisplay && (userAnswerDisplay.includes('/') || userAnswerDisplay.toLowerCase().endsWith('.png'))) {
                userAnswerDisplay = `<img src="${userAnswerDisplay}" style="height: 50px; vertical-align: middle;">`;
            }
            if (correctAnswerDisplay && (correctAnswerDisplay.includes('/') || correctAnswerDisplay.toLowerCase().endsWith('.png'))) {
                correctAnswerDisplay = `<img src="${correctAnswerDisplay}" style="height: 50px; vertical-align: middle;">`;
            }

            div.innerHTML = `
                <div class="result-question">${index + 1}. ${item.question}</div>
                <div class="result-detail">
                    Válaszod: <strong>${userAnswerDisplay}</strong> 
                    ${item.isCorrect ? '<span class="text-success">✔ (+' + item.points + ' pont)</span>' : '<span class="text-danger">✘ (0 pont)</span>'}
                </div>
                ${!item.isCorrect ? `<div class="result-detail">Helyes válasz: <strong class="text-success">${correctAnswerDisplay}</strong></div>` : ''}
            `;
            resultsList.appendChild(div);
        });
    }

    function renderEventList(eventsList, container, emptyMsg) {
        if (eventsList.length === 0) {
            container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-secondary);">${emptyMsg}</td></tr>`;
            return;
        }

        container.innerHTML = eventsList.map((event) => {
            // Private Event Logic
            if (event.visibility === 'private') {
                return `
                    <tr class="private-event" style="opacity: 0.6; cursor: default;">
                        <td colspan="5"><strong>${event.name}</strong> <span style="font-size: 0.8em; margin-left: 10px; opacity: 0.7;">(Privát)</span></td>
                    </tr>
                `;
            }

            // Public Event Logic
            return `
                <tr data-id="${event.id}" style="cursor: pointer;">
                    <td><strong>${event.name}</strong></td>
                    <td>${formatDate(event.date)}</td>
                    <td>${event.time || '-'}</td>
                    <td>${event.location}</td>
                    <td style="text-align: right;"><button class="view-btn">Megtekintés</button></td>
                </tr>
            `;
        }).join('');

        // Add Click Listeners only to public events
        container.querySelectorAll('tr[data-id]').forEach(row => {
            row.addEventListener('click', () => {
                const eventId = row.getAttribute('data-id');
                const eventData = eventsList.find(e => e.id == eventId);
                if (eventData) openEventDialog(eventData);
            });
        });
    }

    function renderGeneralGallery(galleryImages) {
        const galleryGrid = document.getElementById('general-gallery-grid');
        if (!galleryImages || galleryImages.length === 0) {
            galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Jelenleg nincsenek feltöltött képek.</p>';
            return;
        }

        galleryGrid.innerHTML = galleryImages.map((imgSrc, index) => `
            <div class="gallery-entry" data-index="${index}" style="cursor: pointer; position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 4/3;">
                <img src="${imgSrc}" alt="Galéria kép ${index + 1}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                <div class="gallery-overlay" style="opacity: 0; transition: opacity 0.3s ease;">
                    <span style="font-size: 2rem; color: white;">&#128269;</span>
                </div>
            </div>
        `).join('');

        // Add Click Listeners for Lightbox
        galleryGrid.querySelectorAll('.gallery-entry').forEach(entry => {
            entry.addEventListener('click', () => {
                const index = parseInt(entry.getAttribute('data-index'));
                openLightbox(index, galleryImages);
            });

            // Add hover effect via JS/Inline styles for simplicity or rely on CSS
            entry.addEventListener('mouseenter', () => {
                entry.querySelector('.gallery-overlay').style.opacity = '1';
                entry.querySelector('img').style.transform = 'scale(1.05)';
            });
            entry.addEventListener('mouseleave', () => {
                entry.querySelector('.gallery-overlay').style.opacity = '0';
                entry.querySelector('img').style.transform = 'scale(1)';
            });
        });
    }

    // 4. Dialog Handling
    function openEventDialog(event) {
        dialogTitle.textContent = event.name;
        dialogDate.textContent = `${formatDate(event.date)}${event.time ? ' ' + event.time : ''}`;
        dialogLocation.textContent = event.location;
        dialogDesc.textContent = event.description;

        if (event.facebookLink) {
            dialogFbLink.href = event.facebookLink;
            dialogFbLink.style.display = 'table'; // using table to center with margin: auto
        } else {
            dialogFbLink.style.display = 'none';
        }

        // Gallery Handling - Blurred Entry
        const galleryContainer = document.getElementById('dialog-gallery');
        galleryContainer.innerHTML = ''; // Clear previous content

        // Ensure container has correct class for singular entry
        galleryContainer.className = 'gallery-container';

        if (event.gallery && event.gallery.length > 0) {
            galleryContainer.style.display = 'block';

            // Create the blurred entry point
            const entryDiv = document.createElement('div');
            entryDiv.className = 'gallery-entry';

            const coverImg = document.createElement('img');
            coverImg.src = event.gallery[0];
            coverImg.alt = 'Galéria borítókép';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.textContent = 'Galéria';

            entryDiv.appendChild(coverImg);
            entryDiv.appendChild(overlay);

            // On click, open the lightbox with all images
            entryDiv.addEventListener('click', () => {
                openLightbox(0, event.gallery);
            });

            galleryContainer.appendChild(entryDiv);

        } else {
            galleryContainer.style.display = 'none';
        }

        dialog.showModal();

        // Close when clicking outside content (backdrop)
        dialog.addEventListener('click', backdropClickHandler);
    }

    function backdropClickHandler(e) {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width);

        if (!isInDialog) {
            dialog.close();
            dialog.removeEventListener('click', backdropClickHandler);
        }
    }

    closeDialogBtn.addEventListener('click', () => {
        dialog.close();
        dialog.removeEventListener('click', backdropClickHandler);
    });

    // --- Lightbox Logic ---
    const lightboxDialog = document.getElementById('lightbox-dialog');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentLightboxImages = [];
    let currentLightboxIndex = 0;

    function openLightbox(index, images) {
        currentLightboxImages = images;
        currentLightboxIndex = index;
        updateLightboxImage();
        lightboxDialog.showModal();
    }

    function updateLightboxImage() {
        if (currentLightboxImages.length > 0) {
            lightboxImg.src = currentLightboxImages[currentLightboxIndex];
        }
    }

    function showNextImage(e) {
        if (e) e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
        updateLightboxImage();
    }

    function showPrevImage(e) {
        if (e) e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
        updateLightboxImage();
    }

    // Event Listeners for Lightbox
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    closeLightboxBtn.addEventListener('click', () => {
        lightboxDialog.close();
    });

    // Close lightbox on backdrop click
    lightboxDialog.addEventListener('click', (e) => {
        if (e.target === lightboxDialog) {
            lightboxDialog.close();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxDialog.open) {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') lightboxDialog.close();
        }
    });

    // Utility: Simple Date Formatter
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    }
});
