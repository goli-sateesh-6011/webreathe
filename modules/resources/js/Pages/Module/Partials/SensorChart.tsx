import { ResponsiveLine, PointTooltipProps } from "@nivo/line";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { DeleteSensorModal } from "./DeleteSensorModal";
import { dateFormatter } from "@/lib/dateFormatter";

export function SensorChart({ sensorId, chartTitle, chartData, actions }: any) {
  const [isDeletionModalShowing, toggleModal] = useState(false);
  const [visible, setVisibility] = useState(true);

  if (!visible) return null;

  const { data } = chartData[0];

  const minValue = data.reduce((currentMinValue: number, dot: any) => {
    if (!dot.y) return currentMinValue;
    if (dot.y < currentMinValue) return dot.y;

    return currentMinValue;
  }, 0);

  const sortedData = chartData[0].data.sort((a: any, b: any) => a.x - b.x);

  return (
    <div className="relative flex flex-col items-center justify-center w-full p-4 h-96">
      <span className="font-bold capitalize">{chartTitle}</span>
      <NoDataMessage show={!data?.length} />

      <Chart data={[{ ...chartData[0], data: sortedData }]} min={minValue} />

      <div className="gap-3 mt-4 d-flex">
        <a
          href={route("sensor.get", sensorId)}
          className="mx-auto btn btn-primary w-max"
        >
          See sensor detail
        </a>
      </div>

      <DeleteSensorModal
        isShown={isDeletionModalShowing}
        handleClose={() => toggleModal(false)}
        handleConfirm={() =>
          router.delete(route("sensor.destroy", sensorId), {
            onSuccess: () => {
              toggleModal(false);
              setVisibility(false);
            },
          })
        }
        sensorName={chartTitle}
      />
    </div>
  );
}

// Fragments
function NoDataMessage({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <span className="text-sm font-medium text-gray-500">
      No recent data for this sensor
    </span>
  );
}

function Chart({ data, minValue }: any) {
  return (
    <ResponsiveLine
      data={data}
      margin={{
        top: 50,
        right: 110,
        bottom: 50,
        left: 60,
      }}
      xScale={{
        type: "time",
      }}
      yScale={{
        type: "linear",
        min: minValue,
      }}
      yFormat=" >-.2f"
      axisBottom={{
        format: "%H:%M:%S",
        tickPadding: 10,
        tickRotation: 45,
      }}
      useMesh
      curve="monotoneX"
      crosshairType="bottom"
      tooltip={Tooltip}
    />
  );
}

function Tooltip({ point }: PointTooltipProps) {
  const formatedDate =
    point.data.x instanceof Date
      ? dateFormatter.format(point.data.x)
      : point.data.x;

  return (
    <div className="flex flex-col p-2 bg-white border rounded shadow border-neutral-100">
      <span className="font-bold capitalize">{point.serieId}</span>
      <span>
        <span className="font-bold">Date :</span> {formatedDate}
      </span>
      <span>
        <span className="font-bold">Value :</span> {point.data.yFormatted}
      </span>
    </div>
  );
}

type SensorInteractionsProps = {
  showModal: () => void;
  sensorUrl: string;
};

function SensorInteractions({ showModal, sensorUrl }: SensorInteractionsProps) {
  return (
    <div className="gap-3 mt-4 d-flex">
      <Button variant="danger" onClick={() => showModal()}>
        Delete sensor
      </Button>

      <a href={sensorUrl} className="mx-auto btn btn-primary w-max">
        See sensor detail
      </a>
    </div>
  );
}
