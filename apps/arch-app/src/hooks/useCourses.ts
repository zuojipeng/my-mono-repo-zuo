import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import type { Address } from 'viem';
import { COURSE_PLATFORM_ADDRESS, COURSE_PLATFORM_ABI } from '../../costruct.config';
import type { CourseManager } from '../typechain-types';
import type { Course } from '../types/course';

// Re-export Course type for backward compatibility
export type { Course };

// Hook 返回类型
export interface UseCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// 使用 TypeChain 生成的类型作为合约返回数据类型
// CourseStructOutput 包含完整的类型信息和字段名称
type CourseStructOutput = CourseManager.CourseStructOutput;

export function useCourses(): UseCoursesReturn {
  // 1. 获取所有 ID
  const { data: courseIds, isLoading: isLoadingIds, isError: isErrorIds, refetch: refetchIds } = useReadContract({
    address: COURSE_PLATFORM_ADDRESS,
    abi: COURSE_PLATFORM_ABI,
    functionName: 'getAllCourseIds',
  });

  // 2. 准备 getCourse 调用配置
  const courseIdsArray = (courseIds as readonly bigint[] | undefined) || [];
  const contracts = courseIdsArray.map((id) => ({
    address: COURSE_PLATFORM_ADDRESS as Address,
    abi: COURSE_PLATFORM_ABI,
    functionName: 'getCourse' as const,
    args: [id] as const,
  }));

  // 3. 批量获取课程详情
  const { data: coursesData, isLoading: isLoadingDetails, isError: isErrorDetails, refetch: refetchDetails } = useReadContracts({
    contracts,
    query: {
      enabled: courseIdsArray.length > 0,
    }
  });

  // 4. 格式化数据
  const courses: Course[] = coursesData?.map((result, index) => {
    if (result.status === 'success') {
      // 使用 TypeChain 生成的类型，获得完整的类型安全
      const course = result.result as CourseStructOutput | undefined;
      if (!course) return null;

      // TypeChain 类型包含了字段名称，可以直接访问，无需使用索引
      // CourseStructOutput 同时支持字段名和数组索引访问
      const idValue = course.courseId;
      const nameValue = course.name;
      const descriptionValue = course.description;
      const priceValue = course.price;
      const authorValue = course.instructor;
      const studentCountValue = course.totalStudents;
      const contentHashValue = course.contentHash ?? '';
      const thumbnailHashValue = course.thumbnailHash ?? '';

      // 确保 id 是有效的
      // 优先使用 courseIds 数组中的对应值（这是最可靠的，因为索引是对应的）
      // 如果 courseIds 中没有，再尝试从 course 对象中获取
      let finalId = '';

      // 优先使用 courseIdsArray[index]，因为这是最可靠的来源
      if (courseIdsArray[index] !== undefined && courseIdsArray[index] !== null) {
        const idFromArray = courseIdsArray[index];
        finalId = idFromArray.toString();
        // console.log(`✅ 课程 ${index}: 使用 courseIds[${index}] = ${finalId}`);
      } else if (idValue !== undefined && idValue !== null) {
        // 如果 courseIds 中没有，尝试从 course 对象中获取（即使可能是 0）
        finalId = typeof idValue === 'bigint' ? idValue.toString() : String(idValue);
        // console.log(`⚠️ 课程 ${index}: courseIds 中没有，使用 course.courseId = ${finalId}`);
      } else {
        // 如果都没有，记录警告但不跳过（让用户能看到课程，即使 ID 可能有问题）
        console.warn('⚠️ 无法获取课程 ID，使用索引作为备用:', { idValue, courseIdsIndex: courseIdsArray?.[index], course, index });
        finalId = String(index + 1);
      }

      const priceAsBigInt = typeof priceValue === 'bigint' ? priceValue : BigInt(0);

      return {
        id: finalId,
        name: String(nameValue ?? ''),
        description: String(descriptionValue ?? ''),
        price: priceAsBigInt,
        priceDisplay: priceAsBigInt ? formatUnits(priceAsBigInt, 18) : '0',
        author: String(authorValue ?? ''),
        studentCount: typeof studentCountValue === 'bigint' ? studentCountValue.toString() : String(studentCountValue ?? '0'),
        contentHash: String(contentHashValue ?? ''),
        thumbnailHash: String(thumbnailHashValue ?? ''),
      };
    }
    return null;
  }).filter((course): course is Course => course !== null) || [];

  // 刷新函数：同时刷新课程 ID 列表和详情
  const refetch = () => {
    refetchIds();
    refetchDetails();
  };

  return {
    courses,
    isLoading: isLoadingIds || isLoadingDetails,
    isError: isErrorIds || isErrorDetails,
    refetch,
  };
}
