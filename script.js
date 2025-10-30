const COLUMNS = 6;
const ROWS = 5;
const TOTAL_CELLS = COLUMNS * ROWS;

const gridEl = document.getElementById('grid');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importInput');

let currentTeam = 1;
let socket = null;
let isConnected = false;

// Initialize Socket.IO connection
function initSocket() {
  // Connect to the server (defaults to same host)
  socket = io();
  
  socket.on('connect', () => {
    console.log('Connected to server');
    isConnected = true;
    // Request current state for the current team
    socket.emit('requestState', currentTeam);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
    isConnected = false;
  });
  
  // Listen for tile updates from server
  socket.on('tileUpdated', (data) => {
    const { team, index, value } = data;
    
    // Only update if it's for the current team
    if (team === currentTeam) {
      state[index] = value;
      saveState(state, currentTeam);
      updateCellDisplay(index);
    }
  });
  
  // Listen for full state updates from server
  socket.on('stateUpdate', (data) => {
    const { team, state: newState } = data;
    
    // Only update if it's for the current team
    if (team === currentTeam) {
      state = newState;
      saveState(state, currentTeam);
      renderGrid();
    }
  });
}

// Update a single cell's display without re-rendering entire grid
function updateCellDisplay(index) {
  const cells = gridEl.querySelectorAll('.cell');
  if (cells[index]) {
    cells[index].classList.toggle('marked', state[index]);
    cells[index].setAttribute('aria-checked', state[index] ? 'true' : 'false');
  }
}

function getStorageKey(team) {
  return `bingo-state-team${team}`;
}

function loadState(team) {
  try {
    const stored = localStorage.getItem(getStorageKey(team));
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === TOTAL_CELLS) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return new Array(TOTAL_CELLS).fill(false);
}

function saveState(state, team) {
  try {
    localStorage.setItem(getStorageKey(team), JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

let state = loadState(currentTeam);

function renderGrid() {
  gridEl.innerHTML = '';
  gridEl.style.gridTemplateColumns = `repeat(${COLUMNS}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
  
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('role', 'checkbox');
    cell.setAttribute('aria-checked', state[i] ? 'true' : 'false');
    cell.setAttribute('tabindex', '0');
    
    if (state[i]) {
      cell.classList.add('marked');
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'cell-overlay';
    
    const mark = document.createElement('div');
    mark.className = 'mark';
    
    cell.appendChild(overlay);
    cell.appendChild(mark);
    
    cell.addEventListener('click', () => {
      state[i] = !state[i];
      saveState(state, currentTeam);
      cell.classList.toggle('marked', state[i]);
      cell.setAttribute('aria-checked', state[i] ? 'true' : 'false');
      
      // Emit socket event for real-time sync
      if (socket && isConnected) {
        socket.emit('toggleTile', {
          team: currentTeam,
          index: i,
          value: state[i]
        });
      }
    });
    
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cell.click();
      }
    });
    
    gridEl.appendChild(cell);
  }
}

renderGrid();

// Team switching
const teamButtons = document.querySelectorAll('.team-btn');
teamButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const team = parseInt(btn.dataset.team, 10);
    if (team === currentTeam) return;
    
    // Update active button
    teamButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Switch team
    currentTeam = team;
    state = loadState(currentTeam);
    renderGrid();
    
    // Request latest state from server for this team
    if (socket && isConnected) {
      socket.emit('requestState', currentTeam);
    }
  });
});

resetBtn.addEventListener('click', ()=>{
if(!confirm(`Na pewno chcesz zresetować planszę dla Drużyny ${currentTeam}?`)) return;
state = new Array(TOTAL_CELLS).fill(false);
saveState(state, currentTeam);
renderGrid();

// Emit socket event for real-time sync
if (socket && isConnected) {
  socket.emit('updateState', {
    team: currentTeam,
    state: state
  });
}
});


exportBtn.addEventListener('click', ()=>{
const data = JSON.stringify(state);
const blob = new Blob([data], {type:'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `bingo-state-team${currentTeam}.json`;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
});


importBtn.addEventListener('click', ()=> importInput.click());
importInput.addEventListener('change', async (e)=>{
const f = e.target.files && e.target.files[0];
if(!f) return;
try{
const text = await f.text();
const parsed = JSON.parse(text);
if(!Array.isArray(parsed) || parsed.length !== TOTAL_CELLS) throw new Error('Niewłaściwy format');
state = parsed.map(v=>!!v);
saveState(state, currentTeam);
renderGrid();
alert(`Zaimportowano stan dla Drużyny ${currentTeam}`);

// Emit socket event for real-time sync
if (socket && isConnected) {
  socket.emit('updateState', {
    team: currentTeam,
    state: state
  });
}
}catch(err){
alert('Błąd importu pliku: '+err.message);
}
});


// Drobne usprawnienia: przy zmianie rozmiaru obrazka — zachowaj padding i proporcje
window.addEventListener('load', ()=>{
// Initialize socket connection
initSocket();
});
