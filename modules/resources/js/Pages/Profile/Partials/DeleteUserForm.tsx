import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function DeleteUserForm({
  className = "",
}: {
  className?: string;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement | null>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: "",
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>

        <p className="mt-1 text-sm text-gray-600">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.
        </p>
      </header>

      <Button variant="danger" onClick={confirmUserDeletion}>
        Delete Account
      </Button>

      <Modal show={confirmingUserDeletion} onHide={closeModal}>
        <Modal.Header className="flex flex-col space-y-4">
          <Modal.Title>
            Are you sure you want to delete your account?
          </Modal.Title>
          <p className="mt-1 text-sm text-gray-600">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </p>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label visuallyHidden>Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                name="password"
                ref={passwordInput}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="block w-3/4 mt-1"
                placeholder="Password"
              />

              {errors.password && <Form.Text>{errors.password}</Form.Text>}
            </Form.Group>

            <div className="flex justify-end mt-6">
              <Button variant="outline-secondary" onClick={closeModal}>
                Cancel
              </Button>

              <Button variant="danger" className="ml-3" disabled={processing}>
                Delete Account
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
}
