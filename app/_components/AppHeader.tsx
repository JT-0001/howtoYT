"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

function AppHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 shadow-sm flex items-center justify-between w-full">
      <SidebarTrigger />

      {mounted && <UserButton afterSignOutUrl="/" />}
    </div>
  );
}

export default AppHeader;