type ConditionsSheetProps = {
  temperature: string;
  onClose: () => void;
};

export function ConditionsSheet({ temperature, onClose }: ConditionsSheetProps) {
  return (
    <div className="aiq-bottom-sheet">
      <div className="aiq-bottom-sheet__handle" />

      <div className="aiq-bottom-sheet__header">
        <div>
          <div className="aiq-bottom-sheet__title">Conditions</div>
          <div className="aiq-bottom-sheet__subtitle">
            Weather only · reinforces today’s pattern logic
          </div>
        </div>
        <button className="aiq-bottom-sheet__close aiq-clickable" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="aiq-bottom-sheet__body">
        <div><strong>Temp:</strong> {temperature}</div>
        <div style={{ opacity: 0.75, marginTop: 8 }}>
          This is weather-only. Water clarity remains Vision/Surface-layer driven.
        </div>
      </div>
    </div>
  );
}