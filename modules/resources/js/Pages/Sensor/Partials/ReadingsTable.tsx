import { dateFormatter } from "@/lib/dateFormatter";

type ReadingTableProps = {
  readings: SensorTableReading[];
  sensor: {
    min: number;
    max: number;
    unit: string;
  };
};

type SensorTableReading = {
  id: number;
  timestamp: string;
  sensor_name: string;
  sensor_value: number;
  unit?: string;
};

export function ReadingsTable({ readings, sensor }: ReadingTableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Sensor Name</th>
          <th scope="col">Reading date</th>
          <th scope="col">Value</th>
        </tr>
      </thead>

      <tbody>
        {readings.map((reading: SensorTableReading) => (
          <tr
            key={reading.id}
            className={
              reading.sensor_value < sensor.min ||
              reading.sensor_value > sensor.max
                ? "table-danger"
                : ""
            }
          >
            <th scope="row">{reading.id}</th>
            <td>{reading.sensor_name}</td>
            <td>{dateFormatter.format(new Date(reading.timestamp))}</td>
            <td>
              {reading.sensor_value} {sensor.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
