import type { CalendarDay, Holiday, SelectionMode } from "./types";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";

type CalendarBodyProps = {
  days: CalendarDay[];
  today: Date;
  rangeStart: string | null;
  rangeEnd: string | null;
  previewEnd: string | null;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  todayRing: string;
  holidays: Holiday[];
  monthKey: string;
  monthNote: string;
  rangeNote: string;
  selectedRangeLabel: string | null;
  importantDate: string | null;
  importantDateLabel: string | null;
  selectionMode: SelectionMode;
  onSelectDay: (iso: string) => void;
  onHoverDay: (iso: string) => void;
  onSelectionModeChange: (mode: SelectionMode) => void;
  onClearImportantDate: () => void;
  onMonthNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
  onResetNotes: () => void;
};

export function CalendarBody(props: CalendarBodyProps) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] bg-white md:grid-cols-[182px_minmax(0,1fr)] print:block">
      <div>
        <NotesPanel
          monthNote={props.monthNote}
          rangeNote={props.rangeNote}
          selectedRangeLabel={props.selectedRangeLabel}
          importantDateLabel={props.importantDateLabel}
          selectionMode={props.selectionMode}
          accent={props.accent}
          onSelectionModeChange={props.onSelectionModeChange}
          onClearImportantDate={props.onClearImportantDate}
          onMonthNoteChange={props.onMonthNoteChange}
          onRangeNoteChange={props.onRangeNoteChange}
          onResetNotes={props.onResetNotes}
        />
      </div>
      <div>
        <CalendarGrid
          days={props.days}
          today={props.today}
          rangeStart={props.rangeStart}
          rangeEnd={props.rangeEnd}
          previewEnd={props.previewEnd}
          accent={props.accent}
          accentStrong={props.accentStrong}
          accentSoft={props.accentSoft}
          todayRing={props.todayRing}
          importantDate={props.importantDate}
          holidays={props.holidays}
          onSelectDay={props.onSelectDay}
          onHoverDay={props.onHoverDay}
        />
      </div>
    </div>
  );
}
