import { File, UserFromGetMe } from "grammy/types";
import { fetchWithRetry } from "@/utils/retry";
import { getBotToken } from "./env";

export const downloadFile = async (file: File) => {
  const token = await getBotToken();

  const res = await fetchWithRetry(
    `https://api.telegram.org/file/bot${token}/${file.file_path}`,
  );

  return Buffer.from(await res.arrayBuffer());
};

export const getMe = async (token: string) => {
  const response = await fetchWithRetry(
    `https://api.telegram.org/bot${token}/getMe`,
  );

  const data: {
    ok: boolean;
    result: UserFromGetMe;
  } = await response.json();

  return data.result;
};
