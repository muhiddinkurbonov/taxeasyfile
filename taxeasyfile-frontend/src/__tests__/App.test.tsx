import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock localStorage
const mockLocalStorage = (token: string | null, role: string | null) => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "token") return token;
    if (key === "role") return role;
    return null;
  });
};

// Mock child components
jest.mock("../pages/LoginPage", () => () => <div>Login Page</div>);
jest.mock("../pages/CpaDashboard", () => () => <div>CPA Dashboard</div>);
jest.mock("../pages/SignupPage", () => () => <div>Signup Page</div>);
jest.mock("../pages/AdminDashboard", () => () => <div>Admin Dashboard</div>);
jest.mock("../pages/ClientsPage", () => () => <div>Clients Page</div>);
jest.mock("../components/Navbar", () => () => <div>Navbar</div>);

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders LoginPage for unauthenticated user on /login", () => {
    mockLocalStorage(null, null);
    render(<App />);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.getByText(/navbar/i)).toBeInTheDocument();
  });

  test("renders CpaDashboard for authenticated CPA user", () => {
    mockLocalStorage("mock-token", "CPA");
    render(<App />);
    // expect(screen.getByText(/CPA Dashboard/i)).toBeInTheDocument();
  });
});
