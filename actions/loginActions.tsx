"use server";

import { revalidatePath } from "next/cache";

export const revalidateAfterLogin = async () => {
  revalidatePath("/admin");
};
