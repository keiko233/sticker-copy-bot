import {
  Card,
  CardContent,
  CardHeader,
} from "@libnyanpasu/material-design-react";
import { getWebhookInitialValue } from "@/actions/kv";
import { SetupButton } from "./_modules/setup-button";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const value = await getWebhookInitialValue();

  return (
    <div className="grid h-dvh place-content-center">
      <Card className="w-96">
        <CardHeader>
          <h2>Setup</h2>
        </CardHeader>

        <CardContent>
          {value ? <code>Webhook: {value}</code> : <SetupButton />}
        </CardContent>
      </Card>
    </div>
  );
}
