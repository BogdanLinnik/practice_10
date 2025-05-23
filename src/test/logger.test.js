// Юніт тест для logger.js за допомогою Jest

const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");
const logger = require("../logger");

jest.mock("fs");
jest.mock("perf_hooks", () => ({
  performance: {
    now: jest.fn()
  }
}));

describe("Logger middleware", () => {
  const mockNext = jest.fn();
  const mockReq = {
    method: "GET",
    originalUrl: "/test",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create log directory if it does not exist", () => {
    fs.accessSync.mockImplementationOnce(() => {
      throw new Error("Directory not accessible");
    });

    fs.mkdirSync.mockImplementationOnce(() => {});

    const middleware = logger();
    middleware(mockReq, {}, mockNext);

    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringMatching(/EventsExpressNode-logs$/));
  });

  test("should create log file if it does not exist", () => {
    fs.accessSync
      .mockImplementationOnce(() => {}) // Directory exists
      .mockImplementationOnce(() => {
        throw new Error("File not accessible");
      });

    fs.writeFileSync.mockImplementationOnce(() => {});

    const middleware = logger();
    middleware(mockReq, {}, mockNext);

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringMatching(/-log$/), "");
  });

  test("should append log to the log file", () => {
    const mockStart = 100;
    const mockEnd = 200;
    const expectedPerf = mockEnd - mockStart;

    fs.accessSync.mockImplementation(() => {}); // Both directory and file exist
    fs.appendFileSync.mockImplementation(() => {});

    performance.now
      .mockReturnValueOnce(mockStart)
      .mockReturnValueOnce(mockEnd);

    const middleware = logger();
    middleware(mockReq, {}, mockNext);

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/-log$/),
      expect.stringContaining(`GET /test ${expectedPerf}`)
    );
  });

  test("should call next function", () => {
    fs.accessSync.mockImplementation(() => {}); // Both directory and file exist

    const middleware = logger();
    middleware(mockReq, {}, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
