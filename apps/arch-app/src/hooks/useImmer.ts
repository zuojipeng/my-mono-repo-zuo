/**
 * 1.方便替换基本的useState，避免无必要的渲染
 *  简化深层嵌套对象的不可变更新
 */
import { type Draft, freeze, produce } from "immer";
import { useCallback, useState } from "react";

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];

export function useImmer<S = unknown>(
	initialValue: S | (() => S),
): [S, (updater: S | DraftFunction<S>) => void];

export function useImmer<S>(initialValue: S) {
	const [value, updateVal] = useState(
		// 不可变对象 对我们的原始状态进行冻结

		freeze(
			typeof initialValue === "function" ? initialValue() : initialValue,
			true,
		),
	);

	return [
		value,
		useCallback((updater: S | DraftFunction<S>) => {
			if (typeof updater === "function") {
				updateVal(produce(updater as DraftFunction<S>));
			} else {
				updateVal(updater);
			}
		}, []),
	];
}
