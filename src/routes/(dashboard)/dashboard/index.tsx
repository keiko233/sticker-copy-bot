import { Button } from "@/components/ui/button";
import { getWebhookInitialValue } from "@/query/kv";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useWindow } from "@/hooks/use-window";
import { setTelegramWebhook } from "@/query/telegram";
import { setWebhookInitialValue } from "@/query/kv";

const isDev = import.meta.env.DEV;

export const Route = createFileRoute("/(dashboard)/dashboard/")({
  component: RouteComponent,
  loader: async () => {
    return {
      initialUrl: await getWebhookInitialValue(),
    };
  },
});

const ClearButton = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      await setWebhookInitialValue({
        data: "",
      });

      await router.invalidate();
    });
  };

  return (
    <Button className="flex items-center gap-2" onClick={handleClick}>
      {isPending && <Loader2 className="size-4 animate-spin" />}
      <span>Clear</span>
    </Button>
  );
};

function RouteComponent() {
  const { initialUrl } = Route.useLoaderData();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const window = useWindow();

  const handleClick = () => {
    startTransition(async () => {
      if (!window) {
        return;
      }

      await setTelegramWebhook({
        data: window.location.origin,
      });

      await router.invalidate();
    });
  };

  return (
    <div className="grid h-dvh place-content-center gap-2">
      <p>{initialUrl ? "Initialized" : "Not initialized"}</p>

      {!initialUrl && (
        <Button className="flex items-center gap-2" onClick={handleClick}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          <span>Initialize</span>
        </Button>
      )}

      {isDev && (
        <>
          <p>Initial URL: {initialUrl}</p>
          <p>Current URL: {window?.location.origin}</p>
          <ClearButton />
        </>
      )}
    </div>
  );
}
