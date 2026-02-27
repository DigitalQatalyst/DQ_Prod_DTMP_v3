# Stage 2 Integration Quick Reference

## What Needs to Be Added to Stage2AppPage.tsx

### 1. Import Solution Build Data
```typescript
import { buildRequests } from "@/data/solutionBuild";
```

### 2. Add to Left Sidebar Navigation
In the left sidebar services section, add:
```typescript
<button 
  onClick={() => handleServiceClick("Solution Build")}
  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Solution Build")}`}
  title="Solution Build"
>
  <Hammer className="w-4 h-4 flex-shrink-0" />
  {!leftSidebarCollapsed && "Solution Build"}
</button>
```

### 3. Add to Middle Sidebar (Context Panel)
When Solution Build is active, show:
```typescript
{activeService === "Solution Build" && (
  <div className="space-y-2">
    <button
      onClick={() => setActiveBuildTab("my-requests")}
      className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
        activeBuildTab === "my-requests"
          ? "bg-orange-50 text-orange-700 border border-orange-200"
          : "text-gray-700 hover:bg-gray-50 border border-transparent"
      }`}
    >
      <div className="text-left">
        <div className="font-medium">My Build Requests</div>
        <div className="text-xs text-gray-500 mt-0.5">Track your solution builds</div>
      </div>
    </button>
  </div>
)}
```

### 4. Add Main Content Area
In the main content area, add:
```typescript
{activeService === "Solution Build" && (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Build Requests</h2>
    
    {/* Filter Tabs */}
    <div className="flex gap-2 mb-6">
      {['all', 'intake', 'triage', 'queue', 'in-progress', 'testing', 'deployed'].map((status) => (
        <Button
          key={status}
          variant={buildStatusFilter === status ? "default" : "outline"}
          onClick={() => setBuildStatusFilter(status)}
          className="capitalize"
        >
          {status.replace('-', ' ')}
        </Button>
      ))}
    </div>

    {/* Requests Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBuildRequests.map((request) => (
        <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
            <span className="text-sm text-gray-500">{request.progress}%</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {request.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Department:</span>
              <span className="font-medium">{request.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Priority:</span>
              <Badge variant={getPriorityVariant(request.priority)}>
                {request.priority}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Team:</span>
              <span className="font-medium">{request.assignedTeam || 'Not assigned'}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${request.progress}%` }}
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => handleViewRequestDetail(request.id)}
          >
            View Details
          </Button>
        </div>
      ))}
    </div>

    {/* Empty State */}
    {filteredBuildRequests.length === 0 && (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No build requests found</p>
        <Button onClick={() => navigate('/marketplaces/solution-build')}>
          Browse Solutions
        </Button>
      </div>
    )}
  </div>
)}
```

### 5. Add State Management
```typescript
const [activeBuildTab, setActiveBuildTab] = useState<'my-requests'>('my-requests');
const [buildStatusFilter, setBuildStatusFilter] = useState<string>('all');

// Filter build requests for current user
const currentUser = "John Doe"; // Get from auth context
const myBuildRequests = buildRequests.filter(req => req.requestedBy === currentUser);

const filteredBuildRequests = buildStatusFilter === 'all'
  ? myBuildRequests
  : myBuildRequests.filter(req => req.status.toLowerCase() === buildStatusFilter);
```

### 6. Helper Functions
```typescript
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    intake: "bg-gray-100 text-gray-800",
    triage: "bg-blue-100 text-blue-800",
    queue: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-purple-100 text-purple-800",
    testing: "bg-orange-100 text-orange-800",
    deployed: "bg-green-100 text-green-800",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const getPriorityVariant = (priority: string) => {
  if (priority === 'critical') return 'destructive';
  if (priority === 'high') return 'default';
  return 'secondary';
};

const handleViewRequestDetail = (requestId: string) => {
  // Navigate to request detail view or open modal
  console.log('View request:', requestId);
};
```

## Testing Checklist

After integration:

1. ✅ Solution Build appears in left sidebar
2. ✅ Clicking opens "My Build Requests" view
3. ✅ Requests are filtered to current user only
4. ✅ Status filter tabs work correctly
5. ✅ Progress bars display correctly
6. ✅ Request cards show all key information
7. ✅ "View Details" button works
8. ✅ Empty state shows when no requests
9. ✅ "Browse Solutions" button redirects to Stage 1

## Data Structure Reference

Each build request has:
```typescript
{
  id: string;
  title: string;
  type: 'custom' | 'pre-built' | 'enhancement' | 'integration';
  status: 'intake' | 'triage' | 'queue' | 'in-progress' | 'testing' | 'deployed';
  progress: number; // 0-100
  priority: 'critical' | 'high' | 'medium';
  department: string;
  requestedBy: string;
  requestedDate: string;
  targetDate?: string;
  assignedTeam?: string;
  budget?: {
    approved: number;
    spent: number;
  };
  phases: {
    discovery: { status: string; progress: number };
    design: { status: string; progress: number };
    development: { status: string; progress: number };
    testing: { status: string; progress: number };
    deployment: { status: string; progress: number };
  };
  requirements: Array<{ id: string; description: string; status: string }>;
  deliverables: Array<{ id: string; name: string; status: string }>;
  messages: Array<{ id: string; from: string; message: string; timestamp: string }>;
  documents: Array<{ id: string; name: string; uploadedBy: string; uploadedAt: string }>;
  blockers: Array<{ id: string; description: string; severity: string; status: string }>;
}
```

## Quick Copy-Paste Snippets

### Import Statement
```typescript
import { buildRequests } from "@/data/solutionBuild";
import { Hammer } from "lucide-react";
```

### Service Click Handler
```typescript
if (service === "Solution Build") {
  setActiveSubService("my-requests");
}
```

### Navigation Helper
```typescript
const handleBrowseSolutions = () => {
  navigate('/marketplaces/solution-build');
};
```

## Complete Integration Time Estimate
- Adding imports and state: 5 minutes
- Adding sidebar navigation: 10 minutes
- Adding main content area: 20 minutes
- Testing and debugging: 15 minutes
- **Total: ~50 minutes**

## Support
Refer to `SOLUTION-BUILD-MIGRATION-GUIDE.md` for complete documentation.
