import { ResponsiveLine, PointTooltipProps } from "@nivo/line";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { router } from "@inertiajs/react";
export default function TimeLineChart({
  sensorId,
  chartTitle,
  chartData,
  actions,
}: any) {
  const [isDeletionModalShowing, toggleModal] = useState(false);
  const [visible, setVisibility] = useState(true);
  actions.remove();
  if (!visible) return null;

  const { data } = chartData[0];

  const minValue = data.reduce((currentMinValue: number, dot: any) => {
    if (!dot.y) return currentMinValue;
    if (dot.y < currentMinValue) return dot.y;

    return currentMinValue;
  }, 0);

  const sortedData = chartData[0].data.sort((a: any, b: any) => a.x - b.x);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-full p-4 h-96">
        <span className="font-bold capitalize">{chartTitle}</span>
        {!data.length && (
          <span className="text-sm">No recent data for this sensor</span>
        )}
        <ResponsiveLine
          data={[{ ...chartData[0], data: sortedData }]}
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
          tooltip={ChartTooltip}
        />

        <div className="gap-3 mt-4 d-flex">
          <Button variant="danger" onClick={() => toggleModal(true)}>
            Delete sensor
          </Button>

          <a
            href={route("sensor.get", sensorId)}
            className="mx-auto btn btn-primary w-max"
          >
            See sensor detail
          </a>
        </div>
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
    </>
  );
}

function ChartTooltip({ point }: PointTooltipProps) {
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

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

function DeleteSensorModal({
  isShown,
  handleClose,
  handleConfirm,
  sensorName,
}: any) {
  return (
    <Modal show={isShown} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {sensorName} ?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You are about to delete the {sensorName} sensor. You will delete it
          and every data associated with it. Are you sure ?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="tertiary" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => handleConfirm()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
