import ExperienceLevelSelect from "../components/controlCenter/ExperienceLevelSelect";
import CoachingStyleSelect from "../components/controlCenter/CoachingStyleSelect";
import PreferredStylesGrid from "../components/controlCenter/PreferredStylesGrid";
import ConfidenceSpectrumEditor from "../components/controlCenter/ConfidenceSpectrumEditor";
import DarkModeToggle from "../components/controlCenter/DarkModeToggle";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";

const ControlCenterScreen = () => {
  useOnboardingGuard();
  return (
    <div className="min-h-screen px-4 py-4">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-gray-100">Control Center</h1>
      </header>

      <main className="space-y-4">
        <ExperienceLevelSelect />
        <CoachingStyleSelect />
        <PreferredStylesGrid />
        <ConfidenceSpectrumEditor />
        <DarkModeToggle />
      </main>
    </div>
  );
};

export default ControlCenterScreen;
