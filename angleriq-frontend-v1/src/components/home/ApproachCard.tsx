type ApproachCardProps = {
  isLoading: boolean;
  error: string | null;
  pattern: any | null; // TODO: type this properly later
  onGenerate: () => void;
};

export function ApproachCard({
  isLoading,
  error,
  pattern,
  onGenerate,
}: ApproachCardProps) {
  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Approach</h2>
        <button onClick={onGenerate} disabled={isLoading}>
          {isLoading
            ? "Generating..."
            : pattern
            ? "Regenerate approach"
            : "Generate approach"}
        </button>
      </header>

      {error && <p>{error}</p>}

      {pattern ? (
        <div>
          {/* TODO: wire to real response fields */}
          <p>{pattern.summary ?? "Pattern generated."}</p>
        </div>
      ) : (
        <p>No approach yet. Tap Generate to get started.</p>
      )}
    </section>
  );
}
