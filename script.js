document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn, .dropdown-item');
    const sections = document.querySelectorAll('.section');

    // About Elements
    const companyNameEl = document.getElementById('company-name');
    const companyDescEl = document.getElementById('company-desc');
    const companyVisionEl = document.getElementById('company-vision');
    const companyCrestEl = document.getElementById('company-crest');

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

    let currentGalleryImages = [];
    let currentImageIndex = 0;

    function openLightbox(index, images) {
        currentGalleryImages = images;
        currentImageIndex = index;
        updateLightboxImage();
        lightboxDialog.showModal();

        // Close event dialog temporarily/stay open underneath? 
        // HTML dialog API allows stacked modals. We'll keep event dialog open underneath.
    }

    function updateLightboxImage() {
        if (currentGalleryImages.length > 0) {
            lightboxImg.src = currentGalleryImages[currentImageIndex];
        }
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateLightboxImage();
    }

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    closeLightboxBtn.addEventListener('click', () => {
        lightboxDialog.close();
    });

    // Close lightbox on backdrop click
    lightboxDialog.addEventListener('click', (e) => {
        // If clicking on the backdrop (dialog itself)
        if (e.target === lightboxDialog) {
            lightboxDialog.close();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxDialog.open) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') lightboxDialog.close();
        }
    });

    // Utility: Simple Date Formatter
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    }
});
