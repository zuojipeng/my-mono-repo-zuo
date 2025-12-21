/**
 * TypeChain 类型适配文件
 *
 * 由于 TypeChain 生成的 ethers v6 类型与 wagmi 的 viem 类型系统不直接兼容，
 * 我们只使用 TypeChain 生成的 Struct 类型定义，而不是完整的合约接口。
 *
 * 这样可以获得类型安全，同时避免类型推断过深的问题。
 */

// Re-export only the struct types we need
export type { CourseManager } from './src/typechain-types';
export type { YDToken } from './src/typechain-types';
export type { CoursePurchase } from './src/typechain-types';
