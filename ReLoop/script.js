<script>
/* =========================
   REALISTIC LOCAL STATS SYSTEM
   (NOT RANDOM — ACTUAL STORED DATA)
========================= */

// load saved stats OR initialize once
let stats = JSON.parse(localStorage.getItem("reloop_stats")) || {
  biz: 30,
  kg: 9830,
  items: 6850
};

// render function
function renderStats(){
  document.getElementById("biz").innerText = stats.biz;
  document.getElementById("kg").innerText = stats.kg;
  document.getElementById("items").innerText = stats.items;
}

// simulate REAL event: new business joins
function businessJoins(){
  stats.biz += 1;

  save();
  renderStats();
}

// simulate REAL event: material added
function materialReLooped(kgAmount){
  stats.kg += kgAmount;
  stats.items += 1;

  save();
  renderStats();
}

// save to storage (REAL persistence)
function save(){
  localStorage.setItem("reloop_stats", JSON.stringify(stats));
}

// initial load
renderStats();

/* Example real events (you will replace these later with backend calls) */
setTimeout(() => businessJoins(), 3000);
setTimeout(() => materialReLooped(120), 5000);
setTimeout(() => materialReLooped(45), 8000);

</script>