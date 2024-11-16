import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { getUserData } from "@/store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

import { ModeToggle } from "./mode-toggle.jsx";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export function Menu() {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (accessToken) {
      dispatch(getUserData(accessToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Music</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About Music</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Hide Music... <MenubarShortcut>⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Hide Others... <MenubarShortcut>⇧⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarShortcut />
          <MenubarItem>
            Quit Music <MenubarShortcut>⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="hidden md:block">Account</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarLabel inset>Spotify Account</MenubarLabel>
          <MenubarSeparator />
          <MenubarItem inset>{user.name}</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>{user.email}</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Logout from Spotify</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <ModeToggle />
    </Menubar>
  );
}
