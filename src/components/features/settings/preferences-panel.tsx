import AlertPreferencesPanel from "./alert-preferences-panel";
import ConverterBehaviorPanel from "./converter-behavior-panel";
import DisplayDataPanel from "./display-data-panel";
import LinkedAccountsPanel from "./linked-accounts-panel";
import SessionsPanel from "./sessions-panel";

const PreferencesPanel = () => {
  return (
    <div className="space-y-step-200 md:space-y-step-250">
      <ConverterBehaviorPanel />
      <DisplayDataPanel />
      <AlertPreferencesPanel />
      <SessionsPanel />
      <LinkedAccountsPanel />
    </div>
  );
};

export default PreferencesPanel;
