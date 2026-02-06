import { initAuth } from "./auth.js";
import { utils } from "./utils.js";
import { pickStrategy } from "./engine.js";
import { simulateGuarantee, simulateInstallments } from "./simulators.js";
import { fillProposal, printProposal } from "./proposal.js";

async function loadJSON(path){
  const res = await fetch(path, { cache:"no-store" });
  if(!res.ok) throw new Error("Falha ao carregar " + path);
  return res.json();
}

function readCaso(){
  return {
    empresa: document.getElementById("empresa").value.trim(),
    doc: document.getElementById("doc").value.trim(),
    natureza: document.getElementById("natureza").value,
    valorDivida: utils.parseBR(document.getElementById("valorDivida").value),

    execucao: document.getElementById("execucao").checked,
    bloqueio: document.getElementById("bloqueio").checked,
    protesto: document.getElementById("protesto").checked,
    impedimento: document.getElementById("impedimento").checked,
    simples: document.getElementById("simples").checked,
    parcRescind: document.getElementById("parcRescind").checked,

    pctGarantia: utils.parseBR(document.getElementById("pctGarantia").value),
    taxaGarantia: utils.parseBR(document.getElementById("taxaGarantia").value)
  };
}

function buildResumo(caso, strategyText){
  const pontos = [];
  if(caso.execucao) pontos.push("Execução fiscal informada.");
  if(caso.bloqueio) pontos.push("Risco/ocorrência de bloqueio.");
  if(caso.impedimento) pontos.push("Restrição operacional/certidão.");
  if(caso.protesto) pontos.push("Protesto/restrição.");
  if(caso.parcRescind) pontos.push("Histórico de parcelamento rescindido.");
  if(caso.simples) pontos.push("Urgência por regularidade (Simples).");

  const base = pontos.length ? pontos.join(" ") : "Informações gerais fornecidas pelo cliente.";
  return base + "\n\n" + strategyText;
}

function renderOut(stratRule, resumoText, alternativesText, simG, simP){
  document.getElementById("outRisco").textContent = stratRule.risk || "—";
  document.getElementById("outEstrategia").textContent = stratRule.primary || "—";
  document.getElementById("outResumo").textContent = resumoText || "—";
  document.getElementById("outAlternativas").textContent = alternativesText || "—";

  document.getElementById("outGarantido").textContent = utils.brl(simG.valorGarantido);
  document.getElementById("outMensal").textContent = utils.brl(simG.mensalTotal);
  document.getElementById("outAss").textContent = utils.brl(simG.assessoria);
  document.getElementById("outAlug").textContent = utils.brl(simG.aluguel);
  document.getElementById("outTotal12").textContent = utils.brl(simG.total12);

  document.getElementById("outEntrada").textContent = utils.brl(simP.entrada);
  document.getElementById("outParcela").textContent = utils.brl(simP.mensal) + ` (${simP.parcelas}x)`;
}

(async function main(){
  initAuth();

  const [rules, texts] = await Promise.all([
    loadJSON("data/rules.json"),
    loadJSON("data/texts.json")
  ]);

  let last = { caso:null, strategy:null, simG:null };

  function analisar(){
    const caso = readCaso();
    const stratRule = pickStrategy(caso, rules);
    const textKey = stratRule.textKey || "DEFAULT";
    const strategyText = texts[textKey] || texts["DEFAULT"] || "";

    const simG = simulateGuarantee({
      valorDivida: caso.valorDivida,
      pctGarantia: caso.pctGarantia,
      taxaGarantia: caso.taxaGarantia
    });

    const simP = simulateInstallments({ valorDivida: caso.valorDivida });

    const alternativesText = (stratRule.alternatives || []).map(a => "• " + a).join("\n");
    const resumoText = buildResumo(caso, strategyText);

    renderOut(stratRule, resumoText, alternativesText, simG, simP);

    last = { caso, strategy: stratRule, simG };
  }

  document.getElementById("btnAnalisar").addEventListener("click", analisar);

  document.getElementById("btnImprimir").addEventListener("click", () => {
    analisar();
    if(!last?.caso) return;
    fillProposal(last.caso, last.strategy, last.simG);
    printProposal();
  });

  document.getElementById("btnLimpar").addEventListener("click", () => location.reload());
})();
