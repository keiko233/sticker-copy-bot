import { createFileRoute } from "@tanstack/react-router";
import { getSticker } from "@/query/sticker";
import { Card, CardContent } from "@/components/ui/card";
import { getStickerFile } from "@/query/r2";
import { AutoImage } from "./_modules/auto-image";

export const Route = createFileRoute("/(static)/$id/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const sticker = await getSticker({ data: params.id });

    const fileUrl = await getStickerFile({ data: params.id });

    return {
      sticker,
      fileUrl,
    };
  },
});

function RouteComponent() {
  const { sticker, fileUrl } = Route.useLoaderData();

  if (!sticker) {
    return <div>Not found</div>;
  }

  return (
    <div className="grid place-items-center h-dvh gap-4">
      <Card>
        <CardContent>
          {fileUrl && <AutoImage src={fileUrl} alt={sticker.name} />}
        </CardContent>
      </Card>
    </div>
  );
}
