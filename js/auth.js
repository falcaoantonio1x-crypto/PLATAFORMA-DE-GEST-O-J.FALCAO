const SENHA_MASTER = "joséfalcao";
const SENHA_TRIAL  = "1234";

const TRIAL_MS  = 1 * 60 * 1000;      // 1 minuto
const MASTER_MS = 8 * 60 * 60 * 1000; // 8 horas

const KEY_EXPIRA = "acesso_expira_em";
const KEY_TRIAL_USADO = "trial_ja_usado";

function show(el){ el.style.display="flex"; }
function hide(el){ el.style.display="none"; }

function setErr(msg){
  const el = document.getElementById("lockErr");
  el.textContent = msg || "";
  el.style.display = msg ? "block" : "none";
}

function getExpira(){ return Number(localStorage.getItem(KEY_EXPIRA) || "0"); }

function bloquear(){
  localStorage.removeItem(KEY_EXPIRA);
  document.getElementById("senha").value = "";
  show(document.getElementById("lock"));
  const used = localStorage.getItem(KEY_TRIAL_USADO) === "1";
  setErr(used ? "A amostra já foi utilizada neste navegador. Use acesso autorizado." : "");
}

function agendarRelock(){
  if(window.__relockTimer) clearTimeout(window.__relockTimer);
  const falta = getExpira() - Date.now();
  if(falta > 0) window.__relockTimer = setTimeout(bloquear, falta);
}

function liberar(ms){
  localStorage.setItem(KEY_EXPIRA, String(Date.now() + ms));
  hide(document.getElementById("lock"));
  setErr("");
  agendarRelock();
}

function entrar(){
  const senha = document.getElementById("senha").value;

  if(senha === SENHA_MASTER){
    liberar(MASTER_MS);
    return;
  }
  if(senha === SENHA_TRIAL){
    const used = localStorage.getItem(KEY_TRIAL_USADO) === "1";
    if(used){
      setErr("A amostra já foi utilizada neste navegador. Use acesso autorizado.");
      return;
    }
    localStorage.setItem(KEY_TRIAL_USADO,"1");
    liberar(TRIAL_MS);
    return;
  }

  setErr("Senha incorreta.");
}

export function initAuth(){
  const lock = document.getElementById("lock");

  document.getElementById("btnEntrar").addEventListener("click", entrar);
  document.getElementById("btnBloquear").addEventListener("click", bloquear);

  document.addEventListener("keydown", (e)=>{
    const visible = lock.style.display !== "none";
    if(visible && e.key === "Enter") entrar();
  });

  if(Date.now() < getExpira()){
    hide(lock);
    agendarRelock();
  } else {
    bloquear();
  }
}
