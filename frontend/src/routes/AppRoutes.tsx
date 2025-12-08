// src/routes/AppRoutes.tsx (excerpt)
import { ControlCenterScreen } from "@/screens/ControlCenterScreen";

// ...

<Route
  path="/control-center"
  element={
    <AppShell>
      <ControlCenterScreen />
    </AppShell>
  }
/>;
