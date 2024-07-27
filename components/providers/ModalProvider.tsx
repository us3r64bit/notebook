"use client";

import { useState, useEffect } from "react";
import { SettingModal } from "@/components/modal/SettingModal";
import { CoverImageModal } from "../modal/CoverImageModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingModal />
      <CoverImageModal />
    </>
  );
};
