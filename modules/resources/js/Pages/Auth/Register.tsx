import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
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

    post(route("register"));
  };

  return (
    <GuestLayout>
      <Head title="Register" />
      <Container className="flex flex-col gap-2">
        <h1 className="h4">Create a new account</h1>
        <Form onSubmit={submit} className="space-y-4">
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              id="name"
              name="name"
              value={data.name}
              className="block w-full mt-1"
              autoComplete="name"
              onChange={(e) => setData("name", e.target.value)}
              required
            />
            {errors.name && <Form.Text>{errors.name}</Form.Text>}
          </Form.Group>
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
              required
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
              required
            />
            {errors.password && <Form.Text>{errors.password}</Form.Text>}
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="block w-full mt-1"
              autoComplete="new-password"
              onChange={(e) => setData("password_confirmation", e.target.value)}
              required
            />
            {errors.password_confirmation && (
              <Form.Text>{errors.password_confirmation}</Form.Text>
            )}
          </Form.Group>

          <div className="flex items-center justify-end mt-4">
            <Link
              href={route("login")}
              className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Already registered?
            </Link>

            <Button type="submit" className="ml-4" disabled={processing}>
              Register
            </Button>
          </div>
        </Form>
      </Container>
    </GuestLayout>
  );
}
