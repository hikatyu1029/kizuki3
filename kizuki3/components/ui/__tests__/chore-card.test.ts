import { getChoreColor, type Chore } from '../chore-card';

function makeChore(overrides: Partial<Chore> = {}): Chore {
  return {
    id: '1',
    title: 'テスト家事',
    lastDoneDate: daysAgo(0),
    lastDoneBy: 'テストユーザー',
    frequency: 'weekly',
    ...overrides,
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

describe('getChoreColor', () => {
  describe('weekly (7日周期)', () => {
    it('1日経過 → 緑（80%未満）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(1), frequency: 'weekly' }))).toBe('#22c55e');
    });

    it('5日経過 → 緑（80%=5.6日未満）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(5), frequency: 'weekly' }))).toBe('#22c55e');
    });

    it('6日経過 → 黄（80〜100%）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(6), frequency: 'weekly' }))).toBe('#f59e0b');
    });

    it('7日経過 → 黄（ちょうど期限）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(7), frequency: 'weekly' }))).toBe('#f59e0b');
    });

    it('8日経過 → 赤（期限+1日）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(8), frequency: 'weekly' }))).toBe('#ef4444');
    });

    it('9日経過 → 赤（期限+2日）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(9), frequency: 'weekly' }))).toBe('#ef4444');
    });

    it('10日経過 → 濃い赤（大幅超過）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(10), frequency: 'weekly' }))).toBe('#b91c1c');
    });
  });

  describe('daily (1日周期)', () => {
    it('当日完了 → 緑', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(0), frequency: 'daily' }))).toBe('#22c55e');
    });

    it('2日経過 → 赤（期限+1日）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(2), frequency: 'daily' }))).toBe('#ef4444');
    });

    it('4日経過 → 濃い赤', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(4), frequency: 'daily' }))).toBe('#b91c1c');
    });
  });

  describe('monthly (30日周期)', () => {
    it('20日経過 → 緑（80%=24日未満）', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(20), frequency: 'monthly' }))).toBe('#22c55e');
    });

    it('28日経過 → 黄', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(28), frequency: 'monthly' }))).toBe('#f59e0b');
    });

    it('35日経過 → 濃い赤', () => {
      expect(getChoreColor(makeChore({ lastDoneDate: daysAgo(35), frequency: 'monthly' }))).toBe('#b91c1c');
    });
  });
});
