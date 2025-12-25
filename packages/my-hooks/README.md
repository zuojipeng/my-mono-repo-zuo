# @zuojipeng/my-hooks

React Hooks 工具库，提供常用的自定义 Hooks。

## 安装

```bash
pnpm install @zuojipeng/my-hooks
```

## Hooks 列表

### 1. useImmer

使用 Immer 简化复杂状态更新。

```typescript
import { useImmer } from '@zuojipeng/my-hooks';

const [state, setState] = useImmer({ count: 0, user: { name: 'John' } });

// 直接修改嵌套属性
setState(draft => {
  draft.user.name = 'Jane';
  draft.count++;
});
```

### 2. useDebounce

防抖处理，延迟更新值。

```typescript
import { useDebounce } from '@zuojipeng/my-hooks';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  // 只在用户停止输入 300ms 后触发
  if (debouncedSearchTerm) {
    fetchSearchResults(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

### 3. useLocalStorage

同步 React 状态与 localStorage。

```typescript
import { useLocalStorage } from '@zuojipeng/my-hooks';

const [theme, setTheme] = useLocalStorage('theme', 'light');

// 直接设置
setTheme('dark');

// 函数式更新
setTheme(prev => prev === 'light' ? 'dark' : 'light');
```

**特性：**
- ✅ 自动持久化到 localStorage
- ✅ SSR 兼容
- ✅ 跨标签页同步
- ✅ 完整 TypeScript 类型支持

## License

ISC



