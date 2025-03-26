"use client";

import { Button, Input } from "@libnyanpasu/material-design-react";
import { useLockFn } from "ahooks";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { setupWebhook } from "@/actions/telegram/webhook";
import { useWindow } from "@/hooks/use-window";

export const SetupButton = () => {
  const { isPending, execute } = useServerAction(setupWebhook);

  const window = useWindow();

  const [value, setValue] = useState(window?.location.origin);

  const handleClick = useLockFn(async () => {
    if (!value) {
      return;
    }

    await execute(value);
  });

  return (
    <>
      <Input
        label="Bot WebHook"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button variant="flat" loading={isPending} onClick={handleClick}>
        Setup Webhook
      </Button>
    </>
  );
};
