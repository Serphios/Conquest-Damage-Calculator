function calculateDamage() {
  // Entferne eventuell vorhandenes Diagramm
  if (window.woundChartInstance) {
    window.woundChartInstance.destroy();
    window.woundChartInstance = null;
  }


  const useSimulation = document.getElementById('useSimulation').checked;
  if (useSimulation) {
    runMonteCarloSimulation();
    return;
  }


  // === INPUTS: Angreifer ===
  const models = +document.getElementById('models').value;
  const attacks = +document.getElementById('attacks').value;
  const clash = +document.getElementById('cllash').value;
  const leader = document.getElementById('leader').checked;
  const inspired = document.getElementById('inspired').checked;
const flurry = isRuleActive('flurry');
const relentless = isRuleActive('relentless');
const smite = isRuleActive('smite');
const shock = isRuleActive('shock');
const deadlyBlades = isRuleActive('deadlyBlades');
const gloriousCharge = isRuleActive('gloriousCharge');
const linebreaker = isRuleActive('linebreaker');
const flawless = isRuleActive('flawless');
const attackerBlessed = isRuleActive('blessed');
const opportunists = isRuleActive('opportunists');
const cleave = numericAttackerRules['cleaveBonus'] || 0;
const brutalImpact = numericAttackerRules['brutalImpactBonus'] || 0;
const trample = numericAttackerRules['trampleBonus'] || 0;
const terrifying = numericAttackerRules['terrifyingBonus'] || 0;
const impactBonus = numericAttackerRules['impactBonus'] || 0;
const priest = numericAttackerRules['priest'] || 0;
const attunement = +document.getElementById('attunement')?.value || 0;
const hitsPerSuccess = +document.getElementById('hitsPerSuccess')?.value || 0;
const magicArmorPiercing = numericMagicRules['magicArmorPiercing'] || 0;
const additionalHits = numericMagicRules['additionalHits'] || 0;
const fixedHits = numericMagicRules['fixedHits'] || 0;
const interference = isMagicRuleActive('interference');
const magicFlank = isMagicRuleActive('magicFlank');
const noResolveSpell = isMagicRuleActive('noResolve');
const insanityKheres = isMagicRuleActive('insanityKheres');
const flawlessTrigger = parseInt(document.getElementById('flawlessTriggerValue')?.value || "1");
const relentlessTrigger = parseInt(document.getElementById('relentlessTriggerValue')?.value || "1");
const barrage = numericAttackerRules['barrage'] || 0;




  
  const attackerBlessedUsage = document.getElementById('attackerBlessedUsage').value;


  const support = +document.getElementById('support').value;
  const standsInContact = Math.min(models, +document.getElementById('standsInContact').value);
  const nonContactStands = models - standsInContact;


  // === INPUTS: Verteidiger ===
  const defenderStands = +document.getElementById('defenderStands').value;
  const defense = +document.getElementById('defense').value;
  const evasion = +document.getElementById('evasion').value;
  const resolve = +document.getElementById('resolve').value;
 const hardened = numericDefenderRules['hardened'] || 0;
const indomitable = numericDefenderRules['indomitable'] || 0;
const bastion = numericDefenderRules['bastion'] || 0;
const tenacious = numericDefenderRules['tenacious'] || 0;
const obscured = isDefenderRuleActive('obscured');
const flankRear = isRuleActive('flankRear');
const reRollResolve = isRuleActive('rerollResolve');
const ignoreResolve = isDefenderRuleActive('ignoreResolve');
const oblivious = isDefenderRuleActive('oblivious');
const shield = isDefenderRuleActive('shield');
const parry = isDefenderRuleActive('parry');
const phalanx = isDefenderRuleActive('phalanx');
const duelDeclined = isDefenderRuleActive('duelDeclined');
const untouchable = isDefenderRuleActive('untouchable');
const blessedUsage = isDefenderRuleActive('blessed') ? document.getElementById('defenderBlessed').value : 'none';
const braveryType = isDefenderRuleActive('bravery') ? 'bravery' : isDefenderRuleActive('fearless') ? 'fearless' : 'none';
const ignoreTerrifying = braveryType === 'bravery' || braveryType === 'fearless';


  
  
  
  

  // === RESOLVE BONUS berechnen ===
  let resolveBonus = 0;
  if (defenderStands >= 4 && defenderStands <= 6) resolveBonus = 1;
  else if (defenderStands >= 7 && defenderStands <= 9) resolveBonus = 2;
  else if (defenderStands >= 10) resolveBonus = 3;
  if (phalanx && !flankRear) resolveBonus += 1;
  const effectiveResolve = resolve + resolveBonus;

  // === ANGRIFFE berechnen ===
  let totalAttacks = 0;
  if (attacks > 0) {
    totalAttacks = standsInContact * attacks + nonContactStands * support + (leader ? 1 : 0);
  }

  // === CLASH berechnen ===
  let clashValue = inspired ? Math.min(clash + 1, 4) : clash;
  const rerollSixes = inspired && clash + 1 > 4;
  const baseHitChance = clashValue / 6;

  let hits = totalAttacks * baseHitChance;


  if (rerollSixes) {
  hits += totalAttacks * (1 / 6) * baseHitChance;
  }

  // Reroll-basierte Treffer
  if (!parry && ((attackerBlessed && attackerBlessedUsage === 'normal') || flurry || (opportunists && flankRear))) {
  hits += totalAttacks * (1 - baseHitChance) * baseHitChance;
  }

  // Relentless Blows: 1en unter den erfolgreichen Treffern erzeugen +1 Treffer
  if (relentless) {
  const triggerProb = relentlessTrigger === 1 ? (1 / 6) : (2 / 6);
  const extraHits = hits * triggerProb;
  hits += extraHits;
}

  // === IMPACT ATTACKS berechnen ===
  const totalImpact = models * impactBonus;
  let clashImpact = clash;
  if (gloriousCharge) clashImpact += 1;
  if (shock) clashImpact += 1;
  const impactHitChance = clashImpact / 6;

  let impactHits = totalImpact * impactHitChance;
  if (!parry && ((attackerBlessed && attackerBlessedUsage === 'impact') || flurry || (opportunists && flankRear))) {
    impactHits += totalImpact * (1 - impactHitChance) * impactHitChance;
  }
  
// === BARRAGE ===
let volley = +document.getElementById('volley')?.value || 0;

const hasAimedShot = activeRangedRules.has('aimedShot');
let aimedShotReroll = false;

if (hasAimedShot) {
  if (volley < 4) {
    volley += 1;
  } else {
    aimedShotReroll = true;
  }
}

const hasDeadlyShot = activeRangedRules.has('deadlyShot');
const hasPreciseShot = activeRangedRules.has('preciseShot');
const hasRapidVolley = activeRangedRules.has('rapidVolley');
const hasTorrentialFire = activeRangedRules.has('torrentialFire');

let barrageHits = 0;
let barrageWounds = 0;

if (barrage > 0) {
  const rangedShootingStands = +document.getElementById('rangedStandsShooting')?.value || 0;
  const effectiveRangeStands = +document.getElementById('rangedStandsEffectiveRange')?.value || 0;
  const obscured = isDefenderRuleActive('obscured');
  const hasLeader = document.getElementById('leader')?.checked;

  const armorPiercing = numericRangedRules?.['armorPiercing'] || 0;
  const hardened = numericDefenderRules?.['hardened'] || 0;
  // Hardened cancels out armor piercing before it lowers the defense
  const effectiveAP = Math.max(0, armorPiercing - hardened);
  const adjustedDefense = Math.max(0, defense - effectiveAP);

  let totalBarrageAttacks = 0;

  for (let i = 0; i < rangedShootingStands; i++) {
    let base = barrage;
    if (i === 0 && hasLeader) base += 1;
    if (i < effectiveRangeStands) base += 1;
    if (obscured) base /= 2;
    totalBarrageAttacks += Math.ceil(base);
  }

  let trackedHits = 0;

  for (let i = 0; i < totalBarrageAttacks; i++) {
    let roll = Math.ceil(Math.random() * 6);
    let hit = roll <= volley;
    let usedPreciseShot = hasPreciseShot && roll === 1;

    if (!hit && opportunists && flankRear) {
      roll = Math.ceil(Math.random() * 6);
      hit = roll <= volley;
      usedPreciseShot = hasPreciseShot && roll === 1;
    } else if (!hit && aimedShotReroll && roll === 6) {
      roll = Math.ceil(Math.random() * 6);
      hit = roll <= volley;
      usedPreciseShot = hasPreciseShot && roll === 1;
    }

    if (hasRapidVolley && roll === 1) {
      let saveTargetExtra = usedPreciseShot ? 0 : Math.max(adjustedDefense, evasion);
      let saveRollExtra = Math.ceil(Math.random() * 6);
      let failExtra = saveRollExtra > saveTargetExtra;

      if (untouchable && saveRollExtra === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        failExtra = reroll > saveTargetExtra;
      }

      if (failExtra) {
        barrageWounds += (hasDeadlyShot && saveRollExtra === 6) ? 2 : 1;
      }
    }

    if (hit) {
      trackedHits++;
      let saveTarget = usedPreciseShot ? 0 : Math.max(adjustedDefense, evasion);
      let saveRoll = Math.ceil(Math.random() * 6);
      let fail = saveRoll > saveTarget;

      if (untouchable && saveRoll === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        fail = reroll > saveTarget;
      }

      if (fail) {
        barrageWounds += (hasDeadlyShot && saveRoll === 6) ? 2 : 1;
      }
    }
  }

  // Torrential Fire: additional auto-hits based on hits within Effective Range
  if (hasTorrentialFire && effectiveRangeStands > 0) {
    const bonusHits = Math.ceil(trackedHits / 2);
    for (let i = 0; i < bonusHits; i++) {
      let saveRoll = Math.ceil(Math.random() * 6);
      let fail = saveRoll > Math.max(adjustedDefense, evasion);

      if (untouchable && saveRoll === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        fail = reroll > Math.max(adjustedDefense, evasion);
      }

      if (fail) barrageWounds++;
    }
  }

  const tenaciousUsed = Math.min(barrageWounds, tenacious);
  barrageWounds -= tenaciousUsed;
}




  // === DEFENSE berechnen ===
  let effectiveDefense = defense;
  if (phalanx && !flankRear) effectiveDefense += 1;
  if (!linebreaker) {
    effectiveDefense += bastion;
    if (shield && !flankRear) effectiveDefense += 1;
  }

  // Hardened lowers the attacker's cleave and brutal impact instead of reducing
  // defense. It also reduces armor piercing from ranged attacks. Values never
  // drop below zero.
  const reducedCleave = Math.max(0, cleave - hardened);
  const reducedBrutalImpact = Math.max(0, brutalImpact - hardened);

  const normalDefense = smite ? 0 : effectiveDefense;
  const saveNormal = Math.max(normalDefense - reducedCleave, evasion);
  const saveImpact = Math.max(effectiveDefense - reducedBrutalImpact, evasion);
  const saveTrample = Math.max(effectiveDefense, evasion);

  let saveChanceNormal = Math.min(saveNormal, 6) / 6;
  let saveChanceImpact = Math.min(saveImpact, 6) / 6;
  let saveChanceTrample = Math.min(saveTrample, 6) / 6;

  // === BLESSED Verteidiger (Reroll Saves) ===
  if (blessedUsage === 'normal') saveChanceNormal += (1 - saveChanceNormal) * saveChanceNormal;
  if (blessedUsage === 'impact') saveChanceImpact += (1 - saveChanceImpact) * saveChanceImpact;
  // === TERRIFYING prüfen ===
  const totalTerrifying = terrifying + (gloriousCharge ? 1 : 0);
  const resolveVal = Math.max(1, effectiveResolve - (ignoreTerrifying ? 0 : totalTerrifying));
  let resolveChance = ignoreResolve ? 1 : Math.min(resolveVal, 5) / 6;
  if (duelDeclined && !ignoreResolve) resolveChance -= (1 / 6) * (1 / 6);
  

  // === Flawless Strikes ===
  const flawlessProbability = flawlessTrigger === 1 ? (1 / 6) : (2 / 6);
  const flawlessHits = flawless ? totalAttacks * flawlessProbability : 0;
  const regularHits = hits - flawlessHits;

  const saveChanceFlawless = Math.min(Math.max(evasion, 0), 6) / 6;
  let failedSavesFlawless = flawlessHits * (1 - saveChanceFlawless);
  if (untouchable) {
  const rerollable = failedSavesFlawless * (1 / 6);
  failedSavesFlawless -= rerollable * saveChanceFlawless;
}
  const tenaciousFlawless = Math.min(failedSavesFlawless, tenacious);
  failedSavesFlawless -= tenaciousFlawless;

  let failedResolveFlawless = failedSavesFlawless * (1 - resolveChance);
  if ((flankRear || reRollResolve) && !ignoreResolve) {
    failedResolveFlawless += failedSavesFlawless * resolveChance * (1 - resolveChance);
  }
  failedResolveFlawless = Math.max(0, failedResolveFlawless - indomitable);

  // === Normale Treffer (inkl. Deadly Blades) ===
  let baseFailedSaves = regularHits * (1 - saveChanceNormal);

  // === Impact Hits ===
  let failedImpactSaves = impactHits * (1 - saveChanceImpact);
  const tenaciousImpact = Math.min(failedImpactSaves, tenacious);
  failedImpactSaves -= tenaciousImpact;
  let failedImpactResolve = failedImpactSaves * (1 - resolveChance);
  if (untouchable) {
    const rerollable = failedImpactSaves * (1 / 6);
    failedImpactSaves -= rerollable * saveChanceImpact;
  }
  if ((flankRear || reRollResolve) && !ignoreResolve) {
    failedImpactResolve += failedImpactSaves * resolveChance * (1 - resolveChance);
  }
  failedImpactResolve = Math.max(0, failedImpactResolve - indomitable);

  // === TRAMPLE ===
  const trampleHits = models * trample;
  let trampleWounds = trampleHits * (1 - saveChanceTrample);
if (untouchable) {
  const rerollable = trampleWounds * (1 / 6);
  trampleWounds -= rerollable * saveChanceTrample;
}
  const tenaciousTrample = Math.min(trampleWounds, tenacious);
  trampleWounds -= tenaciousTrample;
  let priestMessage = '';
  if (priest > 0) {
    let attune = attunement - (interference ? 1 : 0);
    if (attune < 1) attune = 1;
    const successChance = Math.min(attune, 6) / 6;
    const avgSuccesses = priest * successChance;
    if (avgSuccesses >= 2) {
      const effectiveHPS = insanityKheres ? 2 : hitsPerSuccess;
      const avgHits = fixedHits > 0 ? fixedHits + additionalHits : avgSuccesses * effectiveHPS + additionalHits;
      const baseDefenseMagic = insanityKheres ? resolve : defense;
      const saveMagic = Math.max(Math.max(baseDefenseMagic - magicArmorPiercing, 0), evasion);
      const saveChanceMagic = Math.min(saveMagic, 6) / 6;
      magicFailedSaves = avgHits * (1 - saveChanceMagic);
      const tenaciousMagic = Math.min(magicFailedSaves, tenacious);
      magicFailedSaves -= tenaciousMagic;
      if (!noResolveSpell && !insanityKheres) {
        magicFailedResolve = magicFailedSaves * (1 - resolveChance);
        if ((magicFlank || flankRear || reRollResolve) && !ignoreResolve) {
          magicFailedResolve += magicFailedSaves * resolveChance * (1 - resolveChance);
        }
        magicFailedResolve = Math.max(0, magicFailedResolve - indomitable);
    }
      magicWounds = magicFailedSaves + magicFailedResolve;
      priestMessage = `Average Spell Hits: ${avgHits.toFixed(2)} (from ${avgSuccesses.toFixed(2)} successes)`;
    } else {
      priestMessage = `Spell likely fails (avg successes ${avgSuccesses.toFixed(2)})`;
    }
  }


  // === OBLIVIOUS (modifiziert Resolve-Wunden) ===
  const resolveWoundsNormal = oblivious
    ? Math.ceil((failedResolve + failedResolveFlawless) / 2)
    : failedResolve + failedResolveFlawless;

  const resolveWoundsImpact = oblivious
    ? Math.ceil(failedImpactResolve / 2)
    : failedImpactResolve;

  const totalWoundsNormal = failedSaves + failedSavesFlawless + resolveWoundsNormal;
  const totalWoundsImpact = failedImpactSaves + resolveWoundsImpact;
  const totalWounds = totalWoundsNormal + totalWoundsImpact + trampleWounds + barrageWounds;
  // === AUSGABE vorbereiten ===
  let resultText = '';

  // Normale Angriffe
if (totalAttacks > 0) {
  resultText += `--- Normal Attack ---
Hits: ${(regularHits + flawlessHits).toFixed(1)}
Failed Saves: ${(failedSaves + failedSavesFlawless).toFixed(1)}${blessedUsage === 'normal' ? ' (Defender Blessed)' : ''}${attackerBlessed && attackerBlessedUsage === 'normal' ? ' (Attacker Blessed)' : ''}${flawless ? ' (Flawless Strikes)' : ''}
Failed Resolve: ${(failedResolve + failedResolveFlawless).toFixed(1)}
Wounds: ${totalWoundsNormal.toFixed(1)}

`;
}

// Impact-Angriffe
if (totalImpact > 0) {
  resultText += `--- Impact Attack ---
Hits: ${impactHits.toFixed(1)}
Failed Saves: ${failedImpactSaves.toFixed(1)}${blessedUsage === 'impact' ? ' (Defender Blessed)' : ''}${attackerBlessed && attackerBlessedUsage === 'impact' ? ' (Attacker Blessed)' : ''}
Failed Resolve: ${failedImpactResolve.toFixed(1)}
Wounds: ${totalWoundsImpact.toFixed(1)}

`;
}

// Trample
if (trampleHits > 0) {
  resultText += `--- Trample ---
Auto-Hits (from ${models} stands): ${trampleHits}
Failed Saves: ${trampleWounds.toFixed(1)}
Wounds: ${trampleWounds.toFixed(1)}

`;
}

// Barrage
if (barrage > 0) {
  resultText += `--- Barrage ---
Volley Attacks: ${models} × ${barrage} = ${models * barrage}
Wounds: ${barrageWounds.toFixed(1)}

`;
}


  // Gesamtübersicht
 resultText += `--- Total Damage ---
Overall Wounds: ${totalWounds.toFixed(1)}`;


  // Ausgabe setzen
  document.getElementById('result').innerText = resultText;
  // Chart erzeugen
const ctx = document.getElementById('woundChart').getContext('2d');

// Häufigkeiten berechnen
const woundCounts = {};
results.forEach(w => {
  woundCounts[w] = (woundCounts[w] || 0) + 1;
});

const sortedKeys = Object.keys(woundCounts).map(Number).sort((a, b) => a - b);
const frequencies = sortedKeys.map(k => woundCounts[k]);

// Falls ein alter Chart existiert → zerstören
if (window.woundChartInstance) {
  window.woundChartInstance.destroy();
}

// Neuen Chart erzeugen
  window.woundChartInstance = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: sortedKeys,
    datasets: [{
      label: 'Wound Frequency',
      data: frequencies,
      backgroundColor: '#4caf50'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Wound Distribution'
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Wounds' }
      },
      y: {
        title: { display: true, text: 'Frequency' },
        beginAtZero: true
      }
    }
  }
  });
}


window.calculateDamage = calculateDamage;

window.onload = () => {
  console.log("Script loaded, addAttackerRule is available:", typeof addAttackerRule === 'function');
};
