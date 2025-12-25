import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@zuojipeng/my-ui";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: {
    label: "用户名",
    placeholder: "请输入...",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: "支持中英文与数字",
  },
};

export const WithError: Story = {
  args: {
    error: "请输入有效的用户名",
  },
};



