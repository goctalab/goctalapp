import dbUtils, { fakeFetch, ensureDirExists } from '@data/dbUtils';

jest.mock('expo-file-system', () => {
  return {
    __esModule: true,
    makeDirectoryAsync: jest.fn(() => {
      // console.log("MOCK makeDirectoryAsync");
    }),
    getInfoAsync: jest.fn(() => {
      // console.log("MOCK getInfoAsync");
    }),
    downloadAsync: jest.fn(() => Promise.resolve("MOCK downloadAsync")),
    moveAsync: jest.fn(() => Promise.resolve("MOCK moveAsync"))
  }
});

const FileSystemMock = require('expo-file-system');

/* mocking fetch */

let resolvedServerVersion = "2"; // overide resolvedValue in future tests

const mockFetchPromise = () => Promise.resolve({
  text: () => Promise.resolve(resolvedServerVersion)
});

global.fetch = jest.fn().mockImplementation(mockFetchPromise);

describe('dbUtils', () => {

  const downloadUpdateMock = jest.spyOn(dbUtils, "downloadUpdate").mockImplementation(() => Promise.resolve("db file"));
    
  beforeEach(() => {
    // fetch.resetMocks();
  });

  describe('ensureDirExists', () => {

    const makeDirMock = jest.spyOn(FileSystemMock, "makeDirectoryAsync")
    
    beforeEach(() => {
      makeDirMock.mockClear();
    });

    it('should return true and not call makeDirectoryAsync if directory exists', async () => {
      FileSystemMock.getInfoAsync = jest.fn(() => Promise.resolve({ exists: true }));
      const result = await ensureDirExists();
      expect(makeDirMock).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should call makeDirectoryAsync if directory does not exist', async () => {
      FileSystemMock.getInfoAsync = jest.fn(() => Promise.resolve({ exists: false }));
      await ensureDirExists();
      expect(makeDirMock).toHaveBeenCalled();
    });
  });

  describe('checkForUpdate', () => {

    jest.spyOn(dbUtils, "getCurrentDbVersion").mockImplementation(() => Promise.resolve(2));
    jest.spyOn(dbUtils, "setDB");

    beforeEach(() => {
      dbUtils.getCurrentDbVersion.mockClear();
      downloadUpdateMock.mockClear();
    });

    it('calls getCurrentDbVersion', async () => {
      await dbUtils.checkForUpdate();
      expect(dbUtils.getCurrentDbVersion).toHaveBeenCalled();
    });

    it('calls downloadUpdate if the version of the update > current', async () => {
      resolvedServerVersion = "50";
      await dbUtils.checkForUpdate();
      expect(downloadUpdateMock).toHaveBeenCalled();
    });

    it('does not call downloadUpdate if the version of db remote =<', () => {
      resolvedServerVersion = "1";
      return expect(downloadUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe('downloadUpdate', () => {
    beforeEach(() => {
      downloadUpdateMock.mockRestore();
    });

    it("calls downloadAsync", () => {
      dbUtils.downloadUpdate();
      expect(FileSystemMock.downloadAsync).toHaveBeenCalled();
    });

    it("it moves the db file once download is complete", () => {
      return dbUtils.downloadUpdate().then(() => {
        expect(FileSystemMock.moveAsync).toHaveBeenCalled()
      });
    });

    it("sets the db again with setDB", () => {
      return dbUtils.downloadUpdate().then(() => {
        expect(dbUtils.setDB).toHaveBeenCalled()
      })
    });
  });

});


