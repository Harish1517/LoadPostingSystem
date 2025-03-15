"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Container, Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import UserContext from "../context/UserContext"; // Import UserContext

export default function Navbar() {
  const pathname = usePathname(); // Get current route
  const { user, logout } = useContext(UserContext); // Access user & logout function

  // Function to check if link should be active (ensures exact match)
  const isActive = (href) => pathname === href;

  return (
    <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <BootstrapNavbar.Brand as={Link} href="/" className="fs-3 fw-bold">
          🚛 Truckers & Loaders
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto fs-5">
            <Nav.Link
              as={Link}
              href="/"
              className={isActive("/") ? "active-link" : "text-secondary"}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/truckers"
              className={isActive("/truckers") ? "active-link" : "text-secondary"}
            >
              Truckers
            </Nav.Link>

            {/* Loaders Dropdown Menu */}
            <NavDropdown title="Loaders" id="loaders-dropdown" className="fs-5">
              <NavDropdown.Item as={Link} href="/my-loads">
                My Loads
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/add-load">
                Add Load
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* User Authentication Section */}
          <Nav className="fs-5">
            {user ? (
              <NavDropdown title={user.name} id="user-dropdown">
                <NavDropdown.Item as={Link} href="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                as={Link}
                href="/login"
                className={isActive("/login") ? "active-link" : "text-secondary"}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
    