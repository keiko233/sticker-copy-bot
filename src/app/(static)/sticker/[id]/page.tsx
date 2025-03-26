import {
  Card,
  CardContent,
} from "@libnyanpasu/material-design-react";
import Image from "next/image";
import { getSticker } from "@/actions/query/sticker";
import { formatError } from "@/utils/fmt";

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
          <Image height={512} width={512} src={query?.binary} alt="sticker" />
        </CardContent>
      </Card>
    </div>
  );
}
