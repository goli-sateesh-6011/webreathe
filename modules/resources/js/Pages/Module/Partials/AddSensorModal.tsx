import { SensorInput } from "@/Components/Forms/Inputs/SensorInput";
import { router, useForm } from "@inertiajs/react";
import { Modal, Button, Form } from "react-bootstrap";

export function AddSensorModal({
  moduleInfos,
  isShown,
  handleClose,
  handleSuccess,
}: any) {
  const { data, setData, post, processing } = useForm({
    module: moduleInfos.id,
    name: "",
    min: -9999,
    max: 9999,
    unit: "",
  });

  function updateForm(index: number, field: string, value: string | number) {
    setData({ ...data, [field]: value });
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    post(route("sensor.create", moduleInfos.id), {
      onSuccess: () => {
        handleClose();
        router.reload();
      },
    });
  }

  return (
    <Modal show={isShown} onHide={handleClose} onSubmit={handleSubmit}>
      <Modal.Header>
        <Modal.Title>Create a new sensor for {moduleInfos.name}</Modal.Title>
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
