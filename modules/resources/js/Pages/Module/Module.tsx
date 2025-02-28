import { Header } from "@/Components/Header";
import TimeLineChart from "@/Components/TimeLineChart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { fr } from "date-fns/locale";
import { useEffect, useId, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { SensorChart } from "./Partials/SensorChart";
import { AddSensorModal } from "./Partials/AddSensorModal";
import { EditModuleModal } from "./Partials/EditModuleModal";
import { DeleteModuleModal } from "./Partials/DeleteModuleModal";

type SensorInfo = {
  sensor_id: string;
  data: SensorReading | null;
};

type SensorInfos = {
  sensor_id: string;
  data: SensorReading[] | null;
};

type SensorReading = {
  timestamp: string;
  sensor_value: number | null;
};

type SensorGraph = {
  sensor_id: string;
  graph: ChartDataset[];
};

type ChartDataset = {
  id: string;
  color: string;
  data: ChartPoint[];
};

type ChartPoint = { x: Date; y: number };

const MAX_CHART_VALUES = 10;

export default function Module({
  auth,
  moduleInfos,
  dataCount,
  sensorsInfos,
}: any) {
  const graphValue: any = {};

  useEffect(() => {
    for (const sensorInformation of Object.entries(sensorsInfos)) {
      const sensorName = sensorInformation[0];
      const sensorInfos = sensorInformation[1] as SensorInfos;
      let graphData: ChartPoint[] | [] = [];

      if (sensorInfos?.data && sensorInfos.data?.length) {
        graphData = sensorInfos.data.map((reading: any) => ({
          x: new Date(reading.timestamp),
          y: reading.sensor_value,
        }));
      }
      graphValue[sensorName] = {
        sensor_id: sensorInfos.sensor_id,
        graph: [
          {
            id: sensorInfos.sensor_id,
            color: "rgb(75, 192, 192)",
            data: graphData,
          },
        ],
      };
    }
  }, []);

  const [moduleData, setModuleData] = useState(graphValue);
  const [totalEntriesCount, setEntriesCount] = useState(dataCount);
  const [isModuleRunning, setModuleStatus] = useState<boolean>(
    Boolean(moduleInfos.active)
  );
  const [isNewSensorFormOpen, toggleNewSensorForm] = useState<boolean>(false);
  const [isDeletionModalShowing, toggleDeletionModal] =
    useState<boolean>(false);
  const [isModuleEditFormOpen, toggleModuleEditFormOpen] =
    useState<boolean>(false);

  useEffect(() => {
    async function updateModule() {
      const newData: Record<string, SensorInfo> = await fetchLatestData(
        moduleInfos.id
      );

      setModuleData((prevData: Record<string, SensorGraph>) => {
        const buffer = { ...prevData };

        for (const sensorInformation of Object.entries(newData)) {
          const sensorName = sensorInformation[0] as string;
          const sensorInfos = sensorInformation[1] as SensorInfo;

          if (!buffer[sensorName]) continue;

          const sensorData = buffer[sensorName].graph[0].data;

          // If there is no valid data, just continue.
          if (!sensorInfos.data?.timestamp || !sensorInfos.data?.sensor_value) {
            setModuleStatus(false);
            continue;
          }

          if (
            isDataStale(
              sensorData.at(-1)?.x,
              new Date(sensorInfos.data.timestamp)
            )
          ) {
            setModuleStatus(false);
            continue;
          }

          setModuleStatus(true);

          if (sensorData.length > MAX_CHART_VALUES) {
            removeExcessData(sensorData, MAX_CHART_VALUES);
          }

          setEntriesCount((prevData: number) => prevData + 1);

          sensorData.push({
            x: new Date(sensorInfos.data.timestamp),
            y: sensorInfos.data.sensor_value,
          });
        }

        return buffer;
      });
    }

    const fetchInterval = setInterval(() => {
      updateModule();
    }, 2000);

    return () => clearInterval(fetchInterval);
  }, []);

  return (
    <>
      <AuthenticatedLayout user={auth.user}>
        <Head title="Dashboard" />

        <Header>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2">
              <h2 className="mb-0 text-xl font-semibold leading-tight text-gray-800">
                {auth.user.name}
              </h2>

              <span className="px-2 py-1 text-lg rounded bg-primary text-light">
                {moduleInfos.name}
              </span>

              <span
                className={`w-4 h-4 rounded-circle shrink-0 ${
                  isModuleRunning ? "bg-success" : "bg-danger"
                }`}
              >
                <span className="visually-hidden">
                  {isModuleRunning ? "Module is running" : "Module is inactive"}
                </span>
              </span>
              <span className="font-bold">
                {totalEntriesCount} entries in total
              </span>
            </span>

            <span>{moduleInfos.description}</span>
          </div>

          <div className="ml-auto space-x-2">
            <Button
              variant="outline-danger"
              onClick={() => toggleDeletionModal(true)}
            >
              Delete this module
            </Button>
            <Button
              className="ml-auto"
              onClick={() => toggleModuleEditFormOpen(true)}
            >
              Edit this module
            </Button>
          </div>
        </Header>

        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-around w-full gap-8 bg-white rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center justify-around w-full gap-8 bg-white rounded-lg shadow-sm shrink">
                {Object.values(moduleData).map((sensor: any, index: number) => {
                  return (
                    <div
                      className="flex flex-col w-full"
                      key={`sensor-${Object.keys(moduleData)[index]}`}
                    >
                      <SensorChart
                        sensorId={sensor.sensor_id}
                        chartData={sensor.graph}
                        chartTitle={Object.keys(moduleData)[index]}
                      />
                    </div>
                  );
                })}

                <Button
                  className="mb-4"
                  onClick={() => toggleNewSensorForm(true)}
                >
                  Add a new sensor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>

      <AddSensorModal
        moduleInfos={moduleInfos}
        handleClose={() => toggleNewSensorForm(false)}
        isShown={isNewSensorFormOpen}
      />

      <DeleteModuleModal
        isShown={isDeletionModalShowing}
        handleClose={() => toggleDeletionModal(false)}
        handleConfirm={() =>
          router.delete(route("module.destroy", moduleInfos.id), {
            onSuccess: () => {
              router.get(route("dashboard"));
            },
          })
        }
        sensorName={moduleInfos.name}
      />

      <EditModuleModal
        isShown={isModuleEditFormOpen}
        moduleInfos={moduleInfos}
        handleClose={() => toggleModuleEditFormOpen(false)}
      />
    </>
  );
}

// Helper functions
async function fetchLatestData(moduleId: string | number) {
  const { data, status } = await axios.get(`/module/latest/${moduleId}`);

  return data;
}

function removeExcessData(
  data: Array<Record<"x" | "y", any>>,
  maxDataPoints: number
): void {
  // Get how many data points should be removed;
  const limitOverhang = data.length - maxDataPoints;
  //Remove them starting at the start (oldest data)
  data.splice(0, limitOverhang);
}

function isDataStale(currentLatestTimestamp?: Date, newTimestamp?: Date) {
  if (!newTimestamp || !currentLatestTimestamp) return false;

  return currentLatestTimestamp.getTime() === newTimestamp.getTime();
}
