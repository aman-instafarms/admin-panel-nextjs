import { DateTime } from "luxon";
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

export function formatDateToNormal(date: string): Date {
  return DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ssZZ", {
    zone: "Asia/Kolkata",
  }).toJSDate();
}

export function formatDateForDatabase(date: Date): string {
  return DateTime.fromJSDate(date, { zone: "Asia/Kolkata" }).toFormat(
    "yyyy-MM-dd HH:mm:ssZZ",
  );
}

// Formatting Date : 2025-09-25 00:00:00+05:30   --->
export function formatDateForTable(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
