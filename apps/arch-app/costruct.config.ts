// 从 frontend-config.json 导入合约配置
import type { Abi, Address } from 'viem';

// 合约配置类型定义
interface ContractInfo {
  address: string;
  abi: Abi;
}

interface ContractConfig {
  contracts?: {
    YDToken?: ContractInfo;
    CourseManager?: ContractInfo;
    CoursePurchase?: ContractInfo;
    YDFaucet?: ContractInfo;
    YDStakingSafe?: ContractInfo;
    UserProfile?: ContractInfo;
    InstructorYieldManager?: ContractInfo;
  };
}

// 动态导入配置文件（运行时加载，避免 TypeScript 编译时错误）
let contractConfig: ContractConfig;
try {
  contractConfig = require('./src/abis/frontend-config.json') as ContractConfig;
} catch (error) {
  console.error('❌ 无法加载合约配置文件:', error);
  contractConfig = { contracts: {} };
}

// 兼容防护：避免 contracts 未定义时报错
const contracts = contractConfig?.contracts || {};

// 合约地址（如果读取失败会是空字符串，方便后续排查）
export const YD_TOKEN_ADDRESS = (contracts.YDToken?.address || '') as Address;
export const COURSE_MANAGER_ADDRESS = (contracts.CourseManager?.address || '') as Address;
// CoursePlatform 使用 CourseManager（前端沿用旧命名）
export const COURSE_PLATFORM_ADDRESS = (contracts.CourseManager?.address || '') as Address;
export const COURSE_PURCHASE_ADDRESS = (contracts.CoursePurchase?.address || '') as Address;
export const YD_FAUCET_ADDRESS = (contracts.YDFaucet?.address || '') as Address;
export const YD_STAKING_ADDRESS = (contracts.YDStakingSafe?.address || '') as Address;
export const USER_PROFILE_ADDRESS = (contracts.UserProfile?.address || '') as Address;
export const INSTRUCTOR_YIELD_ADDRESS = (contracts.InstructorYieldManager?.address || '') as Address;

// 合约 ABI
export const YD_TOKEN_ABI = (contracts.YDToken?.abi || []) as Abi;
export const COURSE_MANAGER_ABI = (contracts.CourseManager?.abi || []) as Abi;
// CoursePlatform ABI 使用 CourseManager ABI
export const COURSE_PLATFORM_ABI = (contracts.CourseManager?.abi || []) as Abi;
export const COURSE_PURCHASE_ABI = (contracts.CoursePurchase?.abi || []) as Abi;
export const YD_FAUCET_ABI = (contracts.YDFaucet?.abi || []) as Abi;
export const YD_STAKING_ABI = (contracts.YDStakingSafe?.abi || []) as Abi;
export const USER_PROFILE_ABI = (contracts.UserProfile?.abi || []) as Abi;
export const INSTRUCTOR_YIELD_ABI = (contracts.InstructorYieldManager?.abi || []) as Abi;
