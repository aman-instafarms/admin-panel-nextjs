import { ServerActionResult } from "./types";

export async function parseServerActionResult(
  result: Promise<ServerActionResult>,
) {
  const data = await result;
  if (data.success) {
    return data.success;
  } else {
    throw new Error(data.error || "Something went wrong.");
  }
}
