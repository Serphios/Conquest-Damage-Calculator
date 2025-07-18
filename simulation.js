function runMonteCarloSimulation() {
  const iterations = 10000;
  const results = [];
  // aggregated stats across all iterations
  let totalHits = 0;
  let totalFailedSaves = 0;
  let totalFailedResolve = 0;
  // track resolve failures outside the iteration loop to avoid scope issues
  let failedResolve = 0;

  // Eingaben lesen Attacker
  const models = +document.getElementById('models').value;
  const attacks = +document.getElementById('attacks').value;
const attackerBlessedUsage = document.getElementById('attackerBlessedUsage').value;
const flawlessTrigger = parseInt(document.getElementById('flawlessTriggerValue')?.value || "1");
const relentlessTrigger = parseInt(document.getElementById('relentlessTriggerValue')?.value || "1");
const barrage = numericAttackerRules['barrage'] || 0;
const priest = numericAttackerRules['priest'] || 0;
  // Toggle and numeric attacker rules
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

  // Magic related inputs and rules
  const attunement = +document.getElementById('attunement')?.value || 1;
  const hitsPerSuccess = +document.getElementById('hitsPerSuccess')?.value || 1;
  const magicArmorPiercing = numericMagicRules['magicArmorPiercing'] || 0;
  const additionalHits = numericMagicRules['additionalHits'] || 0;
  const fixedHits = numericMagicRules['fixedHits'] || 0;
  const interference = isMagicRuleActive('interference');
  const magicFlank = isMagicRuleActive('magicFlank');
  const noResolveSpell = isMagicRuleActive('noResolve');
  const insanityKheres = isMagicRuleActive('insanityKheres');

  let priestMessage = '';
  let expectedSuccesses = 0;
  if (priest > 0) {
    const totalDice = priest;
    let attune = attunement - (interference ? 1 : 0);
    if (attune < 1) attune = 1;
    const successChance = Math.min(attune, 6) / 6;
    expectedSuccesses = totalDice * successChance;
    if (expectedSuccesses < 2) {
      priestMessage = `Spell likely fails (avg successes ${expectedSuccesses.toFixed(2)})`;
    } else {
      const hps = insanityKheres ? 2 : hitsPerSuccess;
      let expectedHits = fixedHits > 0 ? fixedHits : expectedSuccesses * hps;
      expectedHits += additionalHits;
      priestMessage = `Average Spell Hits: ${expectedHits.toFixed(2)} (from ${expectedSuccesses.toFixed(2)} successes)`;
    }
  }
  const clash = +document.getElementById('cllash').value;
const inspired = document.getElementById('inspired').checked;
const leader = document.getElementById('leader').checked;
const support = +document.getElementById('support').value;




// Eingaben lesen Defender
const defense = +document.getElementById('defense').value;
  const evasion = +document.getElementById('evasion').value;
  const resolve = +document.getElementById('resolve').value;
  const defenderStands = +document.getElementById('defenderStands').value;
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

  // Resolve bonus and target calculations
  let resolveBonus = 0;
  if (defenderStands >= 4 && defenderStands <= 6) resolveBonus = 1;
  else if (defenderStands >= 7 && defenderStands <= 9) resolveBonus = 2;
  else if (defenderStands >= 10) resolveBonus = 3;
  if (phalanx && !flankRear) resolveBonus += 1;
  const effectiveResolve = resolve + resolveBonus;
  const totalTerrifying = terrifying + (gloriousCharge ? 1 : 0);
  const resolveTarget = Math.max(1, effectiveResolve - (ignoreTerrifying ? 0 : totalTerrifying));

  let effectiveDefense = defense;
  if (phalanx && !flankRear) effectiveDefense += 1;
  if (!linebreaker) {
    effectiveDefense += bastion;
    if (shield && !flankRear) effectiveDefense += 1;
  }
  // Hardened lowers the attacker's cleave and brutal impact instead of
  // reducing the defender's defense. It also offsets armor piercing from ranged
  // attacks. Values never drop below zero.
  const reducedCleave = Math.max(0, cleave - hardened);
  const reducedBrutalImpact = Math.max(0, brutalImpact - hardened);

const rerollSixes = inspired && clash + 1 > 4;


  const inspiredClash = inspired ? Math.min(clash + 1, 4) : clash;
  const clashImpact = shock ? inspiredClash + 1 : inspiredClash;

  const standsInContact = +document.getElementById('standsInContact').value;
  const nonContactStands = models - standsInContact;
  const totalAttacks = attacks > 0 ? standsInContact * attacks + nonContactStands * support + (leader ? 1 : 0) : 0;

for (let i = 0; i < iterations; i++) {
  let simWounds = 0;
  failedResolve = 0;

// Angriff
let flawlessHits = 0;
let regularHits = 0;

for (let j = 0; j < totalAttacks; j++) {
  let roll = Math.ceil(Math.random() * 6);
  let hit = roll <= inspiredClash;

  if (!hit && rerollSixes && roll === 6) {
    const reroll = Math.ceil(Math.random() * 6);
    hit = reroll <= inspiredClash;
  }

  if (!hit && !parry && (
    (attackerBlessed && attackerBlessedUsage === 'normal') || flurry || (opportunists && flankRear))) {
    roll = Math.ceil(Math.random() * 6);
    hit = roll <= inspiredClash;
  }

  if (hit) {
    // Flawless-Strikes-Sonderregel
    const isFlawless = flawless && (flawlessTrigger === 1 ? roll === 1 : roll <= 2);
    if (isFlawless) {
      flawlessHits++;
    } else {
      regularHits++;
    }

    // Relentless Blows triggert **zusätzlich**, auch bei Flawless
    if (relentless && roll <= relentlessTrigger) {
      regularHits++;
    }
  }
}

// Impact attacks
const totalImpact = models * impactBonus;
let impactHits = 0;
for (let j = 0; j < totalImpact; j++) {
  let roll = Math.ceil(Math.random() * 6);
  let hit = roll <= clashImpact;
  if (!hit && !parry && ((attackerBlessed && attackerBlessedUsage === 'impact') || flurry || (opportunists && flankRear))) {
    roll = Math.ceil(Math.random() * 6);
    hit = roll <= clashImpact;
  }
  if (hit) impactHits++;
}



    let saveTarget = Math.max((smite ? 0 : effectiveDefense) - reducedCleave, evasion);
    let failedSaves = 0;
    for (let j = 0; j < regularHits; j++) {
      let saveRoll = Math.ceil(Math.random() * 6);
      if (saveRoll > saveTarget) {
  let fail = true;

  if (untouchable && saveRoll === 6) {
    const reroll = Math.ceil(Math.random() * 6);
    fail = reroll > saveTarget;
  }

 if (fail && blessedUsage === 'normal') {
    const blessedReroll = Math.ceil(Math.random() * 6);
    fail = blessedReroll > saveTarget;
  }

  if (fail) failedSaves++;
}


    }

    const tenaciousNormal = Math.min(failedSaves, tenacious);
    failedSaves -= tenaciousNormal;

    if (deadlyBlades) {
      const deadly = Math.floor(failedSaves * (1 / 6));
      failedSaves += deadly;
    }

    let saveFlawlessTarget = Math.max(evasion - hardened, 0);
    let failedFlawless = 0;
    for (let j = 0; j < flawlessHits; j++) {
      let roll = Math.ceil(Math.random() * 6);
      let fail = roll > saveFlawlessTarget;

      if (fail && untouchable && roll === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        fail = reroll > saveFlawlessTarget;
      }

      if (fail) failedFlawless++;
    }

    let saveImpactTarget = Math.max(effectiveDefense - reducedBrutalImpact, evasion);
    let failedImpact = 0;
    for (let j = 0; j < impactHits; j++) {
      const roll = Math.ceil(Math.random() * 6);
      if (roll > saveImpactTarget) {
  let fail = true;

  if (untouchable && roll === 6) {
    const reroll = Math.ceil(Math.random() * 6);
    fail = reroll > saveImpactTarget;
  }

  if (fail && blessedUsage === 'impact') {
    const blessedReroll = Math.ceil(Math.random() * 6);
    fail = blessedReroll > saveImpactTarget;
  }
  if (fail) failedImpact++;
}
    }
    const tenaciousImpact = Math.min(failedImpact, tenacious);
    failedImpact -= tenaciousImpact;

    // === Trample ===
    const trampleHits = models * trample;
    let failedTrample = 0;
    const saveTrampleTarget = Math.max(effectiveDefense, evasion);
    for (let j = 0; j < trampleHits; j++) {
      let roll = Math.ceil(Math.random() * 6);
      let fail = roll > saveTrampleTarget;
      if (untouchable && roll === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        fail = reroll > saveTrampleTarget;
      }
      if (fail) failedTrample++;
    }
    const tenaciousTrample = Math.min(failedTrample, tenacious);
    failedTrample -= tenaciousTrample;

    // === Resolve for melee/impact (Trample causes no Resolve) ===
    if (!ignoreResolve) {
      const totalFailed = failedSaves + failedFlawless + failedImpact;
      for (let j = 0; j < totalFailed; j++) {
        let roll = Math.ceil(Math.random() * 6);
        let success = roll <= resolveTarget;
        if (!success) {
          if (duelDeclined && roll === 1) {
            const reroll = Math.ceil(Math.random() * 6);
            success = reroll <= resolveTarget;
          }
        } else if ((flankRear || reRollResolve) && !ignoreResolve) {
          const reroll = Math.ceil(Math.random() * 6);
          success = reroll <= resolveTarget;
        }
        if (!success) failedResolve++;
      }
    }

    // === Magic ===
    let magicHits = 0;
    if (priest > 0) {
      let attune = attunement - (interference ? 1 : 0);
      if (attune < 1) attune = 1;
      let successes = 0;
      for (let j = 0; j < priest; j++) {
        if (Math.ceil(Math.random() * 6) <= attune) successes++;
      }
      if (successes >= 2) {
        const hps = insanityKheres ? 2 : hitsPerSuccess;
        magicHits = fixedHits > 0 ? fixedHits : successes * hps;
        magicHits += additionalHits;
      }
    }

    let saveMagicTargetBase = insanityKheres ? resolve : defense;
    let saveMagicTarget = Math.max(Math.max(saveMagicTargetBase - magicArmorPiercing, 0), evasion);
    let failedMagic = 0;
    for (let j = 0; j < magicHits; j++) {
      const roll = Math.ceil(Math.random() * 6);
      if (roll > saveMagicTarget) {
        if (untouchable && roll === 6) {
          const reroll = Math.ceil(Math.random() * 6);
          if (reroll > saveMagicTarget) failedMagic++;
        } else {
          failedMagic++;
        }
      }
    }

    const tenaciousMagic = Math.min(failedMagic, tenacious);
    failedMagic -= tenaciousMagic;

let failedMagicResolve = 0;
if (priest > 0 && magicHits > 0 && !noResolveSpell && !insanityKheres) {
  for (let j = 0; j < failedMagic; j++) {
    let roll = Math.ceil(Math.random() * 6);
    let success = roll <= resolveTarget;
    if (!success) {
      if (duelDeclined && roll === 1) {
        const reroll = Math.ceil(Math.random() * 6);
        success = reroll <= resolveTarget;
      }
    } else if ((magicFlank || flankRear || reRollResolve) && !ignoreResolve) {
      const reroll = Math.ceil(Math.random() * 6);
      success = reroll <= resolveTarget;
    }
    if (!success) failedMagicResolve++;
  }
}
failedMagicResolve = Math.max(0, failedMagicResolve - indomitable);
// === Barrage ===
let volley = +document.getElementById('volley')?.value || 0;
let barrageWounds = 0;
let trackedHits = 0;
let bonusHits = 0;
let failedBarrage = 0;
let extraVolleyHits = 0;
let barrageHitsCount = 0;

if (barrage > 0) {
  const rangedShootingStands = +document.getElementById('rangedStandsShooting')?.value || 0;
  const effectiveRangeStands = +document.getElementById('rangedStandsEffectiveRange')?.value || 0;
  const hasLeader = document.getElementById('leader')?.checked;
  const obscured = isDefenderRuleActive('obscured');

  const hasAimedShot = activeRangedRules.has('aimedShot');
  const hasDeadlyShot = activeRangedRules.has('deadlyShot');
  const hasPreciseShot = activeRangedRules.has('preciseShot');
  const hasRapidVolley = activeRangedRules.has('rapidVolley');
  const hasTorrentialFire = activeRangedRules.has('torrentialFire');
  let aimedShotReroll = false;

  if (hasAimedShot) {
    if (volley < 4) {
      volley += 1;
    } else {
      aimedShotReroll = true;
    }
  }

  const armorPiercing = numericRangedRules?.['armorPiercing'] || 0;
  const hardened = numericDefenderRules?.['hardened'] || 0;
  // Hardened cancels out armor piercing before adjusting defense
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
      extraVolleyHits++;
      let saveTargetExtra = usedPreciseShot ? 0 : Math.max(adjustedDefense, evasion);
      let saveRollExtra = Math.ceil(Math.random() * 6);
      let failExtra = saveRollExtra > saveTargetExtra;

      if (untouchable && saveRollExtra === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        failExtra = reroll > saveTargetExtra;
      }

      if (failExtra) {
        failedBarrage++;
        barrageWounds += (hasDeadlyShot && saveRollExtra === 6) ? 2 : 1;
      }
    }

    // Torrential Fire: additional auto-hits based on hits within Effective Range
    if (hasTorrentialFire && effectiveRangeStands > 0) {
      const bonusHitsThisRound = Math.ceil(trackedHits / 2);
      bonusHits += bonusHitsThisRound;
      for (let i = 0; i < bonusHitsThisRound; i++) {
        let saveRoll = Math.ceil(Math.random() * 6);
        let fail = saveRoll > Math.max(adjustedDefense, evasion);

        if (untouchable && saveRoll === 6) {
          const reroll = Math.ceil(Math.random() * 6);
          fail = reroll > Math.max(adjustedDefense, evasion);
        }

        if (fail) {
          failedBarrage++;
          barrageWounds++;
        }
      }
    }

    if (hit) {
      trackedHits++;
      barrageHitsCount++;
      let saveTarget = usedPreciseShot ? 0 : Math.max(adjustedDefense, evasion);
      let saveRoll = Math.ceil(Math.random() * 6);
      let fail = saveRoll > saveTarget;

      if (untouchable && saveRoll === 6) {
        const reroll = Math.ceil(Math.random() * 6);
        fail = reroll > saveTarget;
      }

      if (fail) {
        failedBarrage++;
        barrageWounds += (hasDeadlyShot && saveRoll === 6) ? 2 : 1;
      }
    }
  }


  const tenaciousUsed = Math.min(barrageWounds, tenacious);
  barrageWounds -= tenaciousUsed;
}

  const totalBarrageHits = barrageHitsCount + extraVolleyHits + bonusHits;



// === Resolve ===
failedResolve = Math.max(0, failedResolve - indomitable);
const resolveWounds = oblivious ? Math.ceil(failedResolve / 2) : failedResolve;

  const iterationHits = regularHits + flawlessHits + impactHits + trampleHits + magicHits + totalBarrageHits;
  const iterationFailedSaves = failedSaves + failedFlawless + failedImpact + failedTrample + failedMagic + failedBarrage;
  const iterationFailedResolve = failedResolve + failedMagicResolve;

  totalHits += iterationHits;
  totalFailedSaves += iterationFailedSaves;
  totalFailedResolve += iterationFailedResolve;

    // === Total ===
  simWounds = failedSaves + failedFlawless + failedImpact + failedTrample + resolveWounds + barrageWounds;
    results.push(simWounds);
  }

  results.sort((a, b) => a - b);
  const avg = results.reduce((a, b) => a + b, 0) / iterations;
  const median = results[Math.floor(results.length / 2)];
  const mode = results.sort((a, b) =>
    results.filter(v => v === a).length - results.filter(v => v === b).length
  ).pop();

  const avgHits = totalHits / iterations;
  const avgFailedSaves = totalFailedSaves / iterations;
  const avgFailedResolve = totalFailedResolve / iterations;

const resultText = `--- Simulation Results (10,000 rolls) ---
Average Hits: ${avgHits.toFixed(2)}
Average Failed Saves: ${avgFailedSaves.toFixed(2)}
Average Failed Resolves: ${avgFailedResolve.toFixed(2)}
Average Wounds: ${avg.toFixed(2)}
Median: ${median}
Mode (most frequent): ${mode}`;


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

window.runMonteCarloSimulation = runMonteCarloSimulation;
