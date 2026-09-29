import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/server/db";
import { months } from "@/server/db/schema";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const archivedMonths = await db
    .select()
    .from(months)
    .where(eq(months.status, "archived"))
    .orderBy(desc(months.createdAt));

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Arkiv</h1>
        <Link href="/" className="text-sm text-slate-500 underline">
          Till aktiv månad
        </Link>
      </div>

      {archivedMonths.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">Inga arkiverade månader ännu.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {archivedMonths.map((month) => (
            <li key={month.id}>
              <Link
                href={`/month/${month.id}`}
                className="block rounded-lg bg-white p-3 shadow-sm"
              >
                <span className="font-medium text-slate-800">{month.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
