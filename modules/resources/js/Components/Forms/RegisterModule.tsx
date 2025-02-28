import { router, useForm } from "@inertiajs/react";
import { Form, Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { SensorInput } from "./Inputs/SensorInput";

type SensorRegisterGroup = {
  id: string;
  name: string;
  min: number | null;
  max: number | null;
  unit: string;
};

export function NewModuleForm() {
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

    post(route("register_module"), {
      onSuccess: () => {
        router.get(route("dashboard"));
      },
    });
  }

  return (
    <Form
      className="flex-col gap-2 p-4 d-flex"
      onSubmit={(e) => handleSubmit(e)}
    >
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

      <Button type="submit" disabled={processing}>
        {processing ? "Processing" : "Register module"}
      </Button>
    </Form>
  );
}
