import { rest } from "msw";
import { setupServer } from "msw/node";
import { login, signup, logout } from "../api/auth";
import { api } from "../api/utils";
import { AuthRequest, SignupRequest } from "../api/types";

// Setup MSW server for mocking API requests
const server = setupServer(
  rest.post("*/auth/login", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        jwt: "mock-jwt",
        refreshToken: "mock-refresh-token",
        userId: "123",
        role: "USER",
      })
    );
  }),
  rest.post("*/auth/signup", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json("User created"));
  })
);

describe("Auth API", () => {
  // Start server before tests and clean up after
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("login", () => {
    it("should return jwt, refreshToken, userId, and role on successful login", async () => {
      const credentials: AuthRequest = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await login(credentials);

      expect(result).toEqual({
        jwt: "mock-jwt",
        refreshToken: "mock-refresh-token",
        userId: "123",
        role: "USER",
      });
    });

    it("should throw an error on failed login", async () => {
      server.use(
        rest.post("*/auth/login", (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ message: "Invalid credentials" })
          );
        })
      );

      const credentials: AuthRequest = {
        email: "wrong@example.com",
        password: "wrong",
      };

      await expect(login(credentials)).rejects.toThrow(
        "Request failed with status code 401"
      );
    });
  });

  describe("signup", () => {
    it("should return a success message on successful signup", async () => {
      const userData: SignupRequest = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const result = await signup(userData);

      expect(result).toBe("User created");
    });

    it("should throw an error on failed signup", async () => {
      server.use(
        rest.post("*/auth/signup", (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({ message: "Email already exists" })
          );
        })
      );

      const userData: SignupRequest = {
        username: "testuser",
        email: "existing@example.com",
        password: "password123",
      };

      await expect(signup(userData)).rejects.toThrow(
        "Request failed with status code 400"
      );
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      // Mock localStorage
      jest.spyOn(Storage.prototype, "removeItem");
      localStorage.setItem("token", "mock-jwt");
      localStorage.setItem("refreshToken", "mock-refresh-token");
      localStorage.setItem("userId", "123");
      api.defaults.headers.common["Authorization"] = "Bearer mock-jwt";
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should clear token, refreshToken, userId from localStorage and remove Authorization header", () => {
      logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
      expect(localStorage.removeItem).toHaveBeenCalledWith("userId");
      expect(api.defaults.headers.common["Authorization"]).toBe("");
    });
  });
});
