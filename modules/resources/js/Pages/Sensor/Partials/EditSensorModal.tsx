import { SensorInput } from "@/Components/Forms/Inputs/SensorInput";
import { router, useForm } from "@inertiajs/react";
import { Modal, Button, Form } from "react-bootstrap";

export function EditSensorModal({
  sensorInfos,
  isShown,
  handleClose,
  handleSuccess,
}: any) {
  const { data, setData, patch, processing } = useForm({
    name: sensorInfos.name,
    min: sensorInfos.min_value,
    max: sensorInfos.max_value,
    unit: sensorInfos.unit,
  });

  function updateForm(index: number, field: string, value: string | number) {
    setData({ ...data, [field]: value });
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    patch(route("sensor.edit", sensorInfos.id), {
      onSuccess: () => {
        handleClose();
        router.reload();
      },
    });
  }

  return (
    <Modal show={isShown} onHide={handleClose} onSubmit={handleSubmit}>
      <Modal.Header>
        <Modal.Title>Edit {sensorInfos.name}</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <SensorInput sensor={data} index={0} handleStateChange={updateForm} />
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
