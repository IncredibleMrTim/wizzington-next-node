"use client";

import {
  Drawer as ShDrawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useNavStore } from "@/stores";
import { FiMenu } from "react-icons/fi";
import { DrawerTemplate } from "./DrawerTemplate";
import { CategoryWithChildren } from "@/app/actions/categories.action";
import { USER_ROLE } from "@/lib/types";

interface DrawerProps {
  categories: CategoryWithChildren[];
  type?: USER_ROLE;
}

export const Drawer = ({ categories, type }: DrawerProps) => {
  const isOpen = useNavStore((state) => state.isDrawerOpen);
  const setIsDrawerOpen = useNavStore((state) => state.setIsDrawerOpen);

  return (
    <div>
      <ShDrawer
        aria-label="Open navigation"
        aria-controls="NavigationMenu"
        direction="right"
        open={isOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
        }}
      >
        <DrawerTrigger
          className="flex justify-self-end p-2 rounded-full border border-[color:rgba(201,132,154,0.35)]"
          style={{ color: "var(--color-brand-gold)" }}
        >
          <FiMenu size={22} />
        </DrawerTrigger>
        <DrawerHeader className="hidden">
          <DrawerTitle className="hidden">Navigation</DrawerTitle>
        </DrawerHeader>
        <DrawerContent className="border-none bg-brand-plum!">
          <DrawerTemplate categories={categories} type={type} />
        </DrawerContent>
      </ShDrawer>
    </div>
  );
};
