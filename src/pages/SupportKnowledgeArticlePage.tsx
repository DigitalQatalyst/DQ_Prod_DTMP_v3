import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Eye, CheckCircle, Tag, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { knowledgeArticles, KnowledgeArticle } from "@/data/supportData";

interface KnowledgeDetailContent {
  stepByStepActions: string[];
  keyTakeaways: string[];
  fullGuidance: string;
  whyThisMatters: string;
  signalsToWatch: string;
  ifIssuesPersist: string;
}

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const withPeriod = (value: string) => (/[.!?]$/.test(value) ? value : `${value}.`);

const knowledgeDetailOverrides: Record<string, Partial<KnowledgeDetailContent>> = {
  "KB-00101": {
    stepByStepActions: [
      "Navigate to the official Microsoft 365 password reset portal at https://passwordreset.microsoftonline.com.",
      "Enter your full organizational email address and complete the CAPTCHA verification to proceed.",
      "Select your preferred verification method: SMS to your registered mobile, a call, or an notification via the Authenticator app.",
      "Enter the 6-digit verification code received or approve the notification on your mobile device.",
      "Create a new password that meets the DTMP complexity requirements: minimum 14 characters, including uppercase, lowercase, numbers, and symbols.",
      "Confirm the new password and wait for the success message before attempting to log in.",
      "Update your password on all mobile devices and saved browser credentials to avoid account lockout from old credentials.",
    ],
    keyTakeaways: [
      "Self-service password reset (SSPR) is the fastest way to regain access without waiting for a support ticket.",
      "DTMP passwords must be at least 14 characters and refreshed every 90 days as per security policy.",
      "MFA must be configured before an account becomes locked to use the self-service portal.",
    ],
    fullGuidance:
      "Account access is the cornerstone of productivity in the DTMP ecosystem. We utilize Microsoft 365 Azure AD (Entra ID) for identity management. The self-service portal is available 24/7 and supports multiple MFA methods. If you have not registered your mobile number or the Authenticator app previously, you will need to contact the IT Service Desk for a manual reset. Always ensure your backup contact information is up to date in your user profile to prevent future access delays.",
    whyThisMatters:
      "Password-related issues account for 30% of helpdesk volume. Reducing this through self-service allows the Transformation Office to focus on high-value platform initiatives rather than routine maintenance.",
    signalsToWatch:
      "Watch for 'Account Locked' messages after three failed attempts. This often signals that a background application or mobile device is still trying to authenticate with a stale password after a recent change.",
    ifIssuesPersist:
      "If the portal indicates your account is not enabled for SSPR or you do not receive verification codes, capture a screenshot of the error and submit a Technical Support request focusing on 'Identity & Access'.",
  },
  "KB-00105": {
    stepByStepActions: [
      "Verify you have a stable internet connection on both your computer and your MFA mobile device.",
      "Check the system time on your mobile device; if the time is out of sync by more than 30 seconds, TOTP tokens will fail.",
      "Open the Microsoft Authenticator app and navigate to the 'Notifications' or 'Activity' tab to see if a request is pending.",
      "If using SMS, check your mobile signal strength; delays in carrier delivery are the most common cause of timeout errors.",
      "Use the 'I can't use my app right now' link on the login screen to try an alternative MFA method like a phone call or backup email.",
      "If you have a new phone, you must transfer your MFA credentials using the cloud backup feature or contact IT for a re-enrollment.",
    ],
    keyTakeaways: [
      "Time synchronization on your mobile device is critical for token-based MFA methods.",
      "Always have at least two MFA methods configured (e.g., App and SMS) to avoid being completely locked out.",
      "New device setups require a manual re-enrollment if cloud backup was not enabled.",
    ],
    fullGuidance:
      "Multi-Factor Authentication (MFA) is our primary defense against credential theft. Most lockouts occur due to device desynchronization, carrier delays for SMS, or recent hardware changes. The 'lockout' state is often temporary and will reset after 60 minutes of no activity. However, if the underlying cause is a token mismatch, waiting will not resolve the issue. In these cases, verifying your device's date/time settings and ensuring the app is updated to the latest version are the first diagnostic steps.",
    whyThisMatters:
      "Securing the Digital Business Platform (DBP) requires 100% MFA compliance. Lockouts, while frustrating, are a signal that the security boundary is functioning. Efficiently resolving them maintains both security and organizational momentum.",
    signalsToWatch:
      "Frequent 'Invalid Code' errors even when entered correctly are a strong signal of clock skew. If you receive MFA prompts you did not initiate, this is a signal of a credential compromise; notify Security immediately.",
    ifIssuesPersist:
      "Capture the specific error code (e.g., 500121) and your device model. Submit a support request referencing KB-00105 for priority routing to the Identity Team.",
  },
  "KB-00115": {
    stepByStepActions: [
      "Open the GlobalProtect client and click the settings (gear) icon, then select 'Check for Updates'.",
      "If an update is available, install version 6.0.3 or higher and restart your machine to ensure all kernel drivers are loaded.",
      "In the GlobalProtect settings, navigate to the 'Troubleshooting' tab and click 'Clear All' to reset the local configuration cache.",
      "Verify that your local firewall or antivirus is not blocking the GlobalProtect service (PanGPS.exe).",
      "Switch to a different VPN gateway (Portal) if your current one shows high latency or packet loss.",
      "Disable 'IPv6' on your local network adapter if you are on a home network that does not fully support it, as this can cause tunnel drops.",
    ],
    keyTakeaways: [
      "VPN instability is frequently caused by stale configuration files or outdated client versions.",
      "Running version 6.0.3+ is mandatory for compatibility with our latest security gateways.",
      "Local MTU issues or IPv6 conflicts at home are common root causes for 'dropping' connections.",
    ],
    fullGuidance:
      "The DTMP VPN infrastructure uses GlobalProtect to provide a secure tunnel to enterprise resources. Instability usually manifests as session drops every 10-30 minutes. This is often due to 'tunnel flapping' where the client and gateway cannot agree on a consistent encryption state. Updating to the latest client version ensures you have the most resilient drivers. If you are working from a public network (like an airport or hotel), the network itself may be terminating the connection prematurely.",
    whyThisMatters:
      "Reliable remote access is essential for our distributed workforce. VPN drops directly disrupt real-time collaboration and development activities on the DBP.",
    signalsToWatch:
      "Watch for the 'Connecting...' status cycling repeatedly. If your connection drops only when using high-bandwidth apps (like video calls), it signals a local bandwidth or MTU issue rather than a VPN fault.",
    ifIssuesPersist:
      "Run the 'Collect Logs' utility within GlobalProtect and attach the resulting ZIP file to a Technical Support request. Note your current ISP and location.",
  },
  "KB-00120": {
    stepByStepActions: [
      "Check the 'Outbound Queue' in the mail gateway admin console to see if the message is actually sent or stuck internally.",
      "Run a lookup of your sending domain at 'mxtoolbox.com' to verify SPF, DKIM, and DMARC records are valid and published.",
      "Review the NDR (Non-Delivery Report) for specific SMTP error codes; look for '550' (Rejected) or '421' (Temporary Failure).",
      "Verify if your sending IP address has been added to any major RBLs (Real-time Blackhole Lists) like Spamhaus.",
      "Confirm that the recipient domain is not performing 'Greylisting', which intentionally delays first-time senders.",
      "Test sending a plain-text email without attachments to the same recipient to rule out content-based filtering.",
    ],
    keyTakeaways: [
      "Email delivery failures are most often caused by missing or incorrect DMARC/DKIM signatures.",
      "Monitoring the outbound queue provides immediate visibility into whether the issue is internal or external.",
      "SMTP error codes in NDRs are the primary diagnostic tool for resolving delivery delays.",
    ],
    fullGuidance:
      "Outbound email delivery follows a specific chain of trust. If a recipient server cannot verify that our server is authorized to send for the domain (via SPF/DKIM), it will either delay, junk, or reject the mail. As we migrate to the DBP, many legacy systems still rely on old SMTP relays. Ensuring these systems are updated to use the modern mail infrastructure with proper authentication is critical for communications reliability.",
    whyThisMatters:
      "Communication with external partners and clients is a business-critical function. Delays in system-generated emails (like notifications or invoices) can disrupt entire operational workflows.",
    signalsToWatch:
      "Watch for a sudden increase in '4.4.1 No response' or '4.4.7 Message expired' errors in logs; these usually indicate that the recipient server is down or blocking our IP range.",
    ifIssuesPersist:
      "Provide the full headers of an affected email and any NDR received. Submit a request to the Messaging Team for a deep-dive trace of the mail gateway logs.",
  },
  "KB-00150": {
    stepByStepActions: [
      "Identify the specific dashboard or report exhibiting slowness and note the peak times when degradation occurs.",
      "Check the 'Query Execution Plan' for any large joins or unindexed columns that are causing database-level latency.",
      "Implement 'Cache Warm-up' scripts to pre-calculate frequent metrics during off-peak hours (e.g., 2 AM).",
      "Review the number of concurrent users; if over the threshold, implement 'Concurrency Limits' or scale the workspace capacity.",
      "Optimize visuals: remove unnecessary high-cardinality charts and reduce the number of visuals per page to under 10.",
      "Verify data source connectivity; if pulling from an on-premise gateway, check for network congestion or hardware bottlenecks.",
    ],
    keyTakeaways: [
      "Dashboard performance is usually a factor of query complexity and data volume rather than platform speed.",
      "Properly configured caching can reduce load times by up to 80% for common views.",
      "Scaling workspace capacity is a last resort; optimization of the data model should always come first.",
    ],
    fullGuidance:
      "Analytics performance is vital for data-driven decision making. As our datasets grow, dashboards that once loaded instantly can become sluggish. The primary bottlenecks are 'Expensive Queries' that scan entire tables instead of using indexes. Performance tuning involves a mix of technical optimization (DAX/SQL tuning) and design choices (reducing visual density). Always aim for a 'Summary to Detail' design where the first page is lightweight and drill-throughs provide the deep data.",
    whyThisMatters:
      "The TO relies on real-time insights to govern the transformation journey. 30-second load times lead to decision-making friction and low user adoption of the analytics tools.",
    signalsToWatch:
      "Watch for the 'Spinning Wheel' icon appearing for more than 5 seconds only on specific visuals; this signals that a particular query is the bottleneck. Monitor workspace CPU usage regularly.",
    ifIssuesPersist:
      "Capture a 'Performance Trace' using the browser's DevTools or the platform's internal tracer. Submit a request to the Analytics Engineering team with the trace file attached.",
  },
  "KB-00130": {
    stepByStepActions: [
      "Blow compressed air into the laptop's intake and exhaust vents to remove dust buildup that restricts airflow.",
      "Check 'Task Manager' (Windows) or 'Activity Monitor' (macOS) to identify background processes with high CPU usage (>20%).",
      "Update your system BIOS/UEFI to the latest version, as manufacturers often release thermal management patches.",
      "Ensure the laptop is placed on a hard, flat surface to allow for correct ventilation; avoid using the device on beds or couches.",
      "Switch the device to 'Balanced' or 'Power Saver' mode in the OS settings to limit peak turbo frequencies during non-intensive tasks.",
      "Verify that the latest thermal drivers and chipset drivers are installed from the manufacturer's support portal.",
    ],
    keyTakeaways: [
      "Physical dust buildup is the #1 cause of thermal throttling and unexpected shutdowns.",
      "BIOS updates frequently contain critical fan-curve adjustments following major OS updates.",
      "Software bloat can keep the CPU in a 'High Power' state even when the laptop is seemingly idle.",
    ],
    fullGuidance:
      "Thermal management is critical for hardware longevity and consistent performance. When a CPU reaches its thermal limit (usually 95-100°C), it 'throttles' by lowering its speed, which users perceive as lag. If throttling cannot keep the temperature safe, the device will perform a 'Hard Shutdown' to protect components. Regular maintenance and mindful software management are essential, especially as laptops age and thermal paste can dry out.",
    whyThisMatters:
      "Hardware downtime disrupts productivity. A laptop that shuts down during a business-critical DBP presentation or deployment window creates immediate operational risk.",
    signalsToWatch:
      "Watch for the laptop's fans running at maximum speed for no apparent reason, or the underside feeling painful to touch. Frequent system freezes during video conferencing are also a primary signal.",
    ifIssuesPersist:
      "If the device continues to overheat after cleaning and updates, it may require a hardware inspection. Submit a request for 'Hardware Support' and reference KB-00130.",
  },
  "KB-00140": {
    stepByStepActions: [
      "Clear your browser's cookies and cache, then restart the browser entirely to remove any stale authentication tokens.",
      "Check the system clock on your computer; if it is off by more than 5 minutes from the server, the SSO handshake will fail.",
      "Verify you are navigating to the correct instance URL (e.g., https://company.service-now.com) and not an old bookmark.",
      "Check your network connection; if using a VPN, ensure it is fully connected and you can reach the Identity Provider (IdP).",
      "Open your browser's 'Incognito' or 'Private' mode to test if a browser extension is interfering with the redirect scripts.",
      "Ensure you are not logged into a different Microsoft account in another browser tab, which can confuse the SSO provider.",
    ],
    keyTakeaways: [
      "Login loops are almost always caused by stale browser cookies or account conflicts in the same session.",
      "SSO requires tight time synchronization between your local machine and the identity provider.",
      "Using Incognito mode is the fastest way to isolate whether the issue is browser-specific.",
    ],
    fullGuidance:
      "ServiceNow uses SAML 2.0 for Single Sign-On (SSO). The process involves a redirect from ServiceNow to our Identity Provider (Azure AD) and back. A 'login loop' occurs when the redirect fails to satisfy the requirement of either side, often because a cookie says the user is logged in, but the session is actually expired. Refreshing the browser state is the first and most effective fix for 90% of SSO issues.",
    whyThisMatters:
      "ServiceNow is our primary tool for IT service management and DBP orchestration. Loss of access blocks incident reporting and change management workflows.",
    signalsToWatch:
      "Watch for the URL bar rapidly changing between two different domains. Seeing an 'AADSTS50008' or similar error code in the URL is a signal of a configuration mismatch or clock skew.",
    ifIssuesPersist:
      "Capture a screenshot of the specific error code displayed and the URL at the moment of failure. Submit a Technical Support request to the Identity Team.",
  },
  "KB-00205": {
    stepByStepActions: [
      "Confirm that your mobile number and alternative email are correctly listed in your User Profile under 'Security Info'.",
      "Check your mobile device's 'Spam' or 'Blocked' folder; some carriers mistakenly flag automated verification SMS.",
      "Wait at least 5 minutes before requesting a new code; rapid repeated requests can trigger rate-limiting on the server.",
      "Try an alternative verification method if available, such as an automated voice call instead of a text message.",
      "Ensure you are not using a VPN or Proxy that might be triggering a security block on the verification request.",
      "Verify you have an active mobile signal; text messages require a cellular connection even if you have Wi-Fi.",
    ],
    keyTakeaways: [
      "Up-to-date recovery information is a prerequisite for self-service password reset.",
      "Server-side rate limiting can block verification requests if you click 'Resend' too quickly.",
      "SMS delivery is subject to carrier delays; voice calls are often a reliable fallback.",
    ],
    fullGuidance:
      "Self-Service Password Reset (SSPR) depends on the 'Out-of-Band' delivery of a verification code. If this code doesn't arrive, it's usually due to stale profile data or a delivery issue with the telecommunications provider. This article guides you through the common 'dead ends' in the verification process. Remember that the security of our environment relies on these codes; they are only sent to verified channels registered annually during our security audit.",
    whyThisMatters:
      "When SSPR fails, it forces a manual support intervention. Every failed self-service attempt increases the Mean Time to Resolution (MTTR) for access-related issues.",
    signalsToWatch:
      "Signals of a broader delivery issue include multiple users in the same region reporting missing codes simultaneously. Check the platform status page for any known SMS gateway outages.",
    ifIssuesPersist:
      "If you have verified your contact info but still receive no codes, try from a different network or device. If failure continues, submit an 'Identity Support' ticket.",
  },
  "KB-00165": {
    stepByStepActions: [
      "Audit your current local folder structure and remove redundant or temporary files before starting the migration.",
      "Map your local folder structure to the standard DTMP 'Site Hierarchy' to ensure documents are placed in the correct governance zone.",
      "Check for long file paths; SharePoint has a character limit, and paths exceeding 260 characters will cause upload errors.",
      "Verify that file names do not contain unsupported characters like #, %, or & that can break web-based links.",
      "Use the 'SharePoint Migration Tool' (SPMT) for bulk transfers to maintain metadata like 'Created Date' and 'Author'.",
      "Validate permissions on the destination site before moving data to ensure only authorized team members have access.",
    ],
    keyTakeaways: [
      "Cleaning and organizing data before migration prevents 'garbage-in, garbage-out' scenarios.",
      "Character limits in URLs (260 characters) are the most common cause of migration failures.",
      "The SPMT tool is superior to simple 'drag-and-drop' because it preserves critical document history.",
    ],
    fullGuidance:
      "Migrating to SharePoint is more than a simple file move; it is a transition to a collaborative document ecosystem. Unlike local file servers, SharePoint utilizes metadata and search indexing. A successful migration requires planning the site structure first. This article provides the best practices to ensure your data remains discoverable, secure, and compliant with our transformation standards. Wave-based migration (starting with less critical data) is always recommended.",
    whyThisMatters:
      "Consolidating our data on SharePoint is a key objective of the DTMP. It enables cross-functional collaboration and ensures that our 'Collective Intelligence' is indexed and accessible.",
    signalsToWatch:
      "Watch for 'Sync Errors' in the OneDrive client or files that appear with a red 'X'. This is a signal that the file violates a SharePoint naming or pathing rule.",
    ifIssuesPersist:
      "For large datasets (>100GB), do not attempt an ad-hoc migration. Contact the 'Collaboration Team' to schedule a managed migration using enterprise-grade tools.",
  },
  "KB-00160": {
    stepByStepActions: [
      "Power on the new laptop and connect it to the official organizational Wi-Fi or an Ethernet cable for the first boot.",
      "Follow the 'Windows Autopilot' or 'macOS DEP' prompts to link the device to your organizational identity (email/password).",
      "Allow the device at least 60 minutes on the network to download mandatory security policies and base software (VPN, AV).",
      "Log into the 'Company Portal' or 'Self Service' app to install additional department-specific software packages.",
      "Run the system's update utility once to ensure the latest security patches and drivers are installed after the initial imaging.",
      "Set up your 'OneDrive' sync to restore your previous documents and desktop settings automatically.",
    ],
    keyTakeaways: [
      "Patience is key; the 'Background Provisioning' stage takes time as policies are applied from the cloud.",
      "Always use a wired connection if available for the first onboarding to ensure a stable policy download.",
      "Departmental tools are managed through the 'Self Service' portal, not through manual internet downloads.",
    ],
    fullGuidance:
      "Onboarding a new laptop is our 'Zero-Touch' provisioning process. We use cloud management to configure your machine specifically for your role. The process is designed to be self-service, but it requires a consistent network connection to complete the handshake with our management servers. This article ensures you follow the correct sequence to get your device fully compliant and ready for use on the DBP within the first few hours.",
    whyThisMatters:
      "First impressions matter. A smooth hardware onboarding experience ensures new participants in our transformation journey are productive from day one.",
    signalsToWatch:
      "Watch for the 'Setting up your device for work' screen. If it hangs for more than 2 hours on a single step, it signals a network interruption or a policy conflict.",
    ifIssuesPersist:
      "If the device fails to reach the login screen or shows a 'Hardware ID Not Recognized' error, contact 'Desktop Support' with the serial number (S/N) of the device.",
  },
  "KB-00185": {
    stepByStepActions: [
      "Open the application settings on your mobile device and verify that 'Allow Notifications' is toggled to ON.",
      "Check your device's 'Focus' or 'Do Not Disturb' settings to ensure they are not silencing incoming alerts.",
      "Verify that background data usage is enabled for the app; if disabled, push tokens cannot be refreshed.",
      "Clear the app's cache (Android) or offload and reinstall the app (iOS) to trigger a fresh push token registration.",
      "Log out and log back into the app to force a resync between your device and the FCM/APNS gateway.",
      "Check with your network administrator if you are on a restricted Wi-Fi that might block ports 5228-5230 (FCM).",
    ],
    keyTakeaways: [
      "Operating system 'Focus' modes are a frequent silent cause of missing notifications.",
      "Push tokens can expire or become stale; a simple logout/login often resolves registration issues.",
      "Network-level blocks on specific ports can prevent notifications on corporate Wi-Fi.",
    ],
    fullGuidance:
      "Push notifications are the primary way our mobile apps alert you to critical DBP status changes or approvals. The delivery chain involves our servers, a cloud gateway (Google FCM or Apple APNS), and finally your device. Most issues occur at the 'last mile' — the device settings. This guide focuses on ensuring your device is receptive to the signals our platform is sending.",
    whyThisMatters:
      "Delayed notifications mean delayed decisions. Missed approvals can stall deployment pipelines and governance workflows.",
    signalsToWatch:
      "Watch for a 'Push Registration Failed' error in the app's internal log or settings menu. If you stop receiving alerts immediately after an OS update, it signals a permission reset.",
    ifIssuesPersist:
      "Provide your device model, OS version, and whether the issue happens on all networks. Submit a Technical Support request to the Mobile Engineering team.",
  },
  "KB-00220": {
    stepByStepActions: [
      "Log into the Database Performance Monitor and check for the top 5 'Most Expensive Queries' by execution time.",
      "Verify 'Index Utilization' — identify large tables with full table scans and add missing indexes where appropriate.",
      "Check for 'Deadlocks' or long-running transactions that are blocking other operations in the process queue.",
      "Review hardware metrics: CPU saturation over 90% or Disk I/O wait times exceeding 10ms signal a resource bottleneck.",
      "Analyze memory buffer cache hit ratios; a ratio below 95% suggests the database needs more allocated RAM.",
      "Ensure statistics are up to date by running 'Analyze' or 'Update Stats' on heavily modified tables.",
    ],
    keyTakeaways: [
      "90% of database slowness stems from unoptimized queries rather than hardware failure.",
      "Blocking and deadlocks are silent killers of performance; monitor transaction logs constantly.",
      "Regularly updating table statistics is essential for the query optimizer to make the right choices.",
    ],
    fullGuidance:
      "The Database Performance Runbook is the definitive guide for sustaining high-throughput on the DBP data layer. As a system matures, data volume increases, and what worked at launch may fail under scale. Performance tuning is a continuous process of observation and refinement. This runbook prioritizes non-destructive optimizations like indexing and query refactoring.",
    whyThisMatters:
      "The database is the single source of truth for the DTMP. Latency here cascades into every dashboard, API, and user interaction, potentially bringing the platform to a crawl.",
    signalsToWatch:
      "Watch for 'Connection Timeout' errors in application logs. A sudden spike in 'Disk Queue Length' is a leading indicator that the physical storage cannot keep up with the query load.",
    ifIssuesPersist:
      "Capture the top 3 offending SQL statements and the current execution plan. Submit an Emergency Support request to the DBA Team.",
  },
  "KB-00180": {
    stepByStepActions: [
      "Use 'Scheduled Exports' during non-peak hours (e.g., midnight) to avoid competition for resources with live users.",
      "Filter your report to include only necessary columns; exporting 'All Fields' on large objects increases time and failure risk.",
      "Check for 'Record Locking' issues if your report includes objects currently being modified by large bulk-upload jobs.",
      "Utilize the 'Data Export Service' for datasets exceeding 50,000 records instead of standard report exports.",
      "Verify that the user account performing the export has the 'Export Reports' permission specifically enabled in their profile.",
      "Break large exports into smaller batches by date range or region if you consistently hit the 60-second execution timeout.",
    ],
    keyTakeaways: [
      "Large, unfiltered exports are the primary cause of 'Request Timeout' errors in Salesforce.",
      "Off-peak scheduling is the most reliable way to ensure large data extracts complete successfully.",
      "Data Export Service (Weekly/Monthly) is the intended tool for full backups, not standard reporting.",
    ],
    fullGuidance:
      "Salesforce data is a critical input for our transformation metrics. However, Salesforce is a multi-tenant environment, and 'Governor Limits' exist to prevent one user's export from impacting others. Following these best practices ensures your data extraction is efficient and doesn't trigger system-wide throttles.",
    whyThisMatters:
      "Accurate reporting is essential for governance. Failed exports lead to gaps in our 'Transformation Scorecards' and manual rework for the TO staff.",
    signalsToWatch:
      "Watch for the 'Report Too Large' message or the browser simply timing out. If you receive an email stating 'Your export has failed', this signals a conflict with another long-running job.",
    ifIssuesPersist:
      "Contact the Salesforce Admin team to check the 'Background Jobs' queue. Provide the name of the report and the specific error message received.",
  },
  "KB-00170": {
    stepByStepActions: [
      "Open 'Services.msc' (Windows), locate the 'Print Spooler' service, right-click it, and select 'Restart'.",
      "Navigate to C:\\Windows\\System32\\spool\\PRINTERS and delete any temporary .SHD or .SPL files to clear the queue manually.",
      "Check the physical printer for any paper jams, 'Low Toner', or 'Out of Paper' alerts that are pausing the queue.",
      "Verify the printer is online: ping the printer's IP address from your machine to ensure network connectivity.",
      "Switch the printer off and on again to clear its internal memory buffer and reset the network interface.",
      "Remove and re-add the printer in 'Settings > Devices' to ensure the latest local driver configuration is active.",
    ],
    keyTakeaways: [
      "Restarting the local 'Print Spooler' service resolves 80% of 'Stuck' print jobs on Windows.",
      "Manual deletion of spool files is necessary if the GUI 'Cancel All Documents' command fails to respond.",
      "Hidden hardware errors (like a slightly open tray) can pause the software queue without a clear error message.",
    ],
    fullGuidance:
      "Stuck print jobs are usually a communication breakdown between the Windows Spooler and the printer's hardware controller. This often happens if the printer goes into 'Sleep' mode during a large job. This guide provides the sequence to purge the queue and reset the handshake.",
    whyThisMatters:
      "Stuck queues block everyone on that floor from printing. It's a localized but highly visible disruption to physical office operations.",
    signalsToWatch:
      "Watch for the printer status saying 'Deleting...' or 'Restarting' indefinitely. If the printer's own screen remains blank while jobs are sent, it signals a network or power-save fault.",
    ifIssuesPersist:
      "If the queue becomes stuck again immediately after a restart, the issue is likely a corrupted document format. Submit a request to 'Field Support' for the HQ 3rd Floor printers.",
  },
  "KB-00200": {
    stepByStepActions: [
      "Review your current API usage metrics in the 'Gateway Dashboard' to identify the specific endpoints hitting the limits.",
      "Determine if the increase is 'Temporary' (e.g., for a data migration) or 'Permanent' (due to increased business volume).",
      "Submit a 'Limit Change Request' via the DTMP portal, including the target RPM (Requests Per Minute) and the business justification.",
      "Obtain 'Technical Architect' approval to ensure the underlying backend can handle the increased traffic load.",
      "Validate the change in the 'UAT Gateway' environment before the Production change is implemented.",
      "Optimize your client-side code: implement 'Retry-After' logic and exponential backoff to handle transient 429 errors gracefully.",
    ],
    keyTakeaways: [
      "Rate limits are in place to protect the stability of the DBP and its interconnected services.",
      "Temporary migrations are the most common reason for limit increases; these should be time-bound.",
      "Architectural approval is mandatory to prevent accidental 'Self-Inflicted Denial of Service' on downstream systems.",
    ],
    fullGuidance:
      "The API Gateway is the front door to our Digital Business Platform. Rate limits (throttling) ensure fair usage and protect against traffic spikes that could degrade the platform. As our ecosystems grow, these limits occasionally need adjustment. This article outlines the governance process for requesting changes.",
    whyThisMatters:
      "Artificially low limits block integration success. Conversely, unmanaged increases can lead to system-wide instability during peak events.",
    signalsToWatch:
      "Watch for '429 Too Many Requests' errors in your integration logs. If you hit 80% of your quota consistently, it's a signal to start the limit increase process before it becomes a blocker.",
    ifIssuesPersist:
      "If your request is approved but limits still appear active, verify you are using the correct API Key/Consumer Secret. Contact the 'Integration Team' for a configuration audit.",
  },
  "KB-00190": {
    stepByStepActions: [
      "Use 'Performance Analyzer' in Power BI Desktop to identify the specific visuals with high 'DAX Query' or 'Visual Display' times.",
      "Reduce the number of visuals per report page; more than 10 visuals can cause significant rendering lag for end users.",
      "Optimize DAX measures by avoiding expensive functions like 'FILTER(ALL(Table))' on large datasets.",
      "Check the 'Data Load' settings and ensure 'Auto Date/Time' is disabled to reduce model size and memory consumption.",
      "Utilize 'Aggregations' for large datasets to allow queries to run against summarized data instead of raw records.",
      "Verify that the 'On-Premises Data Gateway' is not bottlenecked by CPU or memory if using DirectQuery mode.",
    ],
    keyTakeaways: [
      "Visual density is the most common cause of slow report rendering; keep dashboards focused and lean.",
      "The 'Performance Analyzer' tool is the primary way to isolate slow DAX measures versus data load delays.",
      "Model size directly impacts user experience; keep data types efficient and remove unused columns.",
    ],
    fullGuidance:
      "Power BI is our window into transformation progress. However, as models grow in complexity, performance can degrade. Tuning a report involves balancing data volume, calculation complexity, and visual density. This guide focuses on 'Quick Wins' for improving responsiveness. Always aim for a 'Star Schema' data model for the best performance in Power BI.",
    whyThisMatters:
      "Decision-makers need responsive data. A report that takes 15 seconds to load visuals creates friction and reduces the utility of our 'Intelligence Layer'.",
    signalsToWatch:
      "Watch for the 'Gray Box' placeholders appearing for extended periods. If a report is fast for small dates but slow for larger ranges, it signals an unoptimized DAX calculation.",
    ifIssuesPersist:
      "Capture the 'Performance Analyzer' JSON export and the report name. Submit a request to the 'Analytics Team' for a model optimization review.",
  },
  "KB-00175": {
    stepByStepActions: [
      "Navigate to 'Project Settings > Automation' and click 'Create Rule' to start the automation wizard.",
      "Select a 'Trigger' (e.g., Issue Transitioned) that specifies the event that will kick off the automation.",
      "Add 'Conditions' (e.g., Issue Type equals 'Bug') to narrow down when the rule should actually execute.",
      "Define the 'Action' (e.g., Assign Issue to a specific user or group) to perform when the trigger and conditions are met.",
      "Name your rule clearly (e.g., 'Auto-Assign Bugs to DevOps') and provide a description of its logic.",
      "Use the 'Rule Audit Log' after publishing to verify that the rule is executing as expected and not hitting errors.",
    ],
    keyTakeaways: [
      "Automation rules reduce manual toil and ensure consistent governance across transformation projects.",
      "Always include a 'Condition' to prevent rules from firing on irrelevant issues and hitting global execution limits.",
      "The 'Audit Log' is your best friend when debugging why a rule didn't fire or behaved unexpectedly.",
    ],
    fullGuidance:
      "Jira Automation is a powerful 'No-Code' builder for project workflows. By automating routine tasks like assigning owners or updating status based on dependencies, teams can stay focused on delivery. This article outlines the 'Safety-First' approach to automation: build, test, and then scale. Be mindful of 'Rule Loops' where one rule's action triggers another rule indefinitely.",
    whyThisMatters:
      "Standardized workflows are the glue of the DTMP. Automation ensures that governance requirements (like mandatory approvals) are followed without manual intervention.",
    signalsToWatch:
      "Watch for issues that change status 'on their own' incorrectly; this signals a conflicting automation rule. Monitor your project's monthly automation execution quota.",
    ifIssuesPersist:
      "If you need a cross-project rule or a complex integration (e.g., Jira to Slack), contact the 'Jira Admins' for a 'Global Rule' assessment.",
  },
  "KB-00225": {
    stepByStepActions: [
      "Download the latest client package from the 'Software Center' (Windows) or 'Self Service' (macOS) app.",
      "Close any active VPN sessions and exit the GlobalProtect application completely from the system tray.",
      "Run the installer; it will detect the existing version and perform an 'In-Place Upgrade' to preserve your settings.",
      "Wait for the installation to finish; do not power off your machine during the network driver update phase.",
      "Restart your computer when prompted to ensure the new virtual network adapter drivers are correctly loaded.",
      "Log back into GlobalProtect and verify your connection; check 'Settings > About' to confirm the new version number.",
    ],
    keyTakeaways: [
      "Regular updates are mandatory to maintain compatibility with our evolving security infrastructure.",
      "Using the 'Software Center' ensures you are installing an IT-approved and pre-configured version.",
      "A restart is often necessary because VPN updates modify the core operating system network stack.",
    ],
    fullGuidance:
      "Maintaining the latest GlobalProtect client is essential for both security and performance. Updates often include patches for 'Connection Drops' and 'Zero-Day' vulnerabilities. As part of our drive for 'Digital Resilience', we push these updates periodically. This guide ensures you can perform the upgrade manually if you missed the automated deployment window.",
    whyThisMatters:
      "Outdated VPN clients are a primary target for attackers. They also lack the optimizations needed for high-latency remote working environments.",
    signalsToWatch:
      "Watch for a 'Version Not Supported' message when trying to connect. If you experience frequent crashes of the 'PanGPS' service, it is a signal that an update is required.",
    ifIssuesPersist:
      "If the installer fails with an 'Access Denied' error, you may need a temporary 'Admin Override'. Request support via the 'Hardware & OS' category.",
  },
  "KB-00215": {
    stepByStepActions: [
      "Review the number of 'Dashboard Components'; Salesforce recommends a maximum of 20 for optimal performance.",
      "Check the 'Running User' settings; running a dashboard as a single user with high-level access is faster than 'Dynamic' dashboards.",
      "Optimize the underlying 'Source Reports' by removing unnecessary grouping levels and complex summary formulas.",
      "Filter out historical data: dashboards that scan years of records are significantly slower than those focused on 'This Quarter'.",
      "Minimize the use of 'Multi-Select' filters which can create complex, slow-running queries on the Salesforce platform.",
      "Schedule 'Dashboard Refresh' for early morning so the latest data is cached and ready for the business day.",
    ],
    keyTakeaways: [
      "Dashboard speed is directly linked to the complexity of its underlying reports.",
      "Dynamic dashboards (Run as logged-in user) are flexible but much slower than static ones.",
      "Focusing on 'Active' data rather than full history is the fastest way to gain performance.",
    ],
    fullGuidance:
      "Salesforce dashboards are the executive cockpit for our CRM activities. To keep them 'High-Performance', we must adhere to design limits. This article provides a checklist for 'Rationalizing' dashboards that have become cluttered over time. By reducing visual noise and focusing on 'Actionable KPIs', you improve both speed and decision quality.",
    whyThisMatters:
      "Sales leaders depend on these dashboards for real-time visibility. A slow dashboard leads to 'Shadow Spreadsheets' which silo our organizational data.",
    signalsToWatch:
      "Watch for the 'Refresched: 2 hours ago' timestamp. If clicking 'Refresh' takes more than 2 minutes, the dashboard is a candidate for optimization.",
    ifIssuesPersist:
      "Submit a request to the 'Sales Ops' team for a 'Dashboard Audit'. Include the URL of the affected dashboard and the name of the source reports.",
  },
  "KB-00195": {
    stepByStepActions: [
      "Clear any paper dust from the paper trays and rollers using a lint-free cloth every 30 days.",
      "Replace 'Waste Toner' containers immediately when the warning appears to prevent internal contamination.",
      "Perform a 'Calibration' or 'Clean Print Heads' cycle via the printer's maintenance menu if you see streaks or faded text.",
      "Keep spare toner and paper stocked in the cabinet; do not wait for 'Empty' alerts to place an order.",
      "Ensure the printer is in a well-ventilated area to prevent overheating during large, high-volume print runs.",
      "Check the 'Firmware Version' on the printer's status page and notify IT if it has not been updated in over 6 months.",
    ],
    keyTakeaways: [
      "Proactive cleaning prevents 90% of common paper jams and print quality issues.",
      "Maintenance is a shared responsibility for each floor's administrative staff.",
      "Ignoring 'Early Warning' signals (like unusual noises) leads to expensive hardware failure.",
    ],
    fullGuidance:
      "While we aim for a 'Paperless Office', physical printing remains necessary for certain legal and governance requirements. Reliable printers are part of our physical workspace infrastructure. This schedule ensures that our fleet of multi-function devices (MFDs) remains available and in good working order. Following these simple steps extends the life of the hardware and reduces support costs.",
    whyThisMatters:
      "Printer downtime is a high-frustration event for staff. Following a maintenance schedule ensures that 'Physical Assets' are as resilient as our 'Digital Assets'.",
    signalsToWatch:
      "Watch for a 'Ghosting' effect on printed pages or a 'Squeaking' sound during paper pickup. These are signals that rollers are worn or the fuser unit is failing.",
    ifIssuesPersist:
      "If self-maintenance does not resolve quality issues, check the sticker on the printer for the vendor's 'Asset ID' and call the service number listed on the device.",
  },
  "KB-00210": {
    stepByStepActions: [
      "Log into the 'Admin Portal' using your elevated credentials and navigate to the 'Active Users' section.",
      "Search for the affected user's name and check the 'Sign-in Status'; it will show 'Blocked' if MFA has failed too many times.",
      "Click on 'Authentication Methods' and select 'Require Re-register MFA' to force the user to set up their app again.",
      "If the account is explicitly locked, click 'Unblock Sign-in' and wait 5 minutes for the change to propagate globally.",
      "Advise the user to open their browser in 'Incognito' mode for the first login after the unlock to avoid cookie conflicts.",
      "Confirm the user has access to their registered mobile device or provide a 'Temporary Access Pass' (TAP) for emergency login.",
    ],
    keyTakeaways: [
      "MFA lockouts are a security feature, not a bug; verify the user's identity before performing an unlock.",
      "Requiring MFA re-registration is the safest path when a user has a new device or lost their previous one.",
      "Temporary Access Passes (TAP) are the modern, secure alternative to 'Shared Secret' questions.",
    ],
    fullGuidance:
      "This guide is for IT Admins and Support staff. MFA failures are our highest-volume 'Identity' incident. Lockouts occur after multiple failed attempts to protect the account from 'Brute Force' attacks. As an admin, your role is to verify the user and safely restore access without compromising our security posture. Always log these actions in the ticket for audit trails.",
    whyThisMatters:
      "Admin efficiency in identity management directly impacts platform adoption. Rapid, secure restoration of access maintains trust in our security systems.",
    signalsToWatch:
      "Watch for 'Suspicious Activity' alerts in the Azure AD log for that user. If multiple MFA failures are followed by an unlock request from an unusual location, treat it as a potential social engineering attack.",
    ifIssuesPersist:
      "If the user is still unable to log in after an admin unlock, check for 'Conditional Access' policies that might be blocking the user's current IP or device state.",
  },
};

const buildKnowledgeDetailContent = (article: KnowledgeArticle): KnowledgeDetailContent => {
  const plainContent = stripHtml(article.content);
  const summary = withPeriod(article.summary.trim());
  const guidance = withPeriod((plainContent || article.summary).trim());
  const area = (article.subcategory || article.category).toLowerCase();
  const tagsLabel = article.tags.join(", ");

  const defaults: KnowledgeDetailContent = {
    stepByStepActions: [
      `Review your current ${area} configuration against the DTMP recommended baseline for this component.`,
      `Check system and application logs for error codes or warning patterns related to ${area} in the past 24 hours.`,
      `Identify whether the issue is isolated to one environment (dev/staging/prod) or affects all environments equally.`,
      `Apply the relevant configuration correction or patch in a non-production environment first.`,
      `Validate the fix with a functional test before promoting to production.`,
      `Monitor the affected system for 24 hours after the change to confirm resolution is sustained.`,
    ],
    keyTakeaways: [
      summary,
      `Most ${area} issues have a configuration root cause — verify settings before assuming a hardware or network fault.`,
      `Test fixes in non-production first. A misconfigured fix in production creates a second incident on top of the first.`,
    ],
    fullGuidance: guidance,
    whyThisMatters: `Unresolved ${area} issues create compounding impact. What begins as a minor configuration drift can escalate to service degradation or outage if not addressed promptly, particularly in interconnected transformation platform environments where multiple services share infrastructure.`,
    signalsToWatch: `Monitor system logs and user-reported support tickets for repeat patterns. A cluster of similar complaints within a short window is the strongest signal that a systemic root cause exists rather than isolated user error.`,
    ifIssuesPersist: `Capture relevant logs, screenshots, and configuration exports. Submit a Technical Support request from this page with these attached, referencing this article ID and noting the specific error codes or behaviours you are observing. An engineer will perform a deeper diagnostic trace.`,
  };

  const override = knowledgeDetailOverrides[article.id];
  if (!override) {
    return defaults;
  }

  return {
    ...defaults,
    ...override,
    stepByStepActions: override.stepByStepActions ?? defaults.stepByStepActions,
    keyTakeaways: override.keyTakeaways ?? defaults.keyTakeaways,
  };
};

export default function SupportKnowledgeArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const article = useMemo(
    () => knowledgeArticles.find((item) => item.id === articleId),
    [articleId],
  );

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1" id="main-content">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <button
              type="button"
              onClick={() => navigate("/marketplaces/support-services?tab=knowledge-base")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft size={16} />
              Back to Knowledge Base
            </button>
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Article not found</h1>
              <p className="text-sm text-gray-600 mt-2">The selected article is no longer available.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const detailContent = buildKnowledgeDetailContent(article);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1" id="main-content">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/support-services?tab=knowledge-base" className="hover:text-foreground transition-colors">Support Services</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{article.title}</span>
          </nav>

          <button
            type="button"
            onClick={() => navigate("/marketplaces/support-services?tab=knowledge-base")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={16} />
            Back to Knowledge Base
          </button>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Tag size={12} />
                {article.category}
              </span>
              <span className="capitalize">{article.difficulty}</span>
              <span>{article.estimatedReadTime}</span>
            </div>

            <h1 className="text-xl font-bold text-gray-900">{article.title}</h1>
            <p className="text-[13px] text-gray-700">{article.summary}</p>

            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} /> Updated {new Date(article.updatedAt).toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> {article.estimatedReadTime}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={14} /> {article.views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={14} /> {article.helpfulPercentage}% found this helpful
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Step-by-step actions</h3>
              <ul className="list-disc ml-5 mt-2 text-[13px] text-gray-700 space-y-1">
                {detailContent.stepByStepActions.map((step, index) => (
                  <li key={`${article.id}-step-${index}`}>{step}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key takeaways</h3>
              <ul className="list-disc ml-5 mt-2 text-[13px] text-gray-700 space-y-1">
                {detailContent.keyTakeaways.map((point, index) => (
                  <li key={`${article.id}-takeaway-${index}`}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Full guidance</h3>
              <p className="text-[13px] text-gray-700 mt-2">{detailContent.fullGuidance}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">Why this matters</h3>
              <p className="text-[13px] text-gray-700 mt-1">{detailContent.whyThisMatters}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">Signals to watch</h3>
              <p className="text-[13px] text-gray-700 mt-1">{detailContent.signalsToWatch}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">If issues persist</h3>
              <p className="text-[13px] text-gray-700 mt-1">{detailContent.ifIssuesPersist}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
