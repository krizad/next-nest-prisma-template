import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, truncate, getInitials } from '../format';

describe('formatDate', () => {
  it('formats a Date object', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date);
    expect(formatted).toContain('January');
    expect(formatted).toContain('2024');
  });

  it('formats a date string', () => {
    const formatted = formatDate('2024-06-01');
    expect(formatted).toContain('June');
    expect(formatted).toContain('2024');
  });
});

describe('formatCurrency', () => {
  it('formats amount as USD by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats amount with specified currency', () => {
    const result = formatCurrency(1000, 'EUR');
    expect(result).toContain('1,000');
  });

  it('handles zero amount', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negative amounts', () => {
    const result = formatCurrency(-50);
    expect(result).toContain('50.00');
  });
});

describe('truncate', () => {
  it('returns original text if shorter than length', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns original text if equal to length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and adds ellipsis if longer than length', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns single initial from single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('limits to 2 characters for long names', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('uppercases initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});
