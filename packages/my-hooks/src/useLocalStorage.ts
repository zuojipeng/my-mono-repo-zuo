import { useState, useEffect, useCallback } from 'react';

/**
 * 设置值类型 - 可以是新值或基于前值的更新函数
 * @template T 值类型
 */
type SetValue<T> = T | ((prevValue: T) => T);

/**
 * 同步状态到 localStorage 的 Hook
 * 
 * 自动将 React 状态持久化到 localStorage，支持跨标签页同步。
 * 适用于保存用户偏好、表单草稿、主题设置等需要持久化的数据。
 * 
 * @template T 存储值的类型
 * @param key localStorage 的键名
 * @param initialValue 初始值，当 localStorage 中不存在时使用
 * @returns 包含当前值和设置函数的元组 `[storedValue, setValue]`
 * 
 * @example
 * 基本用法
 * ```typescript
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * 
 * // 直接设置
 * setTheme('dark');
 * 
 * // 函数式更新
 * setTheme(prev => prev === 'light' ? 'dark' : 'light');
 * ```
 * 
 * @example
 * 存储复杂对象
 * ```typescript
 * interface UserPrefs {
 *   language: string;
 *   notifications: boolean;
 * }
 * 
 * const [prefs, setPrefs] = useLocalStorage<UserPrefs>('user-prefs', {
 *   language: 'zh-CN',
 *   notifications: true
 * });
 * 
 * setPrefs(prev => ({ ...prev, language: 'en-US' }));
 * ```
 * 
 * @example
 * SSR 兼容
 * ```typescript
 * // 在服务端渲染时会使用 initialValue，不会报错
 * const [count, setCount] = useLocalStorage('count', 0);
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  // 初始化状态：尝试从 localStorage 读取，失败则使用初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 更新状态和 localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // 支持函数式更新
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);

        // 保存到 localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 监听其他标签页的 storage 变化
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

