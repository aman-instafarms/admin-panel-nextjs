import "dotenv/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  await db.execute(sql`select 1+1`);
}

main().then(() => {
  console.log("Database Connected...");
});
