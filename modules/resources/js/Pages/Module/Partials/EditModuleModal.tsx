import { SensorInput } from "@/Components/Forms/Inputs/SensorInput";
import { router, useForm } from "@inertiajs/react";
import { Modal, Button, Form } from "react-bootstrap";

export function EditModuleModal({
  moduleInfos,
  isShown,
  handleClose,
  handleSuccess,
}: any) {
  const { data, setData, patch, processing } = useForm({
    name: moduleInfos.name,
    description: moduleInfos.description || "",
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    patch(route("module.edit", moduleInfos.id), {
      onSuccess: () => {
        router.reload();
        handleClose();
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
          <Form.Group>
            <Form.Label>Module name</Form.Label>
            <Form.Control
              maxLength={255}
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.currentTarget.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              maxLength={255}
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.currentTarget.value })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="link" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit">Update Module</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
