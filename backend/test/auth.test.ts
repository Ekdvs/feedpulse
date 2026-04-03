import { adminAuth } from "../src/middleware/admin";
import jwt from "jsonwebtoken";

// Mock JWT verification
jest.mock("jsonwebtoken");

describe("Admin Auth Middleware", () => {
  const next = jest.fn();
  const response: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("nshould reject request without toke", () => {
    const request: any = { headers: {} };

    adminAuth(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "No token provided" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject request with invalid token", () => {
    const request: any = { headers: { authorization: "Bearer invalidtoken" } };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    adminAuth(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid token" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject request with expired token", () => {
    const request: any = { headers: { authorization: "Bearer expiredtoken" } };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw { name: "TokenExpiredError" };
    });

    adminAuth(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Token expired" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", () => {
    const request: any = { headers: { authorization: "Bearer validtoken" } };
    // Mock a valid admin token
    (jwt.verify as jest.Mock).mockReturnValue({ id: "1", role: "admin" });

    adminAuth(request, response, next);

    expect(next).toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });

  it("should reject request if user is not admin", () => {
    const request: any = { headers: { authorization: "Bearer usertoken" } };
    // Mock a valid token but role is not admin
    (jwt.verify as jest.Mock).mockReturnValue({ id: "2", role: "user" });

    adminAuth(request, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Forbidden - Admin only" })
    );
    expect(next).not.toHaveBeenCalled();
  });
});