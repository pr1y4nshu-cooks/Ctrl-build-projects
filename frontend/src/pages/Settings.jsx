import TopNavbar from "../components/settings/TopNavbar";
import SideNavbar from "../components/settings/SideNavbar";
import GeneralSettings from "../components/settings/GeneralSettings";
import AISettings from "../components/settings/AISettings";
import AutomationSettings from "../components/settings/AutomationSettings";
import DangerZone from "../components/settings/DangerZone";
import Footer from "../components/settings/Footer";

export default function Settings() {

  return (

    <div className="bg-background text-on-background min-h-screen">

      <TopNavbar />

      <SideNavbar />

      <main className="ml-60 pt-14 min-h-screen">

        <div className="max-w-6xl mx-auto p-8 lg:p-12">

          <header className="mb-10">

            <h1 className="text-4xl font-bold mb-2">
              Project Settings
            </h1>

            <p className="text-outline">
              Configure your intelligence engine and repository hooks.
            </p>

          </header>

          <GeneralSettings />

          <AISettings />

          <AutomationSettings />

          <DangerZone />

        </div>

        <Footer />

      </main>

    </div>

  );

}