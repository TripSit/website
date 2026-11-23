

## Keep website and TripBot CI/CD aligned

When changing CI/CD in this repository, inspect the sibling `../tripbot` repository and apply the
same shared behavior changes there in the same task. This includes GitHub Actions workflows,
Drone pipelines, PR checks, UAT merge queues, test/coverage artifacts, SonarScan, and release policy.
Preserve each application's required Node version, install/build/test commands, generated clients,
Docker targets, and deployment settings. Repository-specific integrations (such as TripBot's Claude
and bounty workflows) may remain separate. Document intentional differences and validate both repos.
If the sibling repository is unavailable or cannot be edited, report the missing matching change
explicitly instead of claiming CI/CD parity.
