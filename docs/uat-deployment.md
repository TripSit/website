# Website UAT deployment

UAT uses a signed hook on its own host, matching the production deployment model.
Both `.drone-uat.yml` and the UAT document in `.drone.yml` carry this pipeline,
so existing and split-file Drone configurations use the same restricted runner.
The infrastructure package is maintained in `TripSit/live`, under
`docker/deploy-uat/`, with additive website-deployer/runner compose configuration.
Provision and verify it before merging the corresponding `.drone.yml` change.

The website job selects `env: uat, role: website-deploy`, disables checkout, and
receives only `WEBSITE_UAT_DEPLOY_HOOK_SECRET`. Its runner injects no host files,
permits no privileged images, and attaches jobs to the private hook network rather
than the Docker API network. The old runner is restricted to TripBot on the server,
so editing a website pipeline's node selector cannot recover the old privileges.
Notification credentials remain scoped to the notification step.

The hook authenticates each request and accepts only website/current-UAT commits.
It uses the server-owned `docker-compose.website.yml`, builds the exact requested
SHA through an override, scopes Compose to `website --no-deps`, verifies the image
revision, and waits for native HTTP readiness. Build logs and runtime settings stay
on the server. CI requires both a success marker and the exact deployed SHA.
Only a busy response explicitly stating that no deployment started is retried;
a connection timeout must not be retried automatically.

The three `NEXT_PUBLIC_*` browser settings are required build arguments in the
server-side override. Keep the appeals client ID aligned with TripBot's public
appeals client; runtime-only values cannot change an already-built browser bundle.
The server's private environment also preserves the current Discord statistics
settings. Do not copy runtime tokens or hook keys into Git.

Historically, the shared runner mounted the host's compose file into every step
as `/drone/src/docker-compose.website-prod.yml`, plus `.env.drone`. That explains
why this filename was absent from the website repository. The signed-hook runner
removes those mounts; it does not need a checkout or a compose file in its job.
The repository's `docker-compose.website.yml` remains for local development.

After cutover, record the Drone build, exact commit/image revision, HTTP readiness,
notification result, and actual job mount/network/privilege inspection. Preserve
the previous healthy image/configuration for recovery. The infrastructure runbook
covers provisioning and verification; a pipeline-only merge is not a complete cutover.
