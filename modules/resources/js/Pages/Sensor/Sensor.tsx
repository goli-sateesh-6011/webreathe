import { Header } from "@/Components/Header";
import Pagination from "@/Components/Navigation/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "react-bootstrap";

import { DeleteSensorModal } from "./Partials/DeleteSensorModal";
import { EditSensorModal } from "./Partials/EditSensorModal";
import { ReadingsTable } from "./Partials/ReadingsTable";

type SensorTableReading = {
  id: number;
  timestamp: string;
  sensor_name: string;
  sensor_value: number;
  unit?: string;
};

const dateFormatter = Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function Module({
  auth,
  paginator,
  results,
  sensor,
  entriesTotal,
}: any) {
  const { current_page, last_page } = paginator;

  const [isDeletionModalShowing, toggleModal] = useState<boolean>(false);
  const [isSensorEditFormOpen, toggleSensorEditForm] = useState<boolean>(false);

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />

      <Header>
        <div className="flex flex-col w-full">
          <span className="flex items-center w-full gap-2">
            <h2 className="mb-0 text-lg">{auth.user.name}</h2>
            <span className="font-bold text-gray-500 ">
              {sensor.module.name}
            </span>
          </span>
          <span className="space-x-4">
            <span className="font-bold capitalize">{sensor.name}</span>
            <span className="font-medium text-gray-500">
              {entriesTotal} Entries
            </span>
          </span>
        </div>

        <div className="flex gap-4">
          <Button variant="outline-danger" className="w-max">
            Delete this sensor
          </Button>
          <Button className="w-max" onClick={() => toggleSensorEditForm(true)}>
            Edit this sensor
          </Button>
        </div>
      </Header>

      <div className="py-12 overflow-hidden">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex-wrap w-full gap-8 bg-white shadow-sm d-flex align-items-center justify-content-around shrink sm:rounded-lg">
            <div className="flex flex-wrap items-center justify-around w-full gap-8 bg-white shadow-sm shrink sm:rounded-lg">
              <ReadingsTable
                readings={results}
                sensor={{
                  min: sensor.min_value,
                  max: sensor.max_value,
                  unit: sensor?.unit,
                }}
              />

              <div className="mb-4">
                <Pagination currentPage={current_page} lastPage={last_page} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteSensorModal
        isShown={isDeletionModalShowing}
        handleClose={() => toggleModal(false)}
        handleConfirm={() => router.delete(route("sensor.destroy", sensor.id))}
        sensorName={sensor.name}
      />

      <EditSensorModal
        isShown={isSensorEditFormOpen}
        sensorInfos={sensor}
        handleClose={() => toggleSensorEditForm(false)}
      />
    </AuthenticatedLayout>
  );
}
