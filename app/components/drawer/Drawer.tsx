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

export const Drawer = () => {
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
        <DrawerTrigger className="flex justify-self-end p-4">
          <FiMenu size={24} className="" />
        </DrawerTrigger>
        <DrawerHeader className="hidden">
          <DrawerTitle className="hidden">Navigation</DrawerTitle>
        </DrawerHeader>
        <DrawerContent className="border-none">
          <DrawerTemplate />
        </DrawerContent>
      </ShDrawer>
    </div>
  );
};
