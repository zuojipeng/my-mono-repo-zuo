import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@zuojipeng/my-ui";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Brand: Story = {
  args: {
    variant: "brand",
    variantStyle: "soft",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    variantStyle: "soft",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    variantStyle: "soft",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    variantStyle: "soft",
  },
};

export const Solid: Story = {
  args: {
    variant: "brand",
    variantStyle: "solid",
  },
};

export const Outline: Story = {
  args: {
    variant: "brand",
    variantStyle: "outline",
  },
};

