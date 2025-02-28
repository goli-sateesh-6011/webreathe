import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Button, Container, Form } from "react-bootstrap";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <GuestLayout>
      <Head title="Forgot Password" />
      <Container className="flex flex-col gap-2">
        <h1 className="h4">Forgotten password</h1>
        <div className="text-sm text-gray-600">
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </div>

        {status && (
          <div className="mb-4 text-sm font-medium text-green-600">
            {status}
          </div>
        )}
        <Form onSubmit={submit}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="block w-full mt-1"
              onChange={(e) => setData("email", e.target.value)}
            />
            {errors.email && <Form.Text>{errors.email}</Form.Text>}
          </Form.Group>
          <div className="flex items-center justify-end mt-4">
            <Button type="submit" className="ml-4" disabled={processing}>
              Email Password Reset Link
            </Button>
          </div>
        </Form>
      </Container>
    </GuestLayout>
  );
}
