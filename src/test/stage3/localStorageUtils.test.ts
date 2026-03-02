import { beforeEach, describe, expect, it } from "vitest";
import {
  parseJson,
  readLocalStorage,
  writeLocalStorage,
  makeLocalStorageStore,
} from "@/data/shared/localStorageUtils";

beforeEach(() => {
  window.localStorage.clear();
});

// ─── parseJson ────────────────────────────────────────────────────────────────

describe("parseJson", () => {
  it("parses valid JSON", () => {
    expect(parseJson<number[]>("[1,2,3]", [])).toEqual([1, 2, 3]);
  });

  it("returns fallback for null input", () => {
    expect(parseJson<string[]>(null, ["default"])).toEqual(["default"]);
  });

  it("returns fallback for malformed JSON", () => {
    expect(parseJson<object>("{bad json", {})).toEqual({});
  });
});

// ─── readLocalStorage ─────────────────────────────────────────────────────────

describe("readLocalStorage", () => {
  it("returns fallback when key is absent", () => {
    expect(readLocalStorage<string[]>("missing-key", [])).toEqual([]);
  });

  it("returns parsed value when key is present", () => {
    window.localStorage.setItem("test-key", JSON.stringify({ id: "abc" }));
    expect(readLocalStorage<{ id: string }>("test-key", { id: "" })).toEqual({ id: "abc" });
  });
});

// ─── writeLocalStorage ────────────────────────────────────────────────────────

describe("writeLocalStorage", () => {
  it("persists items to localStorage", () => {
    writeLocalStorage("my-key", [1, 2, 3], 10);
    const raw = window.localStorage.getItem("my-key");
    expect(JSON.parse(raw!)).toEqual([1, 2, 3]);
  });

  it("enforces the item limit by slicing from the front", () => {
    writeLocalStorage("capped-key", [1, 2, 3, 4, 5], 3);
    const stored = JSON.parse(window.localStorage.getItem("capped-key")!);
    expect(stored).toHaveLength(3);
    expect(stored).toEqual([1, 2, 3]);
  });
});

// ─── makeLocalStorageStore ────────────────────────────────────────────────────

describe("makeLocalStorageStore", () => {
  it("reads an empty array when the store is uninitialised", () => {
    const store = makeLocalStorageStore<string>("uninit-store", 100);
    expect(store.read()).toEqual([]);
  });

  it("round-trips items through write then read", () => {
    const store = makeLocalStorageStore<{ id: number }>("rt-store", 100);
    store.write([{ id: 1 }, { id: 2 }]);
    expect(store.read()).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("enforces the limit on write", () => {
    const store = makeLocalStorageStore<number>("limit-store", 2);
    store.write([10, 20, 30, 40]);
    expect(store.read()).toHaveLength(2);
    expect(store.read()).toEqual([10, 20]);
  });

  it("two stores with different keys do not share data", () => {
    const storeA = makeLocalStorageStore<string>("store-a", 10);
    const storeB = makeLocalStorageStore<string>("store-b", 10);
    storeA.write(["alpha"]);
    storeB.write(["beta"]);
    expect(storeA.read()).toEqual(["alpha"]);
    expect(storeB.read()).toEqual(["beta"]);
  });

  it("overwrites previous data on subsequent writes", () => {
    const store = makeLocalStorageStore<number>("overwrite-store", 10);
    store.write([1, 2, 3]);
    store.write([99]);
    expect(store.read()).toEqual([99]);
  });
});
