import { Button, Modal } from "react-bootstrap";
export function DeleteModuleModal({
  isShown,
  handleClose,
  handleConfirm,
  moduleName,
}: any) {
  return (
    <Modal show={isShown} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete {moduleName} ?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You are about to delete the {moduleName} module. You will delete it
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
