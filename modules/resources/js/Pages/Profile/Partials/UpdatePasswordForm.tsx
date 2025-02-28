import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
import { Button, Form } from "react-bootstrap";

export default function UpdatePasswordForm({
  className = "",
}: {
  className?: string;
}) {
  const passwordInput = useRef<HTMLInputElement | null>(null);
  const currentPasswordInput = useRef<HTMLInputElement | null>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation");
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset("current_password");
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Update Password</h2>

        <p className="mt-1 text-sm text-gray-600">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <Form onSubmit={updatePassword} className="mt-6 space-y-4">
        <Form.Group>
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) =>
              setData("current_password", (e.target as HTMLInputElement).value)
            }
            type="password"
            autoComplete="current-password"
          />

          {errors.current_password && (
            <Form.Text>{errors.current_password}</Form.Text>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            ref={passwordInput}
            value={data.password}
            onChange={(e) =>
              setData("password", (e.target as HTMLInputElement).value)
            }
            type="password"
            autoComplete="password"
          />

          {errors.password && <Form.Text>{errors.current_password}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={data.password_confirmation}
            onChange={(e) =>
              setData(
                "password_confirmation",
                (e.target as HTMLInputElement).value
              )
            }
            type="password"
            autoComplete="password_confirmation"
          />

          {errors.password_confirmation && (
            <Form.Text>{errors.password_confirmation}</Form.Text>
          )}
        </Form.Group>
        <div className="flex items-center gap-4">
          <Button disabled={processing}>Save</Button>

          {!recentlySuccessful && (
            <span className="text-sm text-gray-600">Saved.</span>
          )}
        </div>
      </Form>
    </section>
  );
}
