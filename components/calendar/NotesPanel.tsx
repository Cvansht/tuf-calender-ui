import type { SelectionMode } from "./types";

type NotesPanelProps = {
  monthNote: string;
  rangeNote: string;
  selectedRangeLabel: string | null;
  importantDateLabel: string | null;
  selectionMode: SelectionMode;
  accent: string;
  onSelectionModeChange: (mode: SelectionMode) => void;
  onClearImportantDate: () => void;
  onMonthNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
  onResetNotes: () => void;
};

export function NotesPanel({
  monthNote,
  rangeNote,
  selectedRangeLabel,
  importantDateLabel,
  selectionMode,
  accent,
  onSelectionModeChange,
  onClearImportantDate,
  onMonthNoteChange,
  onRangeNoteChange,
  onResetNotes: _onResetNotes
}: NotesPanelProps) {
  const useRangeNote = Boolean(selectedRangeLabel);
  const value = useRangeNote ? rangeNote : monthNote;
  const pencilCursor = "url('/pencil-cursor.svg') 4 20, text";

  const handleChange = (nextValue: string) => {
    if (useRangeNote) {
      onRangeNoteChange(nextValue);
      return;
    }

    onMonthNoteChange(nextValue);
  };

  return (
    <div className="border-r border-slate-200/70 px-4 pt-3 pb-3 md:px-6 md:pt-4 md:pb-4">
      <div>
        <div className="mb-2.5 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
          <h4 className="text-[10px] font-semibold leading-none text-slate-700 md:text-[11px]">
            Notes
          </h4>

          <div className="grid w-full max-w-[108px] shrink-0 grid-cols-2 rounded-full border border-slate-200/80 bg-white/90 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => onSelectionModeChange("range")}
              className={`rounded-full px-1.5 py-1 text-[7px] font-semibold uppercase tracking-[0.1em] transition md:px-2 md:text-[8px] ${
                selectionMode === "range"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500"
              }`}
            >
              Range
            </button>
            <button
              type="button"
              onClick={() => onSelectionModeChange("important")}
              className={`rounded-full px-1.5 py-1 text-[7px] font-semibold uppercase tracking-[0.1em] transition md:px-2 md:text-[8px] ${
                selectionMode === "important"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500"
              }`}
            >
              Mark
            </button>
          </div>
        </div>

        <div
          className="mb-1 min-h-3 text-[9px] leading-4 text-slate-400 transition duration-200 md:text-[10px]"
          style={{ color: selectedRangeLabel ? accent : undefined }}
        >
          {selectedRangeLabel ? `Range: ${selectedRangeLabel}` : ""}
        </div>

        {importantDateLabel && (
          <div className="mb-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-amber-200/90 bg-amber-50/90 px-2.5 py-2 shadow-sm">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-amber-700 md:text-[9px]">
                  Important Date
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-amber-900 md:text-[11px]">
                  {importantDateLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={onClearImportantDate}
                className="rounded-full border border-amber-200 bg-white/85 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-amber-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <textarea
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={
            useRangeNote
              ? "Add notes for this selected range..."
              : importantDateLabel
                ? "Add notes for the month or the important date..."
                : "Add monthly notes..."
          }
          spellCheck={false}
          className="h-[154px] w-full resize-none border-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_18px,rgba(51,65,85,0.2)_18px,rgba(51,65,85,0.2)_19px)] px-0 pt-0 text-[10px] leading-[19px] text-slate-700 outline-none placeholder:text-slate-300 md:h-[188px] md:text-[11px]"
          style={{ cursor: pencilCursor }}
        />
      </div>
    </div>
  );
}
