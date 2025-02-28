import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.store"));
  };

  return (
    <GuestLayout>
      <Head title="Reset Password" />

      <Container className="flex flex-col gap-2">
        <h1 className="h4">Reset your password</h1>

        <Form onSubmit={submit} className="space-y-4">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="block w-full mt-1"
              autoComplete="username"
              onChange={(e) => setData("email", e.target.value)}
            />
            {errors.email && <Form.Text>{errors.email}</Form.Text>}
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="block w-full mt-1"
              autoComplete="new-password"
              onChange={(e) => setData("password", e.target.value)}
            />
            {errors.password && <Form.Text>{errors.password}</Form.Text>}
          </Form.Group>
          <Form.Group className="flex ">
            <Form.Control
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="block w-full mt-1"
              autoComplete="new-password"
              onChange={(e) => setData("password_confirmation", e.target.value)}
            />
            <Form.Label>Remember me</Form.Label>
            {errors.password_confirmation && (
              <Form.Text>{errors.password_confirmation}</Form.Text>
            )}
          </Form.Group>

          <div className="flex items-center justify-end mt-4">
            <Button type="submit" className="ml-4" disabled={processing}>
              Reset Password
            </Button>
          </div>
        </Form>
      </Container>
    </GuestLayout>
  );
}
