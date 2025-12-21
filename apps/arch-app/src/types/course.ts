/**
 * 课程类型定义
 * 统一的 Course 接口，供所有组件和 hooks 使用
 */

import type { Address } from 'viem';

export interface Course {
  /** 课程 ID - 从智能合约返回的课程索引 */
  id: string;
  /** 课程名称 */
  name: string;
  /** 课程描述 */
  description: string;
  /** 课程价格（BigInt 类型） */
  price: bigint;
  /** 格式化后的价格显示（字符串，如 "100 YD"） */
  priceDisplay: string;
  /** 课程作者/讲师的钱包地址 */
  author: Address | string;
  /** 学生数量 */
  studentCount: string;
  /** 课程内容的 IPFS 哈希 */
  contentHash: string;
  /** 课程缩略图的 IPFS 哈希 */
  thumbnailHash: string;
}
