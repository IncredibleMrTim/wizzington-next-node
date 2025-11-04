import {
  Drawer as ShDrawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useAppDispatch, useAppSelector, STORE_KEYS } from "@/stores/store";
import { FiMenu } from "react-icons/fi";
import { DrawerTemplate } from "./DrawerTemplate";

export const Drawer = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.nav.isDrawerOpen);

  return (
    <div>
      <ShDrawer
        aria-label="Open navigation"
        aria-controls="NavigationMenu"
        direction="right"
        open={isOpen}
        onOpenChange={(open) => {
          dispatch({
            type: STORE_KEYS.SET_DRAWER_IS_OPEN,
            payload: open,
          });
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
