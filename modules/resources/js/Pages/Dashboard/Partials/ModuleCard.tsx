import { dateFormatter } from "@/lib/dateFormatter";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { ModuleCardType } from "../Dashboard";
import { Button } from "react-bootstrap";
const NO_DESCRIPTION_MESSAGE = "No description available for this module.";

type ModuleCardProps = {
  module: ModuleCardType;
};

type ActivityState = {
  active: boolean;
  activeSince: string | number | null;
};

export function ModuleCard({ module }: ModuleCardProps) {
  const [activityInfo, setActivityInfo] = useState<ActivityState>({
    active: Boolean(module.active),
    activeSince: module?.active_since,
  });

  const toggleModuleState = () =>
    toggleModule(module.id, activityInfo, setActivityInfo);

  return (
    <article className="w-[320px] gap-2 px-6 py-4 bg-white rounded shadow-sm flex flex-column justify-between">
      <ModuleDetails module={module} activityInfo={activityInfo} />

      <ModuleInteractions
        moduleId={module.id}
        active={activityInfo.active}
        onToggle={toggleModuleState}
      />
    </article>
  );
}

//* Fragments
type ModuleDetailsProps = {
  module: ModuleCardType;
  activityInfo: ActivityState;
};

function ModuleDetails({ module, activityInfo }: ModuleDetailsProps) {
  return (
    <>
      <h1 className="text-xl">{module.name}</h1>
      <span>{module.description || NO_DESCRIPTION_MESSAGE}</span>
      <span className="font-medium">{module.dataCount} sensor entries</span>
      {activityInfo.active ? (
        <span className="flex-column d-flex">
          <span>Active since</span>
          {
            <span className="font-medium">
              {activityInfo.activeSince &&
                dateFormatter.format(new Date(activityInfo.activeSince))}
            </span>
          }
        </span>
      ) : (
        <span>Currently inactive</span>
      )}
    </>
  );
}

type ModuleInteractionsProps = {
  moduleId: number;
  active: boolean;
  onToggle: any;
};

function ModuleInteractions({
  moduleId,
  active,
  onToggle,
}: ModuleInteractionsProps) {
  return (
    <div className="flex justify-between gap-8">
      <Link href={route("module.get", moduleId)} className="btn btn-primary">
        See detail
      </Link>

      <Button
        variant={active ? "outline-danger" : "success"}
        onClick={() => onToggle()}
      >
        {active ? "Deactivate" : "Activate"}
      </Button>
    </div>
  );
}

//* Helper functions
async function toggleModule(
  moduleId: number,
  state: ActivityState,
  toggleState: (value: ActivityState) => void
): Promise<void> {
  const isCurrentlyActive = state.active;
  const currentUptime = state.activeSince;

  toggleState({
    activeSince: isCurrentlyActive ? null : new Date().getTime(),
    active: !state.active,
  });
  const req = await axios.post(route("module.toggle", moduleId));

  if (req.status !== 200) {
    return toggleState({ activeSince: currentUptime, active: !state.active });
  }
}
