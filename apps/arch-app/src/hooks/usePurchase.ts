import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import type { Address } from 'viem';
import {
  YD_TOKEN_ADDRESS,
  COURSE_PLATFORM_ADDRESS,
  YD_TOKEN_ABI,
  COURSE_PLATFORM_ABI
} from '../../costruct.config';
import type { YDToken, CourseManager } from '../typechain-types';

// 购买步骤枚举
export const PurchaseSteps = {
  IDLE: 'idle',
  CHECKING: 'checking',
  APPROVING: 'approving',
  APPROVING_WAIT: 'approving_wait',
  BUYING: 'buying',
  BUYING_WAIT: 'buying_wait',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type PurchaseStep = typeof PurchaseSteps[keyof typeof PurchaseSteps];

// Hook 返回类型 - 使用 TypeChain 生成的类型提供更好的类型安全
export interface UsePurchaseReturn {
  status: PurchaseStep;
  error: string | null;
  purchase: () => Promise<void>;
  hasPurchased: boolean | undefined;
  reset: () => void;
}

export function usePurchase(courseId: string | number | undefined, price: bigint | undefined): UsePurchaseReturn {
  const [status, setStatus] = useState<PurchaseStep>(PurchaseSteps.IDLE);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const publicClient = usePublicClient();

  // 合约写入 Hooks
  const {
    writeContractAsync: writeApprove,
    data: approveHash
  } = useWriteContract();

  const {
    writeContractAsync: writePurchase,
    data: purchaseHash
  } = useWriteContract();

  // 交易等待
  const { isSuccess: isApproveSuccess, isLoading: isApproveLoading } = useWaitForTransactionReceipt({
    hash: approveHash
  });

  const { isSuccess: isPurchaseSuccess, isLoading: isPurchaseLoading } = useWaitForTransactionReceipt({
    hash: purchaseHash
  });

  // 监听交易状态变化
  useEffect(() => {
    if (isApproveLoading) setStatus(PurchaseSteps.APPROVING_WAIT);
    if (isApproveSuccess && status === PurchaseSteps.APPROVING_WAIT) {
      // 授权成功，自动继续购买
      proceedToPurchase();
    }
  }, [isApproveLoading, isApproveSuccess]);

  useEffect(() => {
    if (isPurchaseLoading) setStatus(PurchaseSteps.BUYING_WAIT);
    if (isPurchaseSuccess) setStatus(PurchaseSteps.SUCCESS);
  }, [isPurchaseLoading, isPurchaseSuccess]);

  // 检查是否已购买
  const { data: hasPurchasedData, refetch: checkPurchased } = useReadContract({
    address: COURSE_PLATFORM_ADDRESS,
    abi: COURSE_PLATFORM_ABI,
    functionName: 'hasPurchased',
    args: address && courseId ? [address, BigInt(courseId)] : undefined,
    query: {
      enabled: !!address && courseId != null,
    }
  });

  // 核心购买逻辑
  const purchase = async (): Promise<void> => {
    if (!address || courseId == null || !price) return;

    setStatus(PurchaseSteps.CHECKING);
    setError(null);

    try {
      // 1. 检查是否已购买
      // 注意：这里我们尽量使用最新的数据，但在 React 中直接调用 refetch 可能需要等待
      // 为了简单起见，我们也可以直接读取 publicClient
      const hasPurchased = await publicClient?.readContract({
        address: COURSE_PLATFORM_ADDRESS,
        abi: COURSE_PLATFORM_ABI,
        functionName: 'hasPurchased',
        args: [address, BigInt(courseId)],
      });

      if (hasPurchased) {
        setStatus(PurchaseSteps.SUCCESS); // 视为成功或者可以用特殊状态
        return;
      }

      // 2. 检查授权额度
      const allowance = await publicClient?.readContract({
        address: YD_TOKEN_ADDRESS,
        abi: YD_TOKEN_ABI,
        functionName: 'allowance',
        args: [address, COURSE_PLATFORM_ADDRESS],
      });

      if ((allowance as bigint) < price) {
        // 需要授权
        setStatus(PurchaseSteps.APPROVING);
        await writeApprove({
          address: YD_TOKEN_ADDRESS,
          abi: YD_TOKEN_ABI,
          functionName: 'approve',
          args: [COURSE_PLATFORM_ADDRESS, price],
        });
        // 之后会通过 useEffect 监听 isApproveSuccess 来触发 proceedToPurchase
      } else {
        // 额度足够，直接购买
        await proceedToPurchase();
      }

    } catch (err) {
      console.error("Purchase flow error:", err);
      const errorMessage = err instanceof Error ? err.message : "交易失败";
      setError(errorMessage);
      setStatus(PurchaseSteps.ERROR);
    }
  };

  const proceedToPurchase = async (): Promise<void> => {
    if (courseId == null) return;

    setStatus(PurchaseSteps.BUYING);
    try {
      await writePurchase({
        address: COURSE_PLATFORM_ADDRESS,
        abi: COURSE_PLATFORM_ABI,
        functionName: 'purchaseCourse',
        args: [BigInt(courseId)],
      });
    } catch (err) {
      console.error("Purchase call error:", err);
      const errorMessage = err instanceof Error ? err.message : "购买失败";
      setError(errorMessage);
      setStatus(PurchaseSteps.ERROR);
    }
  };

  return {
    status,
    error,
    purchase,
    hasPurchased: hasPurchasedData as boolean | undefined,
    reset: () => {
      setStatus(PurchaseSteps.IDLE);
      setError(null);
    }
  };
}
