import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../rand';
import { KINDS, land, lead, spring, trackOn } from '../beatLand';
import { dbToGain, duck, gap } from '../mix';

describe('mulberry32 (deterministic PRNG)', () => {
  it('returns identical sequences for the same seed within [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 12 }, () => a());
    const seqB = Array.from({ length: 12 }, () => b());
    expect(seqA).toEqual(seqB);
    for (const v of seqA) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('produces distinct sequences for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
});

describe('beatLand (pre-beat anticipation spring)', () => {
  it('stays at 0 before start and approaches 1 near target beat', () => {
    expect(spring(0.5, 1.0, KINDS.settle)).toBe(0);
    const beat = 2.0;
    const preLead = lead('settle');
    expect(preLead).toBeGreaterThan(0);
    expect(land(beat - preLead - 0.01, beat, 'settle')).toBe(0);
    expect(Math.abs(1 - land(beat, beat, 'settle'))).toBeLessThanOrEqual(0.06);
  });

  it('transitions smoothly across multiple beat keyframes via trackOn', () => {
    const keys: Array<[number, number]> = [
      [0, 100],
      [1.0, 300],
      [2.5, 50],
    ];
    expect(trackOn(0, keys, 'snap')).toBe(100);
    expect(Math.abs(trackOn(1.0, keys, 'snap') - 300)).toBeLessThan(15);
    expect(Math.abs(trackOn(3.2, keys, 'snap') - 50)).toBeLessThan(2);
  });
});

describe('mix (BGM ducking and pause gap)', () => {
  it('ducks gain around sync hit and recovers smoothly', () => {
    const hits = [{ at: 100, db: 6, pre: 2, hold: 5, release: 10 }];
    expect(duck(90, hits)).toBe(1);
    expect(duck(100, hits)).toBeCloseTo(dbToGain(-6), 4);
    expect(duck(103, hits)).toBeCloseTo(dbToGain(-6), 4);
    expect(duck(116, hits)).toBe(1);
  });

  it('mutes inside gap window with fade edges', () => {
    expect(gap(10, 20, 30, 2)).toBe(1);
    expect(gap(19, 20, 30, 2)).toBeCloseTo(0.5, 5);
    expect(gap(25, 20, 30, 2)).toBe(0);
    expect(gap(35, 20, 30, 2)).toBe(1);
  });
});
