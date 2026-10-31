import { describe, expect, it } from "vitest";
import {
  SEARCH_TYPE_LABELS,
  searchTypeLabel,
} from "@/lib/cms/search-labels";

describe("searchTypeLabel and SEARCH_TYPE_LABELS", () => {
  it("defines readable labels for all known search result types", () => {
    expect(SEARCH_TYPE_LABELS.post).toBe("Article");
    expect(SEARCH_TYPE_LABELS.course).toBe("Course");
    expect(SEARCH_TYPE_LABELS.service).toBe("Service");
    expect(SEARCH_TYPE_LABELS.event).toBe("Event");
    expect(SEARCH_TYPE_LABELS.publication).toBe("Publication");
  });

  it("returns human-readable label for mapped search types", () => {
    expect(searchTypeLabel("post")).toBe("Article");
    expect(searchTypeLabel("course")).toBe("Course");
    expect(searchTypeLabel("service")).toBe("Service");
    expect(searchTypeLabel("event")).toBe("Event");
    expect(searchTypeLabel("publication")).toBe("Publication");
  });

  it("falls back to the raw string when type is not in SEARCH_TYPE_LABELS", () => {
    expect(searchTypeLabel("scholar")).toBe("scholar");
    expect(searchTypeLabel("customCategory")).toBe("customCategory");
  });
});

