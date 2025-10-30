const GRID_SIZE = 5; // 5x5
const overlay = document.createElement('div');
overlay.className = 'cell-overlay';


const mark = document.createElement('div');
mark.className = 'mark';


cell.appendChild(overlay);
cell.appendChild(mark);


cell.addEventListener('click', ()=>{
state[idx] = !state[idx];
saveState(state);
// aktualizuj aria i klasę
cell.classList.toggle('marked', state[idx]);
cell.setAttribute('aria-checked', state[idx] ? 'true' : 'false');
});


gridEl.appendChild(cell);
}
}
}


renderGrid();


resetBtn.addEventListener('click', ()=>{
if(!confirm('Na pewno chcesz zresetować planszę?')) return;
state = new Array(GRID_SIZE*GRID_SIZE).fill(false);
saveState(state);
renderGrid();
});


exportBtn.addEventListener('click', ()=>{
const data = JSON.stringify(state);
const blob = new Blob([data], {type:'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'bingo-state.json';
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
if(!Array.isArray(parsed) || parsed.length !== GRID_SIZE*GRID_SIZE) throw new Error('Niewłaściwy format');
state = parsed.map(v=>!!v);
saveState(state);
renderGrid();
alert('Zaimportowano stan');
}catch(err){
alert('Błąd importu pliku: '+err.message);
}
});


// Drobne usprawnienia: przy zmianie rozmiaru obrazka — zachowaj padding i proporcje
window.addEventListener('load', ()=>{
// nic szczególnego na razie
});
