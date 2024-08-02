"user client";

import { useSettings } from "@/hooks/useSettings";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ModalToggle";

export const SettingModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogTitle className="border-b pb-3">My settings</DialogTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1">
              <Label>Appearance</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Customize how Notebook looks on your device
              </span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
