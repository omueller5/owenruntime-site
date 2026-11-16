// script.js

// --- Footer Year Logic ---
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Lightbox for project screenshots (Projects page) ---
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox && lightboxImage && lightboxClose) {
    const screenshotImgs = document.querySelectorAll(".shot img");

    screenshotImgs.forEach(img => {
        img.addEventListener("click", () => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || "Enlarged screenshot";
            lightbox.classList.add("visible");
        });
    });

    lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("visible");
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("visible");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            lightbox.classList.remove("visible");
        }
    });
}

// --- In-Page Tab Navigation Handler ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetTabId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetTabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// --- Synergy Helper ---
function calculateSynergy(baseScore, portrayLevel = 0) {
    // Portray bonus: 15% increase per level starting from P0 baseline
    const multiplier = 1 + (portrayLevel * 0.15);
    return (baseScore * multiplier).toFixed(2);
}

// --- Reverse: 1999 Helpers ---
function getFilename(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/__+/g, '_') + '.png';
}

function getPlaceholderSvg(name) {
    const safeName = String(name || 'Unknown')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const words = safeName.split(/\s+/);
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length <= 13) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);
    if (lines.length === 0) lines = ['Unknown'];

    const lineHeight = 20;
    const startY = 100 - ((lines.length - 1) * lineHeight) / 2;
    const textTags = lines
        .map((line, i) => `<tspan x="100" y="${startY + i * lineHeight}">${line}</tspan>`)
        .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="12" fill="#141627"/>
        <rect x="6" y="6" width="188" height="188" rx="9" fill="none" stroke="#2c304d" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="100" text-anchor="middle" dominant-baseline="middle" fill="#c0c3d7" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700">${textTags}</text>
    </svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function attachPortraitFallback(imgEl, charName) {
    if (!imgEl) return;
    imgEl.onerror = function () {
        this.onerror = null;
        this.src = getPlaceholderSvg(charName);
    };
}

// --- Reverse: 1999 Team Builder Logic ---
const listContainer = document.getElementById('character-list');
const searchInput = document.getElementById('char-search');
const focusBtns = document.querySelectorAll('.focus-btn');
const rarityBtns = document.querySelectorAll('.rarity-btn');
const typeBtns = document.querySelectorAll('.type-btn');
const dmgBtns = document.querySelectorAll('.dmg-btn');

const ownedCount = document.getElementById('owned-count');
const totalCount = document.getElementById('total-count');
const resetBtn = document.getElementById('reset-filters');
const selectAllBtn = document.getElementById('select-all');
const unselectAllBtn = document.getElementById('unselect-all');

if (listContainer) {
    let ownedCharacters = JSON.parse(localStorage.getItem('r99_owned_characters')) || [];
    let activeFocusFilter = 'all';
    let activeRarityFilter = 'all';
    let activeTypeFilter = 'all';
    let activeDmgFilter = 'all';

    function updateCounter() {
        if (ownedCount && totalCount) {
            ownedCount.textContent = ownedCharacters.length;
            totalCount.textContent = listContainer.querySelectorAll('.character-card').length;
        }
    }

    function applyFilters() {
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const cards = listContainer.querySelectorAll('.character-card');

        cards.forEach(card => {
            const charName = card.getAttribute('data-name') || '';
            const charFocus = card.getAttribute('data-focus') || '';
            const charRarity = card.getAttribute('data-rarity') || '';
            const charType = card.getAttribute('data-type') || '';
            const charDmg = card.getAttribute('data-dmg') || '';

            const matchesSearch = charName.includes(searchQuery);
            const matchesFocus = activeFocusFilter === 'all' || charFocus === activeFocusFilter;
            const matchesRarity = activeRarityFilter === 'all' || charRarity === activeRarityFilter;
            const matchesType = activeTypeFilter === 'all' || charType === activeTypeFilter;
            const matchesDmg = activeDmgFilter === 'all' || charDmg === activeDmgFilter;

            if (matchesSearch && matchesFocus && matchesRarity && matchesType && matchesDmg) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    fetch('./assets/data/reverse1999_characters.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(character => {
                const charDiv = document.createElement('div');
                charDiv.className = 'character-card';

                const resPattern = character.resonance?.pattern || 'N/A';
                const resFocus = character.resonance?.focus || 'N/A';
                const resTiles = character.resonance?.priority_tiles || 'N/A';
                const resNotes = character.resonance?.notes || 'None';
                const rarityValue = String(character.rarity || '');
                const charType = character.type || character.afflatus || 'Unknown';
                const charDmg = character.damage_type || character.dmg_type || character.dmgType || 'Unknown';
                const fileName = getFilename(character.name || '');

                charDiv.setAttribute('data-name', (character.name || '').toLowerCase());
                charDiv.setAttribute('data-focus', resFocus);
                charDiv.setAttribute('data-rarity', rarityValue);
                charDiv.setAttribute('data-type', charType);
                charDiv.setAttribute('data-dmg', charDmg);

                const isCurrentlyOwned = ownedCharacters.includes(character.name);
                if (isCurrentlyOwned) {
                    charDiv.classList.add('owned');
                }

                charDiv.innerHTML = `
                    <img src="./assets/images/reverse1999/${fileName}" alt="${character.name || 'Character Portrait'}" loading="lazy">
                    <div class="char-header">
                        <h3>${character.name || 'Unknown Name'}</h3>
                        <input type="checkbox" class="char-checkbox" ${isCurrentlyOwned ? 'checked' : ''}>
                    </div>
                    <div class="char-details">
                        <p><strong>Type / Afflatus:</strong> ${charType}</p>
                        <p><strong>Damage Type:</strong> ${charDmg}</p>
                        <p><strong>Resonance Pattern:</strong> ${resPattern}</p>
                        <p><strong>Focus:</strong> ${resFocus}</p>
                        <p><strong>Priority Tiles:</strong> ${resTiles}</p>
                        <p><strong>Notes:</strong> ${resNotes}</p>
                    </div>
                `;

                const portraitImg = charDiv.querySelector('img');
                const headerText = charDiv.querySelector('.char-header h3');
                const checkbox = charDiv.querySelector('.char-checkbox');

                attachPortraitFallback(portraitImg, character.name);

                portraitImg.addEventListener('click', (e) => {
                    e.stopPropagation();
                    charDiv.classList.toggle('expanded');
                });

                headerText.addEventListener('click', (e) => {
                    e.stopPropagation();
                    charDiv.classList.toggle('expanded');
                });

                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (checkbox.checked) {
                        charDiv.classList.add('owned');
                        if (!ownedCharacters.includes(character.name)) {
                            ownedCharacters.push(character.name);
                        }
                    } else {
                        charDiv.classList.remove('owned');
                        ownedCharacters = ownedCharacters.filter(name => name !== character.name);
                    }
                    localStorage.setItem('r99_owned_characters', JSON.stringify(ownedCharacters));
                    updateCounter();
                });

                listContainer.appendChild(charDiv);
            });
            updateCounter();
            applyFilters();
        })
        .catch(error => console.error('Error loading JSON:', error));

    if (searchInput) searchInput.addEventListener('input', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeFocusFilter = 'all';
            activeRarityFilter = 'all';
            activeTypeFilter = 'all';
            activeDmgFilter = 'all';
            if (searchInput) searchInput.value = '';
            [...focusBtns, ...rarityBtns, ...typeBtns, ...dmgBtns].forEach(b => {
                const isAll = b.getAttribute('data-focus') === 'all'
                    || b.getAttribute('data-rarity') === 'all'
                    || b.getAttribute('data-type') === 'all'
                    || b.getAttribute('data-dmg') === 'all';
                b.classList.toggle('active', isAll);
            });
            applyFilters();
        });
    }

    function toggleAll(shouldSelect) {
        const cards = listContainer.querySelectorAll('.character-card');
        const visibleCardsData = Array.from(cards)
            .filter(card => card.style.display !== 'none')
            .map(card => {
                const h3 = card.querySelector('.char-header h3');
                return h3 ? h3.textContent.trim() : '';
            })
            .filter(name => name !== '');

        if (shouldSelect) {
            ownedCharacters = [...new Set([...ownedCharacters, ...visibleCardsData])];
            cards.forEach(card => {
                if (card.style.display !== 'none') {
                    card.classList.add('owned');
                    const cb = card.querySelector('.char-checkbox');
                    if (cb) cb.checked = true;
                }
            });
        } else {
            ownedCharacters = ownedCharacters.filter(name => !visibleCardsData.includes(name));
            cards.forEach(card => {
                if (card.style.display !== 'none') {
                    card.classList.remove('owned');
                    const cb = card.querySelector('.char-checkbox');
                    if (cb) cb.checked = false;
                }
            });
        }
        localStorage.setItem('r99_owned_characters', JSON.stringify(ownedCharacters));
        updateCounter();
    }

    if (selectAllBtn) selectAllBtn.addEventListener('click', () => toggleAll(true));
    if (unselectAllBtn) unselectAllBtn.addEventListener('click', () => toggleAll(false));

    focusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            focusBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFocusFilter = btn.getAttribute('data-focus');
            applyFilters();
        });
    });

    rarityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rarityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeRarityFilter = btn.getAttribute('data-rarity');
            applyFilters();
        });
    });

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTypeFilter = btn.getAttribute('data-type');
            applyFilters();
        });
    });

    dmgBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dmgBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDmgFilter = btn.getAttribute('data-dmg');
            applyFilters();
        });
    });
}

// --- Reverse: 1999 Team Builder Tab Engine ---
const addTeamBtn = document.getElementById('add-team-btn');
const teamsContainer = document.getElementById('teams-container');
const charPickerModal = document.getElementById('char-picker-modal');
const closePickerBtn = document.getElementById('close-picker-btn');
const modalCharGrid = document.getElementById('modal-char-grid');
const modalSearch = document.getElementById('modal-search');
const modalOwnedOnly = document.getElementById('modal-owned-only');
const modalSynergyNote = document.getElementById('modal-synergy-note');

if (teamsContainer) {
    let globalCharacterData = [];
    let savedTeams = JSON.parse(localStorage.getItem('r99_saved_teams')) || [];
    let activeTargetSlot = null;

    fetch('./assets/data/reverse1999_characters.json')
        .then(res => res.json())
        .then(data => { globalCharacterData = data; renderAllTeams(); })
        .catch(err => console.error('Error fetching data for team builder:', err));

    function renderAllTeams() {
        teamsContainer.innerHTML = '';
        if (savedTeams.length === 0) {
            savedTeams.push({
                id: Date.now(),
                name: 'Team Formation 1',
                slots: {
                    Main1: { name: null, portray: 0 },
                    Main2: { name: null, portray: 0 },
                    Main3: { name: null, portray: 0 },
                    Sub: { name: null, portray: 0 }
                }
            });
            saveTeamsToStorage();
        }
        savedTeams.forEach(team => createTeamRowDOM(team));
    }

    function parseResonanceStats(keyStatsStr, multiplier = 1) {
        const extracted = {};
        if (!keyStatsStr) return extracted;
        const statParts = keyStatsStr.split('/');
        statParts.forEach(part => {
            const match = part.match(/([a-zA-Z\s]+)\s*\+?\s*([0-9.]+)\s*%/);
            if (match) {
                const statName = match[1].trim();
                const statValue = parseFloat(match[2]) * multiplier;
                extracted[statName] = statValue;
            }
        });
        return extracted;
    }

    function calculateTeamStats(team) {
        const summary = { Afflatus: {}, DamageType: {}, CombatStats: {}, StatusTags: {}, TotalUnits: 0 };
        Object.values(team.slots).forEach(charSlot => {
            if (!charSlot || !charSlot.name) return;
            const charObj = globalCharacterData.find(c => c.name === charSlot.name);
            if (charObj) {
                summary.TotalUnits++;
                const type = charObj.type || charObj.afflatus || 'Unknown';
                const dmg = charObj.damage_type || charObj.dmg_type || charObj.dmgType || 'Unknown';
                const portrayMult = 1 + ((charSlot.portray || 0) * 0.05);

                summary.Afflatus[type] = (summary.Afflatus[type] || 0) + 1;
                summary.DamageType[dmg] = (summary.DamageType[dmg] || 0) + 1;
                if (Array.isArray(charObj.tags)) {
                    charObj.tags.forEach(tag => { summary.StatusTags[tag] = (summary.StatusTags[tag] || 0) + 1; });
                }
                if (charObj.resonance && charObj.resonance.key_stats) {
                    const characterBaseStats = parseResonanceStats(charObj.resonance.key_stats, portrayMult);
                    Object.entries(characterBaseStats).forEach(([statName, value]) => {
                        summary.CombatStats[statName] = (summary.CombatStats[statName] || 0) + value;
                    });
                }
            }
        });
        return summary;
    }

    function createTeamRowDOM(team) {
        const row = document.createElement('div');
        row.className = 'team-row';
        row.setAttribute('data-team-id', team.id);
        row.innerHTML = `
            <div class="team-row-header">
                <input type="text" class="team-title" value="${team.name}">
                <button class="action-btn delete-team-btn">Delete Team</button>
            </div>
            <div class="team-body-wrapper">
                <div class="team-slots">
                    <div class="team-slot" data-slot-id="Main1" data-role="Main"></div>
                    <div class="team-slot" data-slot-id="Main2" data-role="Main"></div>
                    <div class="team-slot" data-slot-id="Main3" data-role="Main"></div>
                    <div class="team-slot" data-slot-id="Sub" data-role="Sub"></div>
                </div>
                <div class="team-stats-summary">
                    <div class="summary-title">Team Synergy Overview</div>
                    <div class="synergy-sections-wrapper" id="stats-container-${team.id}"></div>
                </div>
            </div>
        `;
        const statsContainer = row.querySelector(`#stats-container-${team.id}`);
        const teamStats = calculateTeamStats(team);
        if (teamStats.TotalUnits === 0) {
            statsContainer.innerHTML = `<div class="empty-team-notice">Add team members to compute composition metrics.</div>`;
        } else {
            let coreBadges = '', statBadges = '', mechanicsBadges = '';
            Object.entries(teamStats.Afflatus).forEach(([key, val]) => { coreBadges += `<div class="stat-badge core-badge"><strong>${key}</strong> <span class="badge-val">${val}</span></div>`; });
            Object.entries(teamStats.DamageType).forEach(([key, val]) => { coreBadges += `<div class="stat-badge core-badge"><strong>${key}</strong> <span class="badge-val">${val}</span></div>`; });
            Object.entries(teamStats.CombatStats).forEach(([key, val]) => { statBadges += `<div class="stat-badge numeric-badge"><strong>${key}</strong> <span class="badge-val">+${val.toFixed(1)}%</span></div>`; });
            Object.entries(teamStats.StatusTags).forEach(([key, val]) => { if (key === 'DPS' || key === 'Support') return; mechanicsBadges += `<div class="stat-badge mechanic-badge"><strong>${key}</strong> <span class="badge-val">${val}</span></div>`; });
            statsContainer.innerHTML = `
                <div class="synergy-row">
                    <div class="synergy-label">Core Attributes</div>
                    <div class="synergy-badges">${coreBadges}</div>
                </div>
                ${statBadges ? `<div class="synergy-row"><div class="synergy-label">Aggregated Stats</div><div class="synergy-badges">${statBadges}</div></div>` : ''}
                ${mechanicsBadges ? `<div class="synergy-row"><div class="synergy-label">Synergy Mechanics</div><div class="synergy-badges">${mechanicsBadges}</div></div>` : ''}
            `;
        }
        row.querySelector('.team-title').addEventListener('change', (e) => { team.name = e.target.value; saveTeamsToStorage(); });
        row.querySelector('.delete-team-btn').addEventListener('click', () => { savedTeams = savedTeams.filter(t => t.id !== team.id); saveTeamsToStorage(); renderAllTeams(); });
        ['Main1', 'Main2', 'Main3', 'Sub'].forEach(slotKey => {
            const slotElement = row.querySelector(`.team-slot[data-slot-id="${slotKey}"]`);
            const charSlot = team.slots[slotKey];
            if (charSlot && charSlot.name) {
                const file = getFilename(charSlot.name);
                slotElement.classList.add('filled');
                slotElement.innerHTML = `<button class="remove-slot-btn">&times;</button><img src="./assets/images/reverse1999/${file}" alt="${charSlot.name}"><div class="char-name">${charSlot.name} (P${charSlot.portray})</div>`;
                attachPortraitFallback(slotElement.querySelector('img'), charSlot.name);
                slotElement.querySelector('.remove-slot-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    team.slots[slotKey] = { name: null, portray: 0 };
                    saveTeamsToStorage();
                    renderAllTeams();
                });
            } else {
                slotElement.classList.remove('filled');
                slotElement.innerHTML = `<span class="add-icon">+</span><div class="slot-label">${slotKey === 'Sub' ? 'Sub Unit' : 'Frontline'}</div>`;
            }
            slotElement.addEventListener('click', () => { activeTargetSlot = { teamId: team.id, slotKey: slotKey }; openPickerModal(); });
        });
        teamsContainer.appendChild(row);
    }

    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', () => {
            savedTeams.push({
                id: Date.now(),
                name: `Team Formation ${savedTeams.length + 1}`,
                slots: {
                    Main1: { name: null, portray: 0 },
                    Main2: { name: null, portray: 0 },
                    Main3: { name: null, portray: 0 },
                    Sub: { name: null, portray: 0 }
                }
            });
            saveTeamsToStorage();
            renderAllTeams();
        });
    }

    function openPickerModal() {
        if (!charPickerModal) return;
        if (modalSearch) modalSearch.value = '';
        charPickerModal.classList.add('visible');
        renderModalGrid();
    }

    function closePickerModal() {
        if (charPickerModal) charPickerModal.classList.remove('visible');
        activeTargetSlot = null;
    }

    if (closePickerBtn) closePickerBtn.addEventListener('click', closePickerModal);
    if (charPickerModal) {
        charPickerModal.addEventListener('click', (e) => { if (e.target === charPickerModal) closePickerModal(); });
    }

    function renderModalGrid() {
        if (!modalCharGrid || !activeTargetSlot) return;
        modalCharGrid.innerHTML = '';

        const currentTeam = savedTeams.find(t => t.id === activeTargetSlot.teamId);
        const usedInTeam = currentTeam ? Object.values(currentTeam.slots).filter(s => s.name !== null).map(s => s.name) : [];
        const leadName = currentTeam && activeTargetSlot.slotKey !== 'Main1' ? currentTeam.slots['Main1'].name : null;
        const leadChar = leadName ? globalCharacterData.find(c => c.name === leadName) : null;

        if (modalSynergyNote) {
            modalSynergyNote.textContent = leadChar
                ? `Sorted by tag synergy with Lead: ${leadChar.name}`
                : 'Select your lead unit (Main 1) to highlight tag synergies';
        }

        const ownedSet = new Set(JSON.parse(localStorage.getItem('r99_owned_characters')) || []);
        const filterOwned = modalOwnedOnly ? modalOwnedOnly.checked : false;
        const query = modalSearch ? modalSearch.value.toLowerCase().trim() : '';

        const pool = globalCharacterData
            .filter(c => !usedInTeam.includes(c.name))
            .filter(c => !filterOwned || ownedSet.has(c.name))
            .filter(c => !query || (c.name || '').toLowerCase().includes(query))
            .map(char => {
                let score = 0;
                if (leadChar && Array.isArray(leadChar.tags) && Array.isArray(char.tags)) {
                    leadChar.tags.forEach(leadTag => { if (char.tags.includes(leadTag)) score += 1; });
                }
                return { ...char, baseScore: score };
            })
            .sort((a, b) => b.baseScore - a.baseScore || a.name.localeCompare(b.name));

        if (pool.length === 0) {
            modalCharGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: #8d92b1;">
                ${filterOwned && ownedSet.size === 0
                    ? 'No owned characters selected yet. Mark characters in Tab 1 or uncheck "Owned Roster Only".'
                    : 'No matching characters found.'}
            </div>`;
            return;
        }

        pool.forEach(char => {
            const card = document.createElement('div');
            card.className = 'modal-card' + (char.baseScore > 0 ? ' suggested' : '');
            card.innerHTML = `
                <img src="./assets/images/reverse1999/${getFilename(char.name)}" alt="${char.name}">
                <div class="name">${char.name}</div>
                <div class="portray-selector" onclick="event.stopPropagation()">
                    <label>Portray:</label>
                    <select class="portray-select">
                        ${[0, 1, 2, 3, 4, 5].map(p => `<option value="${p}">P${p}</option>`).join('')}
                    </select>
                </div>
                <div class="synergy-badge-slot">
                    ${char.baseScore > 0 ? `<div class="synergy-badge">Synergy: +${calculateSynergy(char.baseScore, 0)}</div>` : ''}
                </div>
            `;

            attachPortraitFallback(card.querySelector('img'), char.name);

            const portraySelect = card.querySelector('.portray-select');
            const badgeSlot = card.querySelector('.synergy-badge-slot');
            if (portraySelect && badgeSlot && char.baseScore > 0) {
                portraySelect.addEventListener('change', (e) => {
                    const pLevel = parseInt(e.target.value, 10) || 0;
                    badgeSlot.innerHTML = `<div class="synergy-badge">Synergy: +${calculateSynergy(char.baseScore, pLevel)}</div>`;
                });
            }

            card.addEventListener('click', () => {
                const team = savedTeams.find(t => t.id === activeTargetSlot.teamId);
                const pVal = parseInt(card.querySelector('.portray-select').value, 10) || 0;
                if (team) {
                    team.slots[activeTargetSlot.slotKey] = { name: char.name, portray: pVal };
                    saveTeamsToStorage();
                    renderAllTeams();
                }
                closePickerModal();
            });
            modalCharGrid.appendChild(card);
        });
    }

    if (modalSearch) modalSearch.addEventListener('input', renderModalGrid);
    if (modalOwnedOnly) modalOwnedOnly.addEventListener('change', renderModalGrid);
    function saveTeamsToStorage() { localStorage.setItem('r99_saved_teams', JSON.stringify(savedTeams)); }
}