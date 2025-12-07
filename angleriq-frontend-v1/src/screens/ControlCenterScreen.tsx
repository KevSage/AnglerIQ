import ExperienceLevelSelect from "../components/controlCenter/ExperienceLevelSelect";
import ConfidenceSpectrumEditor from "../components/controlCenter/ConfidenceSpectrumEditor";
import DarkModeToggle from "../components/controlCenter/DarkModeToggle";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";

const ControlCenterScreen = () => {
  useOnboardingGuard();

  return (
    <ScreenContainer>
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-slate-100">Control Center</h1>
        <p className="mt-1 text-xs text-slate-400">
          Adjust how SAGE talks to you and how your Confidence Spectrum guides
          its tone.
        </p>
      </header>

      <main className="space-y-4">
        {/* Experience Level — changes SAGE’s tone, not the pattern engine */}
        <ExperienceLevelSelect />

        {/* Confidence Spectrum — High / Low confidence baits for SAGE emphasis */}
        <ConfidenceSpectrumEditor />

        {/* Appearance */}
        <DarkModeToggle />
      </main>
    </ScreenContainer>
  );
};

export default ControlCenterScreen;
