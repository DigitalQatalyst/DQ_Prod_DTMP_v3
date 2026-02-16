import { DesignPattern } from './types';

export const designPatterns: DesignPattern[] = [
  {
    id: 'PTRN-012',
    name: 'Saga Pattern',
    patternType: 'architectural',
    category: 'Distributed Transactions',
    
    intent: 'Manage data consistency across microservices without distributed transactions',
    problem: 'In microservices architecture, each service has its own database. Business operations that span multiple services require maintaining data consistency without using distributed (2PC) transactions, which don\'t scale well and create tight coupling.',
    solution: 'Implement a saga - a sequence of local transactions where each service updates its own database and publishes an event. If a step fails, the saga executes compensating transactions to undo the changes made by preceding steps.',
    
    structure: `## Saga Coordination Patterns

### 1. Choreography-based Saga
- Each service produces and listens to events
- No central coordinator
- Services react to events and trigger next steps

### 2. Orchestration-based Saga
- Central orchestrator (saga coordinator) manages the saga
- Orchestrator tells each service what operation to perform
- Services report back success/failure to orchestrator`,
    
    participants: [
      {
        id: 'orchestrator',
        name: 'Saga Orchestrator',
        role: 'Coordinator',
        responsibilities: [
          'Define saga workflow',
          'Invoke service operations in sequence',
          'Handle failures and trigger compensations',
          'Track saga state'
        ]
      },
      {
        id: 'participant',
        name: 'Saga Participant',
        role: 'Service',
        responsibilities: [
          'Execute local transaction',
          'Publish domain events',
          'Implement compensating transaction',
          'Report success/failure'
        ]
      }
    ],
    
    collaborations: `### Order Creation Saga Example (Orchestration):

1. Saga Orchestrator receives "Create Order" command
2. Orchestrator → Order Service: Create order (status: PENDING)
3. Order Service → Orchestrator: Order created
4. Orchestrator → Inventory Service: Reserve inventory
5. Inventory Service → Orchestrator: Inventory reserved
6. Orchestrator → Payment Service: Process payment
7. Payment Service → Orchestrator: Payment successful
8. Orchestrator → Order Service: Confirm order (status: CONFIRMED)

**Failure Scenario:** If payment fails at step 7:
- Orchestrator → Inventory Service: Release inventory (compensating)
- Orchestrator → Order Service: Cancel order (compensating)`,
    
    applicability: [
      'Business operations that span multiple microservices',
      'Systems requiring eventual consistency',
      'Long-running business processes',
      'Scenarios where 2PC is not feasible (scalability, availability)',
      'Operations that need to be compensatable'
    ],
    
    useCases: [
      'E-commerce order processing (create order, reserve inventory, charge payment)',
      'Travel booking (book flight, reserve hotel, charge card)',
      'Financial transfers across accounts',
      'Multi-step approval workflows',
      'Complex onboarding processes'
    ],
    
    benefits: [
      'Maintains data consistency without distributed transactions',
      'Each service can use database type optimized for its needs',
      'Services remain loosely coupled',
      'Supports long-running business processes',
      'Better fault tolerance than 2PC',
      'Scales well'
    ],
    
    tradeoffs: [
      'Eventual consistency - not suitable for all scenarios',
      'Requires compensating transaction logic',
      'More complex to implement and test than monolithic transactions',
      'Need to handle duplicate messages and idempotency',
      'Debugging distributed flows is harder',
      'Lack of isolation - data visible in intermediate states'
    ],
    
    antipatterns: [
      'Not implementing compensating transactions',
      'Assuming immediate consistency',
      'Not handling duplicate messages',
      'Lacking proper monitoring and observability',
      'Making sagas too long or complex',
      'Using sagas when ACID transactions are actually needed'
    ],
    
    codeExamples: [
      {
        language: 'java',
        description: 'Orchestration-based Saga with Spring Boot',
        code: `@Service
public class OrderSagaOrchestrator {
    @Autowired
    private OrderService orderService;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private PaymentService paymentService;
    
    public void createOrder(CreateOrderCommand command) {
        String sagaId = UUID.randomUUID().toString();
        try {
            Order order = orderService.createOrder(command);
            inventoryService.reserveInventory(order.getOrderId(), command.getItems());
            paymentService.processPayment(order.getOrderId(), order.getTotalAmount());
            orderService.confirmOrder(order.getOrderId());
        } catch (InventoryReservationException e) {
            orderService.cancelOrder(order.getOrderId());
            throw new SagaFailedException("Inventory reservation failed", e);
        } catch (PaymentException e) {
            inventoryService.releaseInventory(order.getOrderId());
            orderService.cancelOrder(order.getOrderId());
            throw new SagaFailedException("Payment failed", e);
        }
    }
}`
      }
    ],
    
    realWorldExamples: [
      {
        company: 'Netflix',
        scenario: 'Content publishing workflow',
        implementation: 'Uses choreography-based sagas for multi-step content publishing process across encoding, metadata, CDN distribution services'
      },
      {
        scenario: 'E-commerce order fulfillment',
        implementation: 'Orchestration-based saga managing order creation, inventory reservation, payment processing, and shipping label generation'
      }
    ],
    
    diagrams: [
      {
        type: 'sequence',
        url: '/diagrams/ptrn-012/saga-orchestration-success.png',
        caption: 'Orchestration-based Saga - Success Path'
      },
      {
        type: 'sequence',
        url: '/diagrams/ptrn-012/saga-orchestration-compensation.png',
        caption: 'Orchestration-based Saga - Compensation Path'
      }
    ],
    
    relatedPatterns: ['PTRN-013', 'PTRN-023', 'PTRN-034'],
    combines: ['PTRN-008', 'PTRN-019'],
    alternatives: ['PTRN-045'],
    
    difficulty: 'advanced',
    maturityLevel: 'mature',
    
    views: 5234,
    implementations: 87,
    rating: 4.6,
    
    references: [
      {
        title: 'Microservices Patterns',
        author: 'Chris Richardson',
        url: 'https://microservices.io/patterns/data/saga.html'
      }
    ],
    
    tags: ['saga', 'distributed-transactions', 'microservices', 'eventual-consistency', 'compensation']
  }
];

// Add more patterns
designPatterns.push(
  {
    id: 'PTRN-008',
    name: 'Event Sourcing',
    patternType: 'architectural',
    category: 'Data Management',
    intent: 'Store all changes to application state as a sequence of events',
    problem: 'Need complete audit trail and ability to replay events',
    solution: 'Store events instead of current state, rebuild state by replaying events',
    structure: 'Event Store → Event Handlers → Read Models',
    participants: [{ id: 'event-store', name: 'Event Store', role: 'Storage', responsibilities: ['Store events', 'Provide event stream'] }],
    collaborations: 'Events are stored and replayed to rebuild state',
    applicability: ['Audit requirements', 'Temporal queries', 'Event replay'],
    useCases: ['Financial systems', 'Audit trails', 'Time travel debugging'],
    benefits: ['Complete audit trail', 'Event replay', 'Temporal queries'],
    tradeoffs: ['Eventual consistency', 'Storage overhead', 'Complexity'],
    antipatterns: ['Storing current state in events', 'Not handling event versioning'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'Banking transaction history', implementation: 'All transactions stored as events' }],
    diagrams: [],
    relatedPatterns: ['PTRN-012', 'PTRN-019'],
    combines: ['PTRN-019'],
    alternatives: [],
    difficulty: 'advanced',
    maturityLevel: 'mature',
    views: 4123,
    implementations: 65,
    rating: 4.5,
    references: [{ title: 'Event Sourcing', url: 'https://martinfowler.com/eaaDev/EventSourcing.html' }],
    tags: ['event-sourcing', 'cqrs', 'events', 'audit']
  },
  {
    id: 'PTRN-015',
    name: 'Circuit Breaker',
    patternType: 'resilience',
    category: 'Fault Tolerance',
    intent: 'Prevent cascading failures by stopping requests to failing services',
    problem: 'Failing services can cause cascading failures',
    solution: 'Monitor failures and open circuit to stop requests temporarily',
    structure: 'Service → Circuit Breaker → Downstream Service',
    participants: [{ id: 'circuit-breaker', name: 'Circuit Breaker', role: 'Protection', responsibilities: ['Monitor failures', 'Open/close circuit'] }],
    collaborations: 'Circuit breaker monitors and protects',
    applicability: ['External service calls', 'Network operations', 'Unreliable dependencies'],
    useCases: ['API calls', 'Database connections', 'Third-party integrations'],
    benefits: ['Prevents cascading failures', 'Fast failure', 'Automatic recovery'],
    tradeoffs: ['Complexity', 'False positives', 'Configuration'],
    antipatterns: ['Not implementing fallback', 'Wrong thresholds'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'API rate limiting', implementation: 'Circuit opens on too many failures' }],
    diagrams: [],
    relatedPatterns: ['PTRN-016'],
    combines: [],
    alternatives: [],
    difficulty: 'intermediate',
    maturityLevel: 'mature',
    views: 6789,
    implementations: 142,
    rating: 4.7,
    references: [{ title: 'Circuit Breaker Pattern', url: 'https://martinfowler.com/bliki/CircuitBreaker.html' }],
    tags: ['resilience', 'fault-tolerance', 'circuit-breaker', 'reliability']
  }
);

// Add more patterns to reach 20-25 total
designPatterns.push(
  {
    id: 'PTRN-019',
    name: 'CQRS (Command Query Responsibility Segregation)',
    patternType: 'architectural',
    category: 'Data Management',
    intent: 'Separate read and write operations for better scalability and performance',
    problem: 'Single data model for reads and writes creates conflicts and performance issues',
    solution: 'Use separate models for reading and writing, sync via events',
    structure: 'Command Side → Event Store → Query Side',
    participants: [
      { id: 'command-side', name: 'Command Side', role: 'Write', responsibilities: ['Handle commands', 'Publish events'] },
      { id: 'query-side', name: 'Query Side', role: 'Read', responsibilities: ['Handle queries', 'Maintain read models'] }
    ],
    collaborations: 'Commands update write model and publish events, query side subscribes to events and updates read models',
    applicability: ['High read/write ratio', 'Complex queries', 'Different scalability needs'],
    useCases: ['E-commerce catalogs', 'Analytics dashboards', 'Reporting systems'],
    benefits: ['Independent scaling', 'Optimized read models', 'Better performance'],
    tradeoffs: ['Eventual consistency', 'Increased complexity', 'More infrastructure'],
    antipatterns: ['Using for simple CRUD', 'Not handling eventual consistency'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'E-commerce product catalog', implementation: 'Write model for inventory, read model for search' }],
    diagrams: [],
    relatedPatterns: ['PTRN-008', 'PTRN-012'],
    combines: ['PTRN-008'],
    alternatives: [],
    difficulty: 'advanced',
    maturityLevel: 'mature',
    views: 4567,
    implementations: 78,
    rating: 4.6,
    references: [{ title: 'CQRS Pattern', url: 'https://martinfowler.com/bliki/CQRS.html' }],
    tags: ['cqrs', 'separation-of-concerns', 'scalability', 'performance']
  },
  {
    id: 'PTRN-023',
    name: 'API Gateway',
    patternType: 'integration',
    category: 'API Management',
    intent: 'Single entry point for all client requests to microservices',
    problem: 'Clients need to know about multiple services and handle cross-cutting concerns',
    solution: 'Central gateway handles routing, authentication, rate limiting, and aggregation',
    structure: 'Client → API Gateway → Microservices',
    participants: [
      { id: 'gateway', name: 'API Gateway', role: 'Entry Point', responsibilities: ['Route requests', 'Handle auth', 'Aggregate responses'] }
    ],
    collaborations: 'Gateway routes requests to appropriate services and aggregates responses',
    applicability: ['Microservices architecture', 'Multiple client types', 'Need for centralized concerns'],
    useCases: ['Mobile apps', 'Web applications', 'Third-party integrations'],
    benefits: ['Simplified client code', 'Centralized concerns', 'Better security'],
    tradeoffs: ['Single point of failure', 'Potential bottleneck', 'Additional latency'],
    antipatterns: ['Business logic in gateway', 'Too much aggregation'],
    codeExamples: [],
    realWorldExamples: [{ company: 'Netflix', scenario: 'Zuul API Gateway', implementation: 'Routes all client requests to backend services' }],
    diagrams: [],
    relatedPatterns: ['PTRN-024'],
    combines: [],
    alternatives: ['Service Mesh'],
    difficulty: 'intermediate',
    maturityLevel: 'mature',
    views: 8923,
    implementations: 234,
    rating: 4.8,
    references: [{ title: 'API Gateway Pattern', url: 'https://microservices.io/patterns/apigateway.html' }],
    tags: ['api-gateway', 'microservices', 'integration', 'routing']
  },
  {
    id: 'PTRN-034',
    name: 'Bulkhead',
    patternType: 'resilience',
    category: 'Fault Isolation',
    intent: 'Isolate critical resources to prevent cascading failures',
    problem: 'Failure in one area can affect entire system',
    solution: 'Partition resources into isolated pools',
    structure: 'Service → Bulkhead Pool → Resource',
    participants: [
      { id: 'bulkhead', name: 'Bulkhead', role: 'Isolation', responsibilities: ['Isolate resources', 'Limit failures'] }
    ],
    collaborations: 'Bulkhead isolates resources preventing failure propagation',
    applicability: ['Critical systems', 'Multiple resource types', 'Need fault isolation'],
    useCases: ['Thread pools', 'Connection pools', 'Service instances'],
    benefits: ['Fault isolation', 'Better resource utilization', 'Prevents cascading failures'],
    tradeoffs: ['Resource overhead', 'Complexity', 'Configuration'],
    antipatterns: ['Not isolating critical paths', 'Too many bulkheads'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'Thread pool isolation', implementation: 'Separate pools for critical vs non-critical operations' }],
    diagrams: [],
    relatedPatterns: ['PTRN-015'],
    combines: ['PTRN-015'],
    alternatives: [],
    difficulty: 'intermediate',
    maturityLevel: 'mature',
    views: 3456,
    implementations: 89,
    rating: 4.5,
    references: [{ title: 'Bulkhead Pattern', url: 'https://docs.microsoft.com/en-us/azure/architecture/patterns/bulkhead' }],
    tags: ['resilience', 'fault-isolation', 'bulkhead', 'reliability']
  },
  {
    id: 'PTRN-045',
    name: 'Two-Phase Commit (2PC)',
    patternType: 'architectural',
    category: 'Distributed Transactions',
    intent: 'Ensure atomicity across distributed resources',
    problem: 'Need ACID transactions across multiple services/databases',
    solution: 'Coordinator manages two-phase commit protocol',
    structure: 'Coordinator → Participants (Prepare → Commit)',
    participants: [
      { id: 'coordinator', name: 'Coordinator', role: 'Transaction Manager', responsibilities: ['Coordinate phases', 'Handle failures'] }
    ],
    collaborations: 'Coordinator ensures all participants commit or abort together',
    applicability: ['ACID requirements', 'Small number of participants', 'Low latency acceptable'],
    useCases: ['Financial transactions', 'Inventory updates', 'Critical operations'],
    benefits: ['ACID guarantees', 'Strong consistency', 'Well-understood'],
    tradeoffs: ['Blocking protocol', 'Poor scalability', 'Single point of failure'],
    antipatterns: ['Using for high-scale systems', 'Too many participants'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'Database transactions', implementation: 'XA transactions across databases' }],
    diagrams: [],
    relatedPatterns: ['PTRN-012'],
    combines: [],
    alternatives: ['PTRN-012'],
    difficulty: 'intermediate',
    maturityLevel: 'mature',
    views: 5678,
    implementations: 156,
    rating: 4.3,
    references: [{ title: 'Two-Phase Commit', url: 'https://en.wikipedia.org/wiki/Two-phase_commit_protocol' }],
    tags: ['distributed-transactions', 'acid', 'consistency', '2pc']
  },
  {
    id: 'PTRN-056',
    name: 'Retry Pattern',
    patternType: 'resilience',
    category: 'Fault Handling',
    intent: 'Automatically retry failed operations',
    problem: 'Transient failures are common in distributed systems',
    solution: 'Retry with exponential backoff and jitter',
    structure: 'Service → Retry Logic → Downstream Service',
    participants: [
      { id: 'retry-logic', name: 'Retry Logic', role: 'Fault Handler', responsibilities: ['Retry failed operations', 'Handle backoff'] }
    ],
    collaborations: 'Retry logic attempts operation multiple times with delays',
    applicability: ['Transient failures', 'Network operations', 'External service calls'],
    useCases: ['API calls', 'Database connections', 'Message processing'],
    benefits: ['Handles transient failures', 'Improves reliability', 'Simple to implement'],
    tradeoffs: ['Increased latency', 'Resource consumption', 'Need idempotency'],
    antipatterns: ['Retrying non-idempotent operations', 'No backoff', 'Too many retries'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'HTTP API calls', implementation: 'Exponential backoff with jitter' }],
    diagrams: [],
    relatedPatterns: ['PTRN-015'],
    combines: ['PTRN-015'],
    alternatives: [],
    difficulty: 'beginner',
    maturityLevel: 'mature',
    views: 12345,
    implementations: 456,
    rating: 4.7,
    references: [{ title: 'Retry Pattern', url: 'https://docs.microsoft.com/en-us/azure/architecture/patterns/retry' }],
    tags: ['resilience', 'retry', 'fault-handling', 'reliability']
  },
  {
    id: 'PTRN-067',
    name: 'Strangler Fig',
    patternType: 'architectural',
    category: 'Migration',
    intent: 'Gradually replace legacy system',
    problem: 'Big-bang replacement is risky',
    solution: 'Incrementally replace functionality with new system',
    structure: 'Legacy System → Facade → New System',
    participants: [
      { id: 'facade', name: 'Facade', role: 'Router', responsibilities: ['Route requests', 'Migrate gradually'] }
    ],
    collaborations: 'Facade routes requests to legacy or new system based on migration status',
    applicability: ['Legacy migration', 'Risk reduction', 'Gradual transition'],
    useCases: ['Monolith to microservices', 'System modernization', 'Technology migration'],
    benefits: ['Reduced risk', 'Gradual migration', 'No big-bang'],
    tradeoffs: ['Longer timeline', 'Complexity during transition', 'Maintenance overhead'],
    antipatterns: ['Migrating everything at once', 'Not planning migration'],
    codeExamples: [],
    realWorldExamples: [{ company: 'Amazon', scenario: 'Monolith to microservices', implementation: 'Gradually extracted services' }],
    diagrams: [],
    relatedPatterns: [],
    combines: [],
    alternatives: [],
    difficulty: 'advanced',
    maturityLevel: 'mature',
    views: 6789,
    implementations: 123,
    rating: 4.6,
    references: [{ title: 'Strangler Fig Pattern', url: 'https://martinfowler.com/bliki/StranglerFigApplication.html' }],
    tags: ['migration', 'legacy', 'modernization', 'strangler']
  },
  {
    id: 'PTRN-078',
    name: 'Database per Service',
    patternType: 'architectural',
    category: 'Data Management',
    intent: 'Each microservice has its own database',
    problem: 'Shared database creates coupling between services',
    solution: 'Give each service its own database',
    structure: 'Service → Private Database',
    participants: [
      { id: 'service', name: 'Microservice', role: 'Owner', responsibilities: ['Own data', 'Manage database'] }
    ],
    collaborations: 'Each service manages its own data independently',
    applicability: ['Microservices architecture', 'Need for independence', 'Different data models'],
    useCases: ['Microservices', 'Domain-driven design', 'Independent scaling'],
    benefits: ['Service independence', 'Technology choice', 'Better scalability'],
    tradeoffs: ['Data consistency challenges', 'Distributed transactions', 'Data duplication'],
    antipatterns: ['Sharing databases', 'Cross-service queries'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'E-commerce microservices', implementation: 'Order service has order DB, inventory has inventory DB' }],
    diagrams: [],
    relatedPatterns: ['PTRN-012', 'PTRN-019'],
    combines: ['PTRN-012'],
    alternatives: ['Shared Database'],
    difficulty: 'intermediate',
    maturityLevel: 'mature',
    views: 7890,
    implementations: 234,
    rating: 4.7,
    references: [{ title: 'Database per Service', url: 'https://microservices.io/patterns/data/database-per-service.html' }],
    tags: ['microservices', 'data-management', 'database', 'independence']
  },
  {
    id: 'PTRN-089',
    name: 'Service Mesh',
    patternType: 'integration',
    category: 'Communication',
    intent: 'Handle service-to-service communication concerns',
    problem: 'Cross-cutting concerns in microservices are complex',
    solution: 'Infrastructure layer handles communication',
    structure: 'Service → Sidecar Proxy → Service Mesh → Service',
    participants: [
      { id: 'sidecar', name: 'Sidecar Proxy', role: 'Communication', responsibilities: ['Handle traffic', 'Apply policies'] }
    ],
    collaborations: 'Sidecar proxies handle all inter-service communication',
    applicability: ['Microservices', 'Need for observability', 'Complex networking'],
    useCases: ['Service discovery', 'Load balancing', 'Security policies'],
    benefits: ['Separation of concerns', 'Centralized policies', 'Better observability'],
    tradeoffs: ['Complexity', 'Performance overhead', 'Learning curve'],
    antipatterns: ['Business logic in mesh', 'Over-engineering'],
    codeExamples: [],
    realWorldExamples: [{ company: 'Google', scenario: 'Istio service mesh', implementation: 'Manages all service communication' }],
    diagrams: [],
    relatedPatterns: ['PTRN-023'],
    combines: [],
    alternatives: ['PTRN-023'],
    difficulty: 'advanced',
    maturityLevel: 'emerging',
    views: 4567,
    implementations: 89,
    rating: 4.5,
    references: [{ title: 'Service Mesh', url: 'https://istio.io/latest/docs/concepts/what-is-isito/' }],
    tags: ['service-mesh', 'microservices', 'networking', 'istio']
  },
  {
    id: 'PTRN-090',
    name: 'Backend for Frontend (BFF)',
    patternType: 'integration',
    category: 'API Design',
    intent: 'Create separate backend for each frontend',
    problem: 'Different frontends have different needs',
    solution: 'One backend per frontend type',
    structure: 'Mobile App → Mobile BFF → Services | Web App → Web BFF → Services',
    participants: [
      { id: 'bff', name: 'BFF', role: 'Adapter', responsibilities: ['Adapt for frontend', 'Aggregate data'] }
    ],
    collaborations: 'BFF adapts backend services for specific frontend needs',
    applicability: ['Multiple frontend types', 'Different requirements', 'Need optimization'],
    useCases: ['Mobile apps', 'Web applications', 'Third-party integrations'],
    benefits: ['Optimized for frontend', 'Better performance', 'Simplified frontend'],
    tradeoffs: ['More backends', 'Code duplication', 'Maintenance'],
    antipatterns: ['One BFF for all', 'Business logic in BFF'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'Mobile vs Web', implementation: 'Separate BFFs optimize for each platform' }],
    diagrams: [],
    relatedPatterns: ['PTRN-023'],
    combines: [],
    alternatives: ['PTRN-023'],
    difficulty: 'intermediate',
    maturityLevel: 'mature',
    views: 5678,
    implementations: 145,
    rating: 4.6,
    references: [{ title: 'Backend for Frontend', url: 'https://samnewman.io/patterns/architectural/bff/' }],
    tags: ['bff', 'api-design', 'frontend', 'integration']
  },
  {
    id: 'PTRN-101',
    name: 'Event Sourcing',
    patternType: 'data',
    category: 'Data Storage',
    intent: 'Store all changes as sequence of events',
    problem: 'Need complete history and ability to replay',
    solution: 'Store events, rebuild state by replaying',
    structure: 'Event Store → Event Handlers → Read Models',
    participants: [
      { id: 'event-store', name: 'Event Store', role: 'Storage', responsibilities: ['Store events', 'Provide stream'] }
    ],
    collaborations: 'Events stored and replayed to rebuild state',
    applicability: ['Audit requirements', 'Temporal queries', 'Event replay'],
    useCases: ['Financial systems', 'Audit trails', 'Time travel'],
    benefits: ['Complete history', 'Event replay', 'Temporal queries'],
    tradeoffs: ['Eventual consistency', 'Storage overhead', 'Complexity'],
    antipatterns: ['Storing state in events', 'Not versioning events'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'Banking transactions', implementation: 'All transactions stored as events' }],
    diagrams: [],
    relatedPatterns: ['PTRN-008', 'PTRN-019'],
    combines: ['PTRN-019'],
    alternatives: [],
    difficulty: 'advanced',
    maturityLevel: 'mature',
    views: 6789,
    implementations: 112,
    rating: 4.5,
    references: [{ title: 'Event Sourcing', url: 'https://martinfowler.com/eaaDev/EventSourcing.html' }],
    tags: ['event-sourcing', 'events', 'data-storage', 'history']
  },
  {
    id: 'PTRN-112',
    name: 'Throttling',
    patternType: 'performance',
    category: 'Rate Limiting',
    intent: 'Control rate of requests',
    problem: 'Need to prevent overload',
    solution: 'Limit requests per time period',
    structure: 'Client → Throttle → Service',
    participants: [
      { id: 'throttle', name: 'Throttle', role: 'Rate Limiter', responsibilities: ['Limit rate', 'Reject excess'] }
    ],
    collaborations: 'Throttle allows requests up to limit, rejects excess',
    applicability: ['API protection', 'Resource management', 'Fair usage'],
    useCases: ['API rate limiting', 'Resource quotas', 'DoS protection'],
    benefits: ['Prevents overload', 'Fair usage', 'Protection'],
    tradeoffs: ['Rejected requests', 'Configuration', 'Complexity'],
    antipatterns: ['No throttling', 'Wrong limits'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'API rate limits', implementation: '100 requests per minute' }],
    diagrams: [],
    relatedPatterns: [],
    combines: [],
    alternatives: [],
    difficulty: 'beginner',
    maturityLevel: 'mature',
    views: 8901,
    implementations: 267,
    rating: 4.6,
    references: [{ title: 'Throttling Pattern', url: 'https://docs.microsoft.com/en-us/azure/architecture/patterns/throttling' }],
    tags: ['throttling', 'rate-limiting', 'performance', 'protection']
  },
  {
    id: 'PTRN-123',
    name: 'Health Check',
    patternType: 'resilience',
    category: 'Monitoring',
    intent: 'Monitor service health',
    problem: 'Need to detect failures',
    solution: 'Expose health endpoint',
    structure: 'Monitor → Health Endpoint → Service',
    participants: [
      { id: 'health-endpoint', name: 'Health Endpoint', role: 'Monitor', responsibilities: ['Report health', 'Check dependencies'] }
    ],
    collaborations: 'Health endpoint reports service status',
    applicability: ['All services', 'Need monitoring', 'Load balancing'],
    useCases: ['Service discovery', 'Load balancers', 'Monitoring'],
    benefits: ['Failure detection', 'Better routing', 'Observability'],
    tradeoffs: ['Overhead', 'False positives'],
    antipatterns: ['No health checks', 'Expensive checks'],
    codeExamples: [],
    realWorldExamples: [{ scenario: 'Kubernetes liveness', implementation: 'Health endpoint for pod status' }],
    diagrams: [],
    relatedPatterns: [],
    combines: [],
    alternatives: [],
    difficulty: 'beginner',
    maturityLevel: 'mature',
    views: 5678,
    implementations: 345,
    rating: 4.7,
    references: [{ title: 'Health Check', url: 'https://microservices.io/patterns/observability/health-check-api.html' }],
    tags: ['health-check', 'monitoring', 'resilience', 'observability']
  }
);

export const getPatternById = (id: string): DesignPattern | undefined => {
  return designPatterns.find(p => p.id === id);
};

