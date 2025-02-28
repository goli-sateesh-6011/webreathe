import { PropsWithChildren, ReactNode, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function GuestLayout({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  const siteSections = [
    { name: "home", href: "/", label: "Home" },
    { name: "login", href: route("login"), label: "Login" },
    { name: "register", href: route("register"), label: "Register" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Container>
        <Navbar collapseOnSelect variant="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">Control</Navbar.Brand>

            <Navbar.Toggle aria-controls="mainNav" />

            <Navbar.Collapse id="mainNav">
              <Nav className="me-auto w-100">
                {siteSections.map((section: Record<string, string>) => (
                  <Nav.Link
                    key={section.href}
                    active={route().current(section.name)}
                    href={section.href}
                  >
                    {section.label}
                  </Nav.Link>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
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
    </div>
  );
}
