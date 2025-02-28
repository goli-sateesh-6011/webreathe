import { Form } from "react-bootstrap";

export function SensorInput({
  sensor,
  index = 0,
  handleStateChange,
}: any): React.ReactElement {
  return (
    <div className="flex-col gap-2 p-4 border d-flex border-muted">
      <Form.Group>
        <Form.Label>Sensor name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Speedometer"
          value={sensor.name}
          onChange={(e) => handleStateChange(index, "name", e.target.value)}
        />
      </Form.Group>
      <div className="gap-4 d-flex">
        <Form.Group className="w-100">
          <Form.Label>Minimum Value</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            value={sensor.min}
            onChange={(e) => handleStateChange(index, "min", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="w-100">
          <Form.Label>Maximum Value</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            value={sensor.max}
            onChange={(e) => handleStateChange(index, "max", e.target.value)}
          />
        </Form.Group>
      </div>
      <Form.Group>
        <Form.Label>Unit</Form.Label>
        <Form.Control
          type="text"
          placeholder="km/h"
          value={sensor.unit}
          onChange={(e) => handleStateChange(index, "unit", e.target.value)}
          max={50}
        />
      </Form.Group>
    </div>
  );
}
