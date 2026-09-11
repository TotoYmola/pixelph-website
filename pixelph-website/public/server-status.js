// Server status configuration
const urlParams = new URLSearchParams(window.location.search);
const SERVER_ID = urlParams.get('serverId') || 'y4lg95'; // Add Your server ID here Just Replace 'y4lg95' with your server ID (y4lg95 is a Fivem b299 server ID example)

// Function to fetch server information
async function fetchServerInfo() {
    try {
        // Using the dynamic.json endpoint which is more CORS-friendly
        const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${SERVER_ID}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0' // Adding user agent to prevent potential blocks
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.Data) {
            throw new Error('Invalid data format received');
        }
        
        updateServerStatus(data);
    } catch (error) {
        console.error('Error fetching server info:', error);
        // Show error state in UI with more specific error message
        document.getElementById('playerCount').textContent = '?';
        document.getElementById('maxPlayers').textContent = '?';
        document.getElementById('playerList').innerHTML = `
            <div class="text-center py-4">
                <p class="text-blue-500 font-semibold mb-2">Unable to fetch server information</p>
                <p class="text-gray-400 text-sm">Please try again later</p>
            </div>
        `;
    }
}

// Function to show player modal
function showPlayerModal(player) {
    const modal = document.getElementById('playerModal');
    const modalContent = modal.querySelector('.inline-block');
    const playerInitial = document.getElementById('playerInitial');
    const playerName = document.getElementById('playerName');
    const playerId = document.getElementById('playerId');
    const playerPing = document.getElementById('playerPing');

    // Update modal content
    playerInitial.textContent = player.name ? player.name.charAt(0).toUpperCase() : '?';
    playerName.textContent = player.name || 'Unknown Player';
    playerId.textContent = player.id || 'N/A';
    playerPing.textContent = player.ping ? `${player.ping}ms` : 'N/A';

    // Show modal with animation
    modal.classList.remove('hidden');
    modalContent.classList.remove('modal-leave');
    modalContent.classList.add('modal-enter');
    document.body.style.overflow = 'hidden';
}

// Function to close player modal
function closePlayerModal() {
    const modal = document.getElementById('playerModal');
    const modalContent = modal.querySelector('.inline-block');
    
    // Add leave animation
    modalContent.classList.remove('modal-enter');
    modalContent.classList.add('modal-leave');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300); // Match the animation duration
}

// Function to update the server status UI
function updateServerStatus(data) {
    try {
        // Update player count
        document.getElementById('playerCount').textContent = data.Data.clients || 0;
        document.getElementById('maxPlayers').textContent = data.Data.sv_maxclients || 32;

        // Update player list
        const playerList = document.getElementById('playerList');
        playerList.innerHTML = '';

        const players = data.Data.players || [];

        if (players.length === 0) {
            playerList.innerHTML = '<p class="text-gray-400 text-center py-4">No players currently online</p>';
            return;
        }

        players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'bg-gray-700 rounded-lg p-4 flex items-center space-x-4 player-card cursor-pointer hover:bg-gray-600 transition-colors duration-200';
            playerCard.onclick = () => showPlayerModal(player);
            playerCard.innerHTML = `
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-lg">${player.name ? player.name.charAt(0).toUpperCase() : '?'}</span>
                </div>
                <div class="flex-1">
                    <p class="text-white font-semibold">${player.name || 'Unknown'}</p>
                    <p class="text-gray-400 text-sm">ID: ${player.id || 'N/A'}</p>
                </div>
                <div class="text-right">
                    <p class="text-gray-400 text-sm">Ping</p>
                    <p class="text-white font-semibold">${player.ping}ms</p>
                </div>
            `;
            playerList.appendChild(playerCard);
        });
    } catch (error) {
        console.error('Error updating UI:', error);
        document.getElementById('playerList').innerHTML = '<p class="text-blue-500">Error updating player information</p>';
    }
}

// Update Connect link(s) based on SERVER_ID
function updateConnectLink() {
    try {
        const joinUrl = (SERVER_ID && SERVER_ID !== 'yourserverid') ? `https://cfx.re/join/${SERVER_ID}` : '#';
        const connectLink = document.getElementById('connectLink');
        if (connectLink) connectLink.setAttribute('href', joinUrl);
        document.querySelectorAll('[data-connect-link]')
            .forEach(el => el.setAttribute('href', joinUrl));
    } catch (e) {
        console.warn('Unable to update connect link:', e);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target.classList.contains('fixed')) {
        closePlayerModal();
    }
}

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePlayerModal();
    }
});

// Initial fetch
updateConnectLink();
fetchServerInfo();

// Set up periodic updates every 20 seconds
// This will keep the server status updated without needing a full page reload set according to the server's update frequency
setInterval(fetchServerInfo, 20000); 