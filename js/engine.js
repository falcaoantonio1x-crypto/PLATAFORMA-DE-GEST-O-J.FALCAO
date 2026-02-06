function matchCondition(caso, cond){
  const [k, v] = cond.split("==").map(s=>s.trim());
  const expected = (v === "true") ? true : (v === "false" ? false : v);
  return caso[k] === expected;
}

export function pickStrategy(caso, rulesPayload){
  const rules = rulesPayload.rules || [];
  for(const r of rules){
    const ok = (r.when || []).every(c => matchCondition(caso, c));
    if(ok) return r;
  }
  return { id:"DEFAULT", ...rulesPayload.default };
}
