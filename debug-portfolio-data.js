// Debug script to check portfolio data storage
// Run this in browser console to see what's stored

console.log("=== PORTFOLIO DATA DEBUG ===");

// Check localStorage for portfolio requests
const portfolioKey = "dtmp.portfolio.toRequests";
const storedData = localStorage.getItem(portfolioKey);

console.log("1. Portfolio localStorage key:", portfolioKey);
console.log("2. Raw stored data:", storedData);

if (storedData) {
  try {
    const parsed = JSON.parse(storedData);
    console.log("3. Parsed portfolio requests:", parsed);
    console.log("4. Number of requests:", parsed.length);
    
    // Look for kevin.kenei requests
    const kevinRequests = parsed.filter(req => 
      req.requesterName?.toLowerCase().includes('kevin') || 
      req.requesterEmail?.includes('kevin.kenei@digitalqatalyst.com')
    );
    console.log("5. Kevin's requests:", kevinRequests);
  } catch (e) {
    console.error("Error parsing stored data:", e);
  }
} else {
  console.log("3. No portfolio data found in localStorage");
}

// Check all localStorage keys for debugging
console.log("6. All localStorage keys:", Object.keys(localStorage));

// Function to add a test request for Kevin
window.addKevinTestRequest = function() {
  const testRequest = {
    id: `portfolio-request-${Date.now()}-kevin`,
    serviceId: "application-health-dashboard",
    requesterName: "Kevin Kenei",
    requesterRole: "Digital Catalyst",
    type: "consultation",
    message: "Test request from kevin.kenei@digitalqatalyst.com for debugging purposes",
    portfolioScope: "Application",
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requestTitle: "Kevin's Test Request",
    priority: "Medium",
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 0
  };
  
  const existing = JSON.parse(localStorage.getItem(portfolioKey) || '[]');
  existing.unshift(testRequest);
  localStorage.setItem(portfolioKey, JSON.stringify(existing));
  
  console.log("Added test request for Kevin:", testRequest);
  return testRequest;
};

console.log("7. Run addKevinTestRequest() to add a test request");