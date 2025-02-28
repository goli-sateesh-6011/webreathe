import { Modal, Button, Form } from "react-bootstrap";

import { router, useForm } from "@inertiajs/react";
import { v4 as uuidv4 } from "uuid";
import { SensorInput } from "../Forms/Inputs/SensorInput";
import { ModalProps } from "@/types/app";

type SensorRegisterGroup = {
  id: string;
  name: string;
  min: number | null;
  max: number | null;
  unit: string;
};

export function NewModuleModal({ isShown, handleClose }: ModalProps) {
  const { data, setData, post, processing, errors, transform } = useForm({
    name: "",
    description: "",
    sensors: [{ id: uuidv4(), name: "", min: 0, max: 9999, unit: "" }],
  });

  function addNewSensor() {
    setData({
      ...data,
      sensors: [
        ...data.sensors,
        { id: uuidv4(), name: "", min: 0, max: 9999, unit: "" },
      ],
    });
  }

  function removeSensor(index: number) {
    const buffer = [...data.sensors];

    buffer.splice(index, 1);

    setData({ ...data, sensors: buffer });
  }

  function updateSensor(index: number, field: string, value: number | string) {
    const buffer = [...data.sensors];

    buffer[index] = {
      ...buffer[index],
      [field]: value,
    };

    setData({ ...data, sensors: buffer });
  }

  function updateData(field: string, value: string) {
    setData({ ...data, [field]: value });
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    // Make sure the speed of the sensors is always an int
    transform((data) => ({
      ...data,
      sensors: data.sensors.map((sensor) => ({
        ...sensor,
        min:
          typeof sensor.min === "number"
            ? sensor.min
            : parseInt(sensor.min, 10),
        max:
          typeof sensor.max === "number"
            ? sensor.max
            : parseInt(sensor.max, 10),
      })),
    }));

    post(route("module.create"), {
      onSuccess: () => {
        router.get(route("dashboard"));
      },
    });
  }

  return (
    <Modal show={isShown} onHide={handleClose} onSubmit={handleSubmit}>
      <Modal.Header>
        <Modal.Title>Register a new module</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body className="flex flex-col gap-2">
          <Form.Group controlId="registerModuleName">
            <Form.Label>Module Name ( required )</Form.Label>
            <Form.Control
              type="text"
              value={data.name}
              onChange={(e) => updateData("name", e.target.value)}
              maxLength={255}
              placeholder="My car"
            />
            <Form.Text>The name of your module</Form.Text>
            {errors.name && (
              <Form.Text className="text-danger">{errors.name}</Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="registerModuleDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              value={data.description}
              onChange={(e) => updateData("description", e.target.value)}
              placeholder="Getting circulation data from my car."
              maxLength={500}
            />
            <Form.Text>A description of your module role</Form.Text>
          </Form.Group>
          {data.sensors.map((sensor: SensorRegisterGroup, index: number) => (
            <div className="position-relative" key={sensor.id}>
              <Button
                size="sm"
                variant="danger"
                className="right-0 translate-x-1/2 -translate-y-1/2 position-absolute"
                onClick={() => removeSensor(index)}
              >
                X
              </Button>
              <SensorInput
                sensor={sensor}
                index={index}
                handleStateChange={updateSensor}
              />
            </div>
          ))}
          <Button
            variant="primary"
            className="ml-auto w-max"
            onClick={() => addNewSensor()}
          >
            Add another sensor
          </Button>
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="link" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit">Create new sensor</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
