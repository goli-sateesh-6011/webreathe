import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"));
  };

  return (
    <GuestLayout>
      <Head title="Log in" />
      <Container className="flex flex-col gap-2">
        <h1 className="h4">Log in</h1>
        {status && (
          <div className="mb-4 text-sm font-medium text-green-600">
            {status}
          </div>
        )}

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
              autoComplete="current-password"
              onChange={(e) => setData("password", e.target.value)}
            />
            {errors.password && <Form.Text>{errors.password}</Form.Text>}
          </Form.Group>
          <Form.Group className="flex ">
            <Form.Check
              name="remember"
              type="switch"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
            />
            <Form.Label>Remember me</Form.Label>
          </Form.Group>

          <div className="flex items-center justify-end mt-4">
            {canResetPassword && (
              <Link
                href={route("password.request")}
                className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none "
              >
                Forgot your password?
              </Link>
            )}

            <Button type="submit" className="ml-4" disabled={processing}>
              Log in
            </Button>
          </div>
        </Form>
      </Container>
    </GuestLayout>
  );
}
