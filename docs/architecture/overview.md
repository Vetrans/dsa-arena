# NYC DSA Arena architecture

The application is a modular monolith: stateless Express API instances, MongoDB for durable state, and Redis for cache, rate limits, queues, and socket coordination. Submission execution remains a future worker module and must run outside the API process via Judge0.

Authentication uses short-lived signed access-token cookies and rotating opaque refresh-token cookies. Refresh tokens are stored only as SHA-256 hashes in the `sessions` collection.

`/health/live` confirms process liveness; `/health/ready` confirms MongoDB and Redis readiness for load-balancer routing.
