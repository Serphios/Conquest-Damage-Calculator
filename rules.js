const activeAttackerRules = new Set();
const numericAttackerRules = {};

const activeDefenderRules = new Set();
const numericDefenderRules = {};
const activeRangedRules = new Set();
const numericRangedRules = {};
const activeMagicRules = new Set();
const numericMagicRules = {};

function addRuleToUI(key, labelText, type) {
  const list = document.getElementById("attackerRulesList");
  const existing = document.getElementById("att_rule_" + key);
  if (existing) existing.remove();

  const li = document.createElement("li");
  li.id = "att_rule_" + key;
  li.style.marginBottom = "5px";

  const label = document.createElement("span");
  label.textContent = labelText + " ";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.style.marginLeft = "10px";
  removeBtn.onclick = () => {
    if (type === "toggle") activeAttackerRules.delete(key);
    if (type === "numeric") delete numericAttackerRules[key];

    if (key === "blessed") {
      document.getElementById("blessedUsageContainer").style.display = "none";
    } else if (key === "flawless") {
      document.getElementById("flawlessConfigContainer").style.display = "none";
    } else if (key === "relentless") {
      document.getElementById("relentlessConfigContainer").style.display = "none";
    } else if (key === "barrage") {
      document.getElementById("rangedRuleSection").style.display = "none";
    } else if (key === "priest") {
      document.getElementById("magicRuleSection").style.display = "none";
    }

    li.remove();
  };

  li.appendChild(label);
  li.appendChild(removeBtn);
  list.appendChild(li);
}


function addAttackerRule() {
  const select = document.getElementById("attackerSpecialRules");
  const value = select.value;
  const text = select.options[select.selectedIndex].text;
  const type = select.options[select.selectedIndex].dataset.type || "toggle";

  if (!value) return;

  if (type === "toggle") {
    if (activeAttackerRules.has(value)) return;
    activeAttackerRules.add(value);
    addRuleToUI(value, text, type);
  if (value === "blessed") {
    document.getElementById("blessedUsageContainer").style.display = "block";
  } else if (value === "flawless") {
    document.getElementById("flawlessConfigContainer").style.display = "block";
  } else if (value === "relentless") {
    document.getElementById("relentlessConfigContainer").style.display = "block";
  } else if (value === "barrage") {
    document.getElementById("rangedRuleSection").style.display = "block";
  }



} else if (type === "numeric") {
  const current = numericAttackerRules[value] || 0;
  const input = prompt(`Enter value for ${text}:`, current || 1);
  const parsed = parseInt(input);
  if (isNaN(parsed) || parsed <= 0) return;

  numericAttackerRules[value] = parsed;
  activeAttackerRules.add(value);
  addRuleToUI(value, `${text} +${parsed}`, type);

  // Besondere Behandlung für Barrage
  if (value === "barrage") {
    document.getElementById("rangedRuleSection").style.display = "block";
  } else if (value === "priest") {
    document.getElementById("magicRuleSection").style.display = "block";
  }
}

  select.value = "";
}

function addRangedRule() {
  const select = document.getElementById("attackerRangedRules");
  const value = select.value;
  const text = select.options[select.selectedIndex].text;
  const type = select.options[select.selectedIndex].dataset.type || "toggle";

  if (!value || activeRangedRules.has(value)) return;

  let labelText = text;

  if (type === "numeric") {
    const current = numericRangedRules?.[value] || 0;
    const input = prompt(`Enter value for ${text}:`, current || 1);
    const parsed = parseInt(input);
    if (isNaN(parsed) || parsed <= 0) return;

    // Stelle sicher, dass das Objekt existiert
    if (!window.numericRangedRules) {
      window.numericRangedRules = {};
    }

    numericRangedRules[value] = parsed;
    labelText += ` +${parsed}`;
  }
  activeRangedRules.add(value);

  const list = document.getElementById("attackerRangedRulesList");
  const li = document.createElement("li");
  li.id = "ranged_rule_" + value;
  li.style.marginBottom = "5px";

  const label = document.createElement("span");
  label.textContent = labelText;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.style.marginLeft = "10px";
  removeBtn.onclick = () => {
    activeRangedRules.delete(value);
    if (numericRangedRules?.[value]) delete numericRangedRules[value];
    li.remove();
  };

  li.appendChild(label);
  li.appendChild(removeBtn);
  list.appendChild(li);

  select.value = "";
}


function addMagicRule() {
  const select = document.getElementById("attackerMagicRules");
  const value = select.value;
  const text = select.options[select.selectedIndex].text;
  const type = select.options[select.selectedIndex].dataset.type || "toggle";

  if (!value || activeMagicRules.has(value)) return;

  let labelText = text;

  if (type === "numeric") {
    const current = numericMagicRules[value] || 0;
    const input = prompt(`Enter value for ${text}:`, current || 1);
    const parsed = parseInt(input);
    if (isNaN(parsed) || parsed <= 0) return;

    numericMagicRules[value] = parsed;
    labelText += ` +${parsed}`;
  }

  activeMagicRules.add(value);

  const list = document.getElementById("attackerMagicRulesList");
  const li = document.createElement("li");
  li.id = "magic_rule_" + value;
  li.style.marginBottom = "5px";

  const label = document.createElement("span");
  label.textContent = labelText;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.style.marginLeft = "10px";
  removeBtn.onclick = () => {
    activeMagicRules.delete(value);
    if (numericMagicRules[value]) delete numericMagicRules[value];
    li.remove();
  };

  li.appendChild(label);
  li.appendChild(removeBtn);
  list.appendChild(li);

  select.value = "";
}


function addDefenderRule() {
  const select = document.getElementById("defenderSpecialRules");
  const value = select.value;
  const text = select.options[select.selectedIndex].text;
  const type = select.options[select.selectedIndex].dataset.type || "toggle";

  if (!value) return;

  if (type === "toggle") {
    if (activeDefenderRules.has(value)) return;
    activeDefenderRules.add(value);

    // Show Blessed Usage dropdown when blessed is added
    if (value === "blessed") {
      document.getElementById("defenderBlessedContainer").style.display = "block";
    }

    addDefenderRuleToUI(value, text, type);
  } else if (type === "numeric") {
    const current = numericDefenderRules[value] || 0;
    const input = prompt(`Enter value for ${text}:`, current || 1);
    const parsed = parseInt(input);
    if (isNaN(parsed) || parsed <= 0) return;

    numericDefenderRules[value] = parsed;
    addDefenderRuleToUI(value, `${text} +${parsed}`, type);
  }

  select.value = "";
}

function addDefenderRuleToUI(key, labelText, type) {
  const list = document.getElementById("defenderRulesList");
  const existing = document.getElementById("def_rule_" + key);
  if (existing) existing.remove();

  const li = document.createElement("li");
  li.id = "def_rule_" + key;
  li.style.marginBottom = "5px";

  const label = document.createElement("span");
  label.textContent = labelText + " ";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.style.marginLeft = "10px";
  removeBtn.onclick = () => {
    if (type === "toggle") activeDefenderRules.delete(key);
    if (type === "numeric") delete numericDefenderRules[key];

    if (key === "blessed") {
      document.getElementById("defenderBlessedContainer").style.display = "none";
    }

    li.remove();
  };

  li.appendChild(label);
  li.appendChild(removeBtn);
  list.appendChild(li);
}

function isRuleActive(ruleId) {
  return activeAttackerRules.has(ruleId);
}

function isDefenderRuleActive(ruleId) {
  return activeDefenderRules.has(ruleId);
}

function isMagicRuleActive(ruleId) {
  return activeMagicRules.has(ruleId);
}





