import { NewModuleModal } from "@/Components/Modals/NewModuleModal";
import { User } from "@/types";
import { router } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";

export default function Authenticated({
  user,
  header,
  children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
  const [isNewModuleModalOpen, toggleNewModuleModal] = useState<boolean>(false);

  const siteSections = [
    { name: "home", href: "/", label: "Home" },
    { name: "dashboard", href: route("dashboard"), label: "Dashboard" },
    { name: "profile.edit", href: route("profile.edit"), label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Container>
        <Navbar collapseOnSelect variant="light" expand="lg">
          <Navbar.Brand href="/">Control</Navbar.Brand>

          <Navbar.Toggle aria-controls="mainNav" />

          <Navbar.Collapse id="mainNav">
            <Nav className="me-auto w-100">
              {siteSections.map((section: Record<string, string>) => (
                <Nav.Link
                  href={section.href}
                  key={section.href}
                  active={route().current(section.name)}
                >
                  {section.label}
                </Nav.Link>
              ))}

              <Nav.Link onClick={() => router.post(route("logout"))}>
                Logout
              </Nav.Link>

              <Button
                onClick={() => toggleNewModuleModal(true)}
                className="ml-auto rounded bg-primary text-light"
              >
                Register a new module
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {header && (
          <header className="bg-white shadow">
            <div className="py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        <main>{children}</main>
      </Container>

      <NewModuleModal
        isShown={isNewModuleModalOpen}
        handleClose={() => toggleNewModuleModal(false)}
      />
    </div>
  );
}
