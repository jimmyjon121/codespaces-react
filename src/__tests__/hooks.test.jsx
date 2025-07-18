import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useNotification } from '../hooks/useNotification';
import { useLocalStorage, useDebounce } from '../hooks/useUtilities';

describe('Utility Hooks', () => {
  describe('useNotification', () => {
    it('should show and dismiss notifications', () => {
      const { result } = renderHook(() => useNotification());

      expect(result.current.notification).toBeNull();

      act(() => {
        result.current.showNotification({
          type: 'success',
          title: 'Test',
          message: 'Test message'
        });
      });

      expect(result.current.notification).toBeTruthy();
      expect(result.current.notification.title).toBe('Test');

      act(() => {
        result.current.dismissNotification();
      });

      expect(result.current.notification).toBeNull();
    });
  });

  describe('useLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should store and retrieve values', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current[0]).toBe('initial');

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(localStorage.getItem('test-key')).toBe('"updated"');
    });
  });

  describe('useDebounce', () => {
    it('should debounce value changes', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated', delay: 100 });
      expect(result.current).toBe('initial'); // Should still be initial due to debounce

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(result.current).toBe('updated'); // Should be updated after delay
    });
  });
});
