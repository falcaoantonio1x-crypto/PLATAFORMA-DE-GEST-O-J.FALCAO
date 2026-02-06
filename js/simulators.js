export function simulateGuarantee({ valorDivida, pctGarantia, taxaGarantia }){
  const valorGarantido = valorDivida * (pctGarantia/100);
  const mensalTotal = valorGarantido * (taxaGarantia/100);
  const assessoria = mensalTotal * 0.10;
  const aluguel = mensalTotal * 0.90;
  const total12 = mensalTotal * 12;

  return { valorGarantido, mensalTotal, assessoria, aluguel, total12 };
}

// placeholder (depois tu pluga edital)
export function simulateInstallments({ valorDivida }){
  const entrada = valorDivida * 0.05;
  const saldo = Math.max(valorDivida - entrada, 0);
  const parcelas = 60;
  const mensal = saldo / parcelas;
  return { entrada, mensal, parcelas };
}
