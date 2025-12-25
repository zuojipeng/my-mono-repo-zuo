import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@zuojipeng/my-ui";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>项目标题</CardTitle>
        <CardDescription>这里是关于项目的简短描述。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-20 w-full rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
          内容区域
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">取消</Button>
        <Button>部署</Button>
      </CardFooter>
    </Card>
  ),
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
  },
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>可悬停卡片</CardTitle>
        <CardDescription>将鼠标悬停在上方查看效果。</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">
          悬停时卡片会略微升起并增加阴影，非常适合展示列表项。
        </p>
      </CardContent>
    </Card>
  ),
};



