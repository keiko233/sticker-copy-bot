import { Card, CardContent } from "@libnyanpasu/material-design-react";
import { getSticker } from "@/actions/query/sticker";
import NoSSRWrapper from "@/components/no-ssr-warpper";
import { formatError } from "@/utils/fmt";
import AutoImage from "./_modules/auto-image";

export const dynamic = "force-dynamic";

export default async function StickerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [query, error] = await getSticker(id);

  if (!query) {
    return <div>Error: {formatError(error)}</div>;
  }

  return (
    <div className="grid h-dvh place-content-center">
      <Card className="w-96">
        <CardContent>
          <NoSSRWrapper>
            <AutoImage data={query} />
          </NoSSRWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
