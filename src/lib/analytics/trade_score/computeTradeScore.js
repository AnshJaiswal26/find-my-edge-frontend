// scoreEngine.js

import { FILTER_OPERATION_MAP, isBetween } from "@shared/utils";

const POSITIVE_TAGS = ["GOOD", "VERY_GOOD", "EXCELLENT"];
const NEGATIVE_TAGS = ["BAD", "VERY_BAD", "WORST"];

const POSITIVE_WEIGHTS = { GOOD: 1.5, VERY_GOOD: 2.0, EXCELLENT: 3.0 };
const NEGATIVE_WEIGHTS = { BAD: 1.0, VERY_BAD: 2.0, WORST: 3.0 };

// ─── TAG FOR SCORE ───────────────────────────────────────────
function tagForScore(score) {
  if (score >= 90) return "EXCELLENT";
  if (score >= 80) return "VERY_GOOD";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "NEUTRAL";
  if (score >= 20) return "BAD";
  if (score >= 10) return "VERY_BAD";
  return "WORST";
}

// ─── CONDITION EVALUATOR ─────────────────────────────────────
function evaluateCondition(condition, actualValue, expected, from, to) {
  const actual = Number(actualValue);
  const value = isBetween(condition) ? from : expected;
  return FILTER_OPERATION_MAP[condition]?.(actual, value, to) || false;
}

// ─── MAIN SCORE FUNCTION ─────────────────────────────────────
/**
 * @param {object} trade     - raw trade object from store (tradesById[tradeId])
 * @param {object} derived   - derived/computed values (derivedByTradeId[tradeId])
 * @param {object} setup     - setup object from store (tradeSetupsById[setupId])
 * @returns {object}         - { score, overallTag, fieldMatches }
 */
export function computeTradeScore(trade, derived, setup) {
  let positiveTotal = 0;
  let positiveAchieved = 0;
  let penalty = 0;

  const fieldMatches = {};

  const fields = Object.values(setup.fieldsById);

  for (const field of fields) {
    const { id, mappedSchemaId, condition, expected, from, to, tag } = field;

    // resolve actual value — derived first, then raw trade
    const actualValue =
      derived[mappedSchemaId] ?? trade[mappedSchemaId] ?? null;

    if (actualValue === null || actualValue === undefined) {
      fieldMatches[id] = {
        fieldId: id,
        mappedSchemaId,
        actualValue: null,
        expectedValue: expected,
        from,
        to,
        match: false,
        condition,
        tag,
      };
      continue;
    }

    const match = evaluateCondition(condition, actualValue, expected, from, to);

    fieldMatches[id] = {
      fieldId: id,
      mappedSchemaId,
      actualValue,
      expectedValue: expected,
      from,
      to,
      match,
      condition,
      tag,
    };

    // positive signal
    if (POSITIVE_TAGS.includes(tag)) {
      const w = POSITIVE_WEIGHTS[tag];
      positiveTotal += w;
      if (match) positiveAchieved += w;
    }

    // negative signal
    else if (NEGATIVE_TAGS.includes(tag)) {
      if (match) penalty += NEGATIVE_WEIGHTS[tag];
    }
  }

  const baseScore =
    positiveTotal === 0 ? 0 : (positiveAchieved / positiveTotal) * 100;

  const penaltyFactor = positiveTotal === 0 ? 10 : 100.0 / positiveTotal;
  const finalScore =
    Math.round((baseScore - penalty * penaltyFactor) * 100) / 100;

  return {
    score: finalScore,
    overallTag: tagForScore(finalScore),
    fieldMatches, // key = fieldId, use this to animate each row
  };
}
