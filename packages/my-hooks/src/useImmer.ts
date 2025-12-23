import { type Draft, freeze, produce } from 'immer';
import { useCallback, useState } from 'react';

/**
 * Draft 函数类型 - 接收 Immer draft 对象进行修改
 * @template S 状态类型
 */
export type DraftFunction<S> = (draft: Draft<S>) => void;

/**
 * 更新器类型 - 可以是新状态或 draft 函数
 * @template S 状态类型
 */
export type Updater<S> = (arg: S | DraftFunction<S>) => void;

/**
 * Immer Hook 返回类型
 * @template S 状态类型
 */
export type ImmerHook<S> = [S, Updater<S>];

/**
 * 使用 Immer 简化复杂状态更新的 Hook
 * 
 * 基于 Immer 库，允许使用可变方式更新不可变状态，特别适合处理深层嵌套对象。
 * 
 * @template S 状态类型
 * @param initialValue 初始状态，可以是值或返回值的函数
 * @returns 包含当前状态和更新函数的元组
 * 
 * @example
 * 基本用法
 * ```typescript
 * const [state, setState] = useImmer({ count: 0, user: { name: 'John' } });
 * 
 * // 使用 draft 函数直接修改嵌套属性
 * setState(draft => {
 *   draft.user.name = 'Jane';
 *   draft.count++;
 * });
 * ```
 * 
 * @example
 * 数组操作
 * ```typescript
 * const [todos, setTodos] = useImmer([
 *   { id: 1, text: 'Learn React', done: false }
 * ]);
 * 
 * // 直接使用数组方法
 * setTodos(draft => {
 *   const todo = draft.find(t => t.id === 1);
 *   if (todo) todo.done = true;
 *   draft.push({ id: 2, text: 'Learn Immer', done: false });
 * });
 * ```
 */
export function useImmer<S = unknown>(
  initialValue: S | (() => S),
): [S, (updater: S | DraftFunction<S>) => void];

export function useImmer<S>(initialValue: S) {
  const [value, updateVal] = useState(
    freeze(typeof initialValue === 'function' ? initialValue() : initialValue, true),
  );

  return [
    value,
    useCallback((updater: S | DraftFunction<S>) => {
      if (typeof updater === 'function') {
        updateVal(produce(updater as DraftFunction<S>));
      } else {
        updateVal(updater);
      }
    }, []),
  ];
}

