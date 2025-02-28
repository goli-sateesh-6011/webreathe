import { router } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { Button } from "react-bootstrap";

const ROOT_PATH = "dashboard";

export function Header({ children, ...rest }: any) {
  return (
    <header
      className={`flex items-center p-2 gap-2 bg-white rounded shadow-sm`}
      {...rest}
    >
      {!route().current(ROOT_PATH) && (
        <Button variant="outline-primary" onClick={() => window.history.back()}>
          Back
        </Button>
      )}
      {children}
    </header>
  );
}
