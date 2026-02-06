export const utils = {
  parseBR: (v) => {
    const s = String(v ?? "").trim()
      .replace(/[R$\s]/g,"")
      .replace(/\./g,"")
      .replace(",",".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  },
  brl: (n) => (Number(n)||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})
};
