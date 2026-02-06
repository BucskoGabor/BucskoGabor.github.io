document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    // About Elements
    const companyNameEl = document.getElementById('company-name');
    const companyDescEl = document.getElementById('company-desc');
    const companyVisionEl = document.getElementById('company-vision');

    // Members Grid
    const membersGridEl = document.getElementById('members-grid');

    // Events Table
    const eventsBodyEl = document.getElementById('events-body');

    // Dialog Elements
    const dialog = document.getElementById('event-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogDate = document.getElementById('dialog-date');
    const dialogLocation = document.getElementById('dialog-location');
    const dialogDesc = document.getElementById('dialog-desc');

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
            eventsBodyEl.innerHTML = '<tr><td colspan="4">Nincsenek események.</td></tr>';
            return;
        }

        eventsBodyEl.innerHTML = events.map((event, index) => `
            <tr data-index="${index}">
                <td><strong>${event.name}</strong></td>
                <td>${formatDate(event.date)}</td>
                <td>${event.location}</td>
                <td style="text-align: right;"><button class="view-btn">Megtekintés</button></td>
            </tr>
        `).join('');

        // Add Click Listeners to rows
        document.querySelectorAll('.events-table tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                const eventIndex = row.getAttribute('data-index');
                const eventData = events[eventIndex];
                openEventDialog(eventData);
            });
        });
    }

    // 4. Dialog Handling
    function openEventDialog(event) {
        dialogTitle.textContent = event.name;
        dialogDate.textContent = formatDate(event.date);
        dialogLocation.textContent = event.location;
        dialogDesc.textContent = event.description;
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
