document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
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
            // Remove active class from all buttons and sections
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => {
                s.classList.remove('active');
                s.classList.add('hidden'); // Helper class for display none
            });

            // Activate clicked button
            btn.classList.add('active');

            // Show target section
            const tabId = btn.getAttribute('data-tab');
            const targetSection = document.getElementById(tabId);
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
        });
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

    // Utility: Simple Date Formatter
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    }
});
