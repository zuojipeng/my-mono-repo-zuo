/**
 * TypeChain 类型验证示例
 *
 * 这个文件展示了 TypeChain 生成的类型如何提供完整的类型安全
 */

import type { CourseManager, YDToken } from './typechain-types';

// ✅ 类型安全的合约返回值处理
function processCourseData(courseData: CourseManager.CourseStructOutput) {
  // TypeScript 知道所有字段类型
  const id: bigint = courseData.courseId;
  const name: string = courseData.name;
  const description: string = courseData.description;
  const price: bigint = courseData.price;
  const instructor: string = courseData.instructor;
  const isActive: boolean = courseData.isActive;
  const createdAt: bigint = courseData.createdAt;
  const totalStudents: bigint = courseData.totalStudents;
  const contentHash: string = courseData.contentHash;
  const thumbnailHash: string = courseData.thumbnailHash;

  // ✅ TypeScript 会检查类型错误
  // const wrongType: number = courseData.price; // ❌ 错误：bigint 不能赋值给 number

  return {
    id: id.toString(),
    name,
    description,
    priceInEther: Number(price) / 1e18,
    instructor,
    isActive,
    studentCount: Number(totalStudents),
  };
}

// ✅ 编辑器提供自动补全
function displayCourse(course: CourseManager.CourseStructOutput) {
  console.log(`Course: ${course.name}`);
  console.log(`Price: ${course.price.toString()}`);
  console.log(`Instructor: ${course.instructor}`);
  console.log(`Students: ${course.totalStudents.toString()}`);
  // 当你输入 course. 时，编辑器会自动列出所有可用字段
}

// 导出供其他文件参考
export { processCourseData, displayCourse };
export type { CourseManager, YDToken };
