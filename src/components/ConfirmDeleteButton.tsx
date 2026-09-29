"use client";

import { useState } from "react";

export function ConfirmDeleteButton({
  deleteAction,
  confirmLabel,
}: {
  deleteAction: () => Promise<void>;
  confirmLabel: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-slate-400 hover:text-red-600"
        aria-label="Radera"
      >
        Radera
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-600">{confirmLabel}</span>
      <form action={deleteAction}>
        <button type="submit" className="font-medium text-red-600">
          Ja, radera
        </button>
      </form>
      <button type="button" onClick={() => setConfirming(false)} className="text-slate-500">
        Avbryt
      </button>
    </div>
  );
}
