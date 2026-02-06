import { utils } from "./utils.js";

export function fillProposal(caso, strategy, simG){
  document.getElementById("pMeta").textContent = "Gerado em " + new Date().toLocaleString("pt-BR");

  document.getElementById("pEmpresa").textContent = caso.empresa || "—";
  document.getElementById("pDoc").textContent = caso.doc || "—";
  document.getElementById("pNatureza").textContent = caso.natureza || "—";
  document.getElementById("pDivida").textContent = utils.brl(caso.valorDivida);

  document.getElementById("pEstrategia").textContent = strategy.primary || "—";
  document.getElementById("pMensal").textContent = utils.brl(simG.mensalTotal);
  document.getElementById("pAss").textContent = utils.brl(simG.assessoria);
  document.getElementById("pAlug").textContent = utils.brl(simG.aluguel);
  document.getElementById("pTotal12").textContent = utils.brl(simG.total12);
}

export function printProposal(){
  window.print();
}
