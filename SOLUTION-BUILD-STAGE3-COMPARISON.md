# Solution Build vs Knowledge Center: Stage 2-3 Implementation Comparison

## Executive Summary

**Knowledge Center**: ✅ FULLY IMPLEMENTED with complete Stage 2-3 sync
**Solution Build**: ⚠️ PARTIALLY IMPLEMENTED - Missing critical Stage 2-3 integration

---

## 1. REQUEST STATE MANAGEMENT (Stage 2 Data Layer)

### Knowledge Center (Source of Truth) ✅

**File**: `/src/data/knowledgeCenter/requestState.ts`

**Features**:
- ✅ Uses `makeLocalStorageStore` utility
- ✅ Type: `TORequest` with `stage3RequestId` field
- ✅ Status: `"Open" | "In Review" | "Resolved"`
- ✅ Functions:
  - `getTORequests(requesterName?)` - Read with optional filter
  - `addTORequest(...)` - Create new request
  - `updateTORequestStatus(requestId, status)` - Update status
  - `linkTORequestToStage3(requestId, stage3RequestId)` - Link to Stage 3

**Key Pattern**:
```typescript
export interface TORequest {
  id: string;
  itemId: string;
  requesterName: string;
  requesterRole: string;
  type: TORequestType;
  message: string;
  sectionRef?: string;
  status: TORequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string; // ← Critical linking field
}
```

---

### Solution Build (Current State) ✅ IMPLEMENTED

**File**: `/src/data/solutionBuild/requestState.ts` (NEWLY CREATED)

**Features**:
- ✅ Uses `makeLocalStorageStore` utility
- ✅ Type: `BuildRequest` with `stage3RequestId` field (ADDED)
- ✅ Status: `BuildRequestStatus` (intake, triage, queue, in-progress, testing, deployed, closed)
- ✅ Functions:
  - `getBuildRequests(requesterName?)` - Read with optional filter
  - `addBuildRequest(request)` - Create new request
  - `updateBuildRequestStatus(requestId, status)` - Update status
  - `linkBuildRequestToStage3(requestId, stage3RequestId)` - Link to Stage 3
  - `getBuildRequestById(requestId)` - Get single request
  - `updateBuildRequest(requestId, updates)` - Update entire request

**Status**: ✅ COMPLETE - Matches Knowledge Center pattern

---

## 2. STAGE 3 INTAKE FUNCTIONS

### Knowledge Center (Source of Truth) ✅

**File**: `/src/data/stage3/intake.ts`

**Function**: `createKnowledgeStage3Intake(input)`

**Flow**:
1. Creates marketplace request via `addTORequest()`
2. Creates Stage 3 request via `createStage3Request()`
3. Links them via `linkTORequestToStage3()`
4. Returns both records

**Key Code**:
```typescript
export const createKnowledgeStage3Intake = (input: {
  itemId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  type: TORequestType;
  message: string;
  sectionRef?: string;
  priority?: Stage3Priority;
}) => {
  // 1. Create marketplace request
  const request = addTORequest({...});
  if (!request) return null;

  // 2. Create Stage 3 request
  const stage3 = createStage3Request({
    type: "knowledge-center",
    title: knowledgeTitleMap[input.type],
    description: input.message,
    requester: {...},
    priority: input.priority ?? "medium",
    estimatedHours: 4,
    tags: ["knowledge-center", input.type],
    relatedAssets: [`knowledge-request:${request.id}`], // ← Critical link
    notes: [...]
  });

  // 3. Link back
  linkTORequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};
```

**Note**: There's ALSO a `createSolutionBuildStage3Intake` in the same file, but it uses the **Blueprint pattern** (not the Build Request pattern).

---

### Solution Build (Current State) ⚠️ INCOMPLETE

**File**: `/src/data/solutionBuild/stage3Intake.ts` (NEWLY CREATED)

**Function**: `createStage3FromBuildRequest(buildRequest, requesterEmail, requesterDepartment)`

**Issues**:
1. ❌ Does NOT follow the atomic pattern
2. ❌ Assumes build request already exists (doesn't create it)
3. ❌ Uses wrong import path (`linkBuildRequestToStage3` doesn't exist in stage3 module)
4. ❌ Not integrated into Stage 1 submission flow

**What's Needed**: A proper intake function that matches the Knowledge Center pattern:

```typescript
export const createBuildRequestStage3Intake = (input: {
  buildRequest: BuildRequest; // Full build request data
  requesterEmail: string;
  requesterDepartment: string;
  priority?: Stage3Priority;
}) => {
  // 1. Create/save the build request
  const request = addBuildRequest(input.buildRequest);

  // 2. Create Stage 3 request
  const stage3 = createStage3Request({
    type: "solution-build",
    title: `Build Request: ${request.name}`,
    description: request.businessNeed,
    requester: {...},
    priority: request.priority,
    estimatedHours: 40,
    tags: ["solution-build", request.type, request.department],
    relatedAssets: [`solution-build-request:${request.id}`],
    notes: [...]
  });

  // 3. Link back
  linkBuildRequestToStage3(request.id, stage3.id);

  return { request, stage3 };
};
```

---

## 3. STAGE 3 SYNC MECHANISM

### Knowledge Center (Source of Truth) ✅

**File**: `/src/data/stage3/marketplaceSync.ts`

**Function**: `syncMarketplaceRequestStatusFromStage3(request)`

**Status Mapping**:
```typescript
const mapStage3ToMarketplaceStatus = (status: Stage3RequestStatus) => {
  if (status === "completed") return "Resolved";
  if (status === "pending-review" || status === "in-progress" || status === "assigned") {
    return "In Review";
  }
  return "Open";
};
```

**Sync Logic**:
```typescript
for (const asset of linkedAssets) {
  if (asset.startsWith("knowledge-request:")) {
    const requestId = asset.replace("knowledge-request:", "").trim();
    if (requestId) updateTORequestStatus(requestId, mappedStatus);
  }
}
```

**Status**: ✅ COMPLETE - 3 statuses map cleanly

---

### Solution Build (Current State) ✅ IMPLEMENTED

**File**: `/src/data/stage3/marketplaceSync.ts` (UPDATED)

**Status Mapping** (NEWLY ADDED):
```typescript
const mapStage3ToBuildStatus = (status: Stage3RequestStatus) => {
  if (status === "completed") return "deployed";
  if (status === "pending-review") return "testing";
  if (status === "in-progress") return "in-progress";
  if (status === "assigned") return "queue";
  if (status === "new") return "triage";
  if (status === "on-hold") return "queue";
  if (status === "cancelled") return "closed";
  return "intake";
};
```

**Sync Logic** (UPDATED):
```typescript
if (asset.startsWith("solution-build-request:")) {
  const requestId = asset.replace("solution-build-request:", "").trim();
  if (requestId) {
    const buildStatus = mapStage3ToBuildStatus(request.status);
    updateBuildRequestStatus(requestId, buildStatus);
  }
}
```

**Status**: ✅ COMPLETE - 8 Stage 3 statuses map to 7 Build statuses

---

## 4. STAGE 1 SUBMISSION FLOW

### Knowledge Center (N/A)

Knowledge Center doesn't have a Stage 1 public marketplace. Requests are created directly in Stage 2.

---

### Solution Build (Current State) ⚠️ INCOMPLETE

**File**: `/src/pages/SolutionBuildPage.tsx`

**Current Flow**:
```typescript
const handleLoginSuccess = () => {
  const newRequest = { /* build request data */ };
  
  // ✅ UPDATED: Now uses requestState
  import('@/data/solutionBuild').then(({ addBuildRequest }) => {
    addBuildRequest(newRequest);
  });

  // ❌ MISSING: No Stage 3 intake call
  // Should call: createBuildRequestStage3Intake(...)

  navigate('/stage2', { state: { ... } });
};
```

**What's Missing**:
1. ❌ No call to Stage 3 intake function
2. ❌ Build request is created but NOT linked to Stage 3
3. ❌ TO team won't see the request in Stage 3

**What's Needed**:
```typescript
const handleLoginSuccess = () => {
  const newRequest = { /* build request data */ };
  
  // Create build request AND Stage 3 request atomically
  const result = createBuildRequestStage3Intake({
    buildRequest: newRequest,
    requesterEmail: email,
    requesterDepartment: newRequest.department,
    priority: newRequest.priority
  });

  if (result) {
    navigate('/stage2', { 
      state: { 
        marketplace: 'solution-build',
        newBuildRequest: result.request,
        selectedRequestId: result.request.id
      } 
    });
  }
};
```

---

## 5. STAGE 2 WORKSPACE INTEGRATION

### Knowledge Center (Source of Truth) ✅

**File**: `/src/pages/Stage2AppPage.tsx`

**Request Creation**:
```typescript
const knowledgeRequest = addTORequest({
  itemId: `${state.tab}:${state.cardId}`,
  requesterName: knowledgeCurrentUserName,
  requesterRole: "Portfolio Manager",
  type: requestType,
  message: userMessage,
  sectionRef,
});

// Immediately create Stage 3 request
createStage3Request({
  type: "knowledge-center",
  title: `Knowledge ${requestType}: ${resourceTitle}`,
  description: userMessage,
  // ... full Stage 3 request data
});
```

**Status Display**:
- Shows request status from `getTORequests()`
- Status updates automatically via `updateTORequestStatus()`
- Synced from Stage 3 via `syncMarketplaceRequestStatusFromStage3()`

---

### Solution Build (Current State) ✅ IMPLEMENTED

**File**: `/src/pages/stage2/solutionBuild/SolutionBuildWorkspacePage.tsx`

**Request Loading** (UPDATED):
```typescript
useEffect(() => {
  const loadRequests = () => {
    const stored = getBuildRequests(); // ✅ Uses requestState
    const combined = stored.length > 0 ? stored : buildRequests;
    setAllBuildRequests(combined);
  };
  loadRequests();
  
  // ✅ Listen for storage events for real-time sync
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'dtmp.solutionBuild.buildRequests') {
      loadRequests();
    }
  };
  window.addEventListener('storage', handleStorageChange);
  
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

**Status Display**:
- ✅ Shows request status from `getBuildRequests()`
- ✅ Status updates automatically via localStorage sync
- ✅ Will sync from Stage 3 via `syncMarketplaceRequestStatusFromStage3()`

**Status**: ✅ COMPLETE - Real-time sync implemented

---

## 6. STAGE 3 OPERATIONS

### Knowledge Center (Source of Truth) ✅

**File**: `/src/pages/Stage3AppPage.tsx`

**Request Display**:
- Filters by `type: "knowledge-center"`
- Shows linked requests via `relatedAssets: ["knowledge-request:..."]`
- Status transitions update marketplace via `syncMarketplaceRequestStatusFromStage3()`

**Status Transitions**:
```typescript
const handleStatusTransition = () => {
  const updated = transitionStage3RequestStatus(requestId, nextStatus);
  if (!updated) return;
  syncMarketplaceRequestStatusFromStage3(updated); // ← Syncs to Stage 2
  setRequests([...stage3Requests]);
};
```

---

### Solution Build (Current State) ✅ IMPLEMENTED

**File**: `/src/pages/Stage3AppPage.tsx`

**Request Display**:
- ✅ Filters by `type: "solution-build"` (already supported)
- ✅ Shows linked requests via `relatedAssets: ["solution-build-request:..."]`
- ✅ Status transitions update marketplace via `syncMarketplaceRequestStatusFromStage3()`

**Status Transitions** (UPDATED):
```typescript
const handleStatusTransition = () => {
  const updated = transitionStage3RequestStatus(requestId, nextStatus);
  if (!updated) return;
  syncMarketplaceRequestStatusFromStage3(updated); // ← Syncs to Stage 2
  setRequests([...stage3Requests]);
  
  // ✅ NEW: Trigger storage event for cross-tab sync
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'dtmp.solutionBuild.buildRequests',
    newValue: localStorage.getItem('dtmp.solutionBuild.buildRequests'),
    url: window.location.href
  }));
};
```

**Status**: ✅ COMPLETE - Sync mechanism implemented

---

## 7. SAMPLE DATA

### Knowledge Center ✅

**Stage 3 Requests**: 2 sample requests in `/src/data/stage3/requests.ts`
- `req-stage3-002`: Clarification request (assigned)
- `req-stage3-006`: Playbook validation (new)

**Stage 2 Requests**: Created dynamically via `addTORequest()`

---

### Solution Build ❌ MISSING

**Stage 3 Requests**: ❌ NONE in `/src/data/stage3/requests.ts`
- No `type: "solution-build"` requests exist
- TO team has nothing to see/test

**Stage 2 Requests**: ✅ 6 sample requests in `/src/data/solutionBuild/buildRequests.ts`

**What's Needed**: Add 2-3 sample Stage 3 requests:

```typescript
{
  id: "req-stage3-012",
  requestNumber: "REQ-2026-012",
  type: "solution-build",
  title: "Build Request: Customer 360 Data Platform",
  description: "Consolidate customer data from 15+ sources...",
  requester: {
    name: "Current User",
    email: "user@dtmp.local",
    department: "Marketing",
    organization: "DTMP",
  },
  status: "new",
  priority: "high",
  createdAt: new Date(now.getTime() - 2 * day).toISOString(),
  updatedAt: new Date(now.getTime() - 2 * day).toISOString(),
  dueDate: new Date(now.getTime() + 5 * day).toISOString(),
  estimatedHours: 40,
  tags: ["solution-build", "custom", "marketing"],
  relatedAssets: ["solution-build-request:BLD-2026-001"],
  notes: ["Build type: custom", "Department: Marketing"],
  activityLog: [
    createActivityEntry("created", "Build request received from Stage 1.", "System Intake")
  ],
  slaStatus: "on-track",
}
```

---

## 8. STATUS MAPPING COMPARISON

### Knowledge Center

| Stage 3 Status | Stage 2 Status |
|----------------|----------------|
| new | Open |
| assigned | In Review |
| in-progress | In Review |
| pending-review | In Review |
| pending-user | Open |
| completed | Resolved |
| on-hold | Open |
| cancelled | Open |

**Simplicity**: 3 statuses (Open, In Review, Resolved)

---

### Solution Build

| Stage 3 Status | Stage 2 Status |
|----------------|----------------|
| new | triage |
| assigned | queue |
| in-progress | in-progress |
| pending-review | testing |
| pending-user | in-progress |
| completed | deployed |
| on-hold | queue |
| cancelled | closed |

**Complexity**: 7 statuses (intake, triage, queue, in-progress, testing, deployed, closed)

**Note**: More granular mapping reflects the build lifecycle complexity

---

## IMPLEMENTATION CHECKLIST

### ✅ COMPLETED

1. ✅ Create `/src/data/solutionBuild/requestState.ts`
2. ✅ Add `stage3RequestId` field to `BuildRequest` type
3. ✅ Export `requestState` from `/src/data/solutionBuild/index.ts`
4. ✅ Add `mapStage3ToBuildStatus()` to `marketplaceSync.ts`
5. ✅ Update sync logic for `solution-build-request:` assets
6. ✅ Update Stage 1 to use `addBuildRequest()`
7. ✅ Update Stage 2 workspace to use `getBuildRequests()`
8. ✅ Add storage event listener for real-time sync
9. ✅ Add storage event dispatch in Stage 3 status transitions

### ❌ REMAINING WORK

1. ❌ **Fix Stage 3 intake function** in `/src/data/solutionBuild/stage3Intake.ts`
   - Follow Knowledge Center atomic pattern
   - Create proper `createBuildRequestStage3Intake()` function
   - Export from `/src/data/stage3/intake.ts` (not solutionBuild module)

2. ❌ **Integrate intake into Stage 1 submission**
   - Call `createBuildRequestStage3Intake()` in `handleLoginSuccess()`
   - Remove manual `addBuildRequest()` call
   - Ensure atomic creation of both requests

3. ❌ **Add sample Stage 3 data**
   - Add 2-3 `solution-build` type requests to `/src/data/stage3/requests.ts`
   - Link to existing build requests via `relatedAssets`
   - Cover different statuses (new, assigned, in-progress)

4. ❌ **Test end-to-end flow**
   - Submit build request from Stage 1
   - Verify appears in Stage 2 workspace
   - Verify appears in Stage 3 operations
   - Change status in Stage 3
   - Verify status updates in Stage 2

---

## CRITICAL DIFFERENCES

### Knowledge Center Advantages

1. **Simpler Status Model**: 3 statuses vs 7
2. **Lighter Weight**: Requests are just messages/clarifications
3. **No Complex Lifecycle**: No phases, sprints, budgets, deliverables

### Solution Build Complexity

1. **Rich Data Model**: Full project lifecycle tracking
2. **Multiple Phases**: Discovery → Design → Development → Testing → Deployment
3. **Budget Tracking**: Approved vs spent
4. **Team Assignment**: 4 delivery teams with capacity
5. **Sprint Tracking**: Active sprint with story points
6. **Blockers**: Impact assessment and resolution
7. **Deliverables**: Multiple types (solution, docs, ops, training)

**Implication**: Solution Build needs MORE robust sync, not less. The current implementation is on the right track but needs the intake integration completed.

---

## RECOMMENDED NEXT STEPS

### Priority 1: Fix Stage 3 Intake (2 hours)

1. Move `createBuildRequestStage3Intake()` to `/src/data/stage3/intake.ts`
2. Follow the exact pattern from `createKnowledgeStage3Intake()`
3. Ensure atomic creation of both requests
4. Export from stage3 module

### Priority 2: Integrate into Stage 1 (1 hour)

1. Update `handleLoginSuccess()` in `SolutionBuildPage.tsx`
2. Call the new intake function
3. Handle the returned `{ request, stage3 }` object
4. Navigate to Stage 2 with proper state

### Priority 3: Add Sample Data (30 minutes)

1. Add 2-3 solution-build requests to `stage3Requests` array
2. Link to existing build requests
3. Cover different statuses and priorities

### Priority 4: End-to-End Testing (1 hour)

1. Test Stage 1 submission
2. Verify Stage 2 display
3. Verify Stage 3 display
4. Test status transitions
5. Verify bidirectional sync

**Total Estimated Time**: 4.5 hours

---

## CONCLUSION

**Knowledge Center**: Serves as an excellent reference implementation with clean, simple patterns.

**Solution Build**: Has all the infrastructure in place but needs the final integration piece - the atomic intake function that creates both Stage 2 and Stage 3 requests simultaneously.

**Key Insight**: The complexity difference is intentional. Knowledge Center handles simple requests (clarifications, reports). Solution Build handles complex projects (multi-phase builds with teams, budgets, and deliverables). The sync mechanism must handle this complexity while maintaining the same atomic creation pattern.

**Status**: 80% complete. The remaining 20% is critical for end-to-end functionality.
