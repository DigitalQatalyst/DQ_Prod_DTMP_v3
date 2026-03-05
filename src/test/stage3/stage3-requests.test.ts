import { beforeEach, describe, expect, it } from "vitest";
import {
  stage3Requests,
  stage3TeamMembers,
  createStage3Request,
  assignStage3Request,
  unassignStage3Request,
  transitionStage3RequestStatus,
  getAvailableStage3Transitions,
  appendStage3RequestNote,
} from "@/data/stage3/requests";

// Reset the in-memory array before every test so tests don't bleed into each other
beforeEach(() => {
  stage3Requests.length = 0;
});

// ─── createStage3Request ──────────────────────────────────────────────────────

describe("createStage3Request", () => {
  it("creates a request with status new and slaStatus on-track", () => {
    const req = createStage3Request({
      type: "knowledge-center",
      title: "Test request",
      description: "A test",
      requester: { name: "Alice", email: "alice@dtmp.local", department: "Eng", organization: "DTMP" },
      priority: "medium",
      estimatedHours: 4,
      tags: ["test"],
    });
    expect(req.status).toBe("new");
    expect(req.slaStatus).toBe("on-track");
  });

  it("generates a unique id and requestNumber per call", () => {
    const a = createStage3Request({
      type: "knowledge-center", title: "A", description: "A",
      requester: { name: "A", email: "a@dtmp.local", department: "D", organization: "DTMP" },
      priority: "low", estimatedHours: 1, tags: [],
    });
    const b = createStage3Request({
      type: "learning-center", title: "B", description: "B",
      requester: { name: "B", email: "b@dtmp.local", department: "D", organization: "DTMP" },
      priority: "low", estimatedHours: 1, tags: [],
    });
    expect(a.id).not.toBe(b.id);
    expect(a.requestNumber).not.toBe(b.requestNumber);
  });

  it("stores the request in the stage3Requests array", () => {
    createStage3Request({
      type: "knowledge-center", title: "Stored", description: "check",
      requester: { name: "Bob", email: "bob@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 2, tags: [],
    });
    expect(stage3Requests).toHaveLength(1);
  });

  it("records a created activity log entry", () => {
    const req = createStage3Request({
      type: "learning-center", title: "Log test", description: "check",
      requester: { name: "Carol", email: "carol@dtmp.local", department: "D", organization: "DTMP" },
      priority: "high", estimatedHours: 3, tags: [],
    });
    expect(req.activityLog).toHaveLength(1);
    expect(req.activityLog[0].action).toBe("created");
    expect(req.activityLog[0].actor).toBe("System Intake");
  });

  it("sets relatedAssets and notes from input", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Assets test", description: "check",
      requester: { name: "Dan", email: "dan@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
      relatedAssets: ["knowledge-request:abc123"],
      notes: ["Initial note."],
    });
    expect(req.relatedAssets).toContain("knowledge-request:abc123");
    expect(req.notes).toContain("Initial note.");
  });
});

// ─── assignStage3Request ──────────────────────────────────────────────────────

describe("assignStage3Request", () => {
  it("assigns a new request to a team member and transitions status to assigned", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Assign test", description: "check",
      requester: { name: "Eve", email: "eve@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    const member = stage3TeamMembers[0];
    const result = assignStage3Request(req.id, member.id);
    expect(result).not.toBeNull();
    expect(result!.status).toBe("assigned");
    expect(result!.assignedTo).toBe(member.name);
    expect(result!.assignedTeam).toBe(member.team);
  });

  it("adds an assigned activity log entry", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Activity test", description: "check",
      requester: { name: "Frank", email: "frank@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    assignStage3Request(req.id, stage3TeamMembers[0].id);
    expect(req.activityLog[0].action).toBe("assigned");
  });

  it("returns null for unknown request id", () => {
    expect(assignStage3Request("nonexistent", stage3TeamMembers[0].id)).toBeNull();
  });

  it("returns null for unknown member id", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Bad member", description: "check",
      requester: { name: "Grace", email: "grace@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    expect(assignStage3Request(req.id, "nonexistent-member")).toBeNull();
  });

  it("does not change status if already in-progress", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Already active", description: "check",
      requester: { name: "Hank", email: "hank@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    assignStage3Request(req.id, stage3TeamMembers[0].id);
    transitionStage3RequestStatus(req.id, "in-progress");
    assignStage3Request(req.id, stage3TeamMembers[1].id);
    expect(req.status).toBe("in-progress");
  });
});

// ─── unassignStage3Request ────────────────────────────────────────────────────

describe("unassignStage3Request", () => {
  it("clears assignment and reverts assigned → new", () => {
    const req = createStage3Request({
      type: "learning-center", title: "Unassign test", description: "check",
      requester: { name: "Iris", email: "iris@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    assignStage3Request(req.id, stage3TeamMembers[0].id);
    expect(req.status).toBe("assigned");
    unassignStage3Request(req.id);
    expect(req.status).toBe("new");
    expect(req.assignedTo).toBeUndefined();
    expect(req.assignedTeam).toBeUndefined();
  });

  it("does not revert status if it was not assigned", () => {
    const req = createStage3Request({
      type: "learning-center", title: "In-progress unassign", description: "check",
      requester: { name: "Jack", email: "jack@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    assignStage3Request(req.id, stage3TeamMembers[0].id);
    transitionStage3RequestStatus(req.id, "in-progress");
    unassignStage3Request(req.id);
    expect(req.status).toBe("in-progress");
  });

  it("returns null for unknown request id", () => {
    expect(unassignStage3Request("nonexistent")).toBeNull();
  });
});

// ─── transitionStage3RequestStatus ───────────────────────────────────────────

describe("transitionStage3RequestStatus", () => {
  it("follows allowed transitions from new", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Transition test", description: "check",
      requester: { name: "Kay", email: "kay@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    const result = transitionStage3RequestStatus(req.id, "on-hold");
    expect(result!.status).toBe("on-hold");
  });

  it("rejects invalid transitions", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Bad transition", description: "check",
      requester: { name: "Leo", email: "leo@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    // new → completed is not allowed
    const result = transitionStage3RequestStatus(req.id, "completed");
    expect(result).toBeNull();
    expect(req.status).toBe("new");
  });

  it("sets completedAt when transitioning to completed", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Complete test", description: "check",
      requester: { name: "Mia", email: "mia@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    assignStage3Request(req.id, stage3TeamMembers[0].id);
    transitionStage3RequestStatus(req.id, "in-progress");
    transitionStage3RequestStatus(req.id, "pending-review");
    transitionStage3RequestStatus(req.id, "completed");
    expect(req.completedAt).toBeTruthy();
  });

  it("clears completedAt when moving away from completed is not possible (terminal)", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Terminal test", description: "check",
      requester: { name: "Ned", email: "ned@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    assignStage3Request(req.id, stage3TeamMembers[0].id);
    transitionStage3RequestStatus(req.id, "in-progress");
    transitionStage3RequestStatus(req.id, "pending-review");
    transitionStage3RequestStatus(req.id, "completed");
    // completed is terminal — attempt to leave it should be rejected
    const attempt = transitionStage3RequestStatus(req.id, "in-progress");
    expect(attempt).toBeNull();
    expect(req.status).toBe("completed");
  });

  it("records a status-changed activity entry", () => {
    const req = createStage3Request({
      type: "learning-center", title: "Activity status test", description: "check",
      requester: { name: "Olivia", email: "olivia@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    transitionStage3RequestStatus(req.id, "cancelled");
    expect(req.activityLog[0].action).toBe("status-changed");
    expect(req.activityLog[0].detail).toContain("cancelled");
  });

  it("returns null for unknown request id", () => {
    expect(transitionStage3RequestStatus("nonexistent", "assigned")).toBeNull();
  });
});

// ─── getAvailableStage3Transitions ────────────────────────────────────────────

describe("getAvailableStage3Transitions", () => {
  it("returns correct transitions for new", () => {
    expect(getAvailableStage3Transitions("new")).toEqual(
      expect.arrayContaining(["assigned", "cancelled", "on-hold"])
    );
  });

  it("returns empty array for completed (terminal state)", () => {
    expect(getAvailableStage3Transitions("completed")).toHaveLength(0);
  });

  it("returns empty array for cancelled (terminal state)", () => {
    expect(getAvailableStage3Transitions("cancelled")).toHaveLength(0);
  });
});

// ─── appendStage3RequestNote ──────────────────────────────────────────────────

describe("appendStage3RequestNote", () => {
  it("adds a note and activity log entry", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Note test", description: "check",
      requester: { name: "Pam", email: "pam@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    appendStage3RequestNote(req.id, "Follow up with requester.");
    expect(req.notes[0]).toBe("Follow up with requester.");
    expect(req.activityLog[0].action).toBe("note-added");
  });

  it("trims whitespace from the note", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Trim note", description: "check",
      requester: { name: "Quinn", email: "quinn@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    appendStage3RequestNote(req.id, "   Trimmed note.   ");
    expect(req.notes[0]).toBe("Trimmed note.");
  });

  it("returns null for an empty note after trimming", () => {
    const req = createStage3Request({
      type: "knowledge-center", title: "Empty note", description: "check",
      requester: { name: "Ray", email: "ray@dtmp.local", department: "D", organization: "DTMP" },
      priority: "medium", estimatedHours: 4, tags: [],
    });
    expect(appendStage3RequestNote(req.id, "   ")).toBeNull();
    expect(req.notes).toHaveLength(0);
  });

  it("returns null for unknown request id", () => {
    expect(appendStage3RequestNote("nonexistent", "note")).toBeNull();
  });
});
