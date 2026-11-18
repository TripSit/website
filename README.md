# TripSit's Website

## Table of Contents

- [TripSit's Website](#tripsits-website)
  - [Development - Getting Started](#development---getting-started)
    - [Codespace](#codespace)
    - [Local development](#local-development)
      - [Docker Deployment](#docker-deployment)
      - [Local Deployment](#local-deployment)
  - [Contributing](#contributing)

Welcome to TripSit's Main Website, brought to you by THC.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development - Getting Started

You have two options:

### Codespace

The easiest way to get going is to create a codespace.

This will automatically set up a development environment for you, and you can start editing the code right away.

1) Create a codespace from the repo.
2) Run `npm install` to make sure the dependencies are installed (this has been needed in the past).
3) Run `npm run dev` to start the development server.
4) GitHub will offer a link to the running site, where you can see your changes.
5) Develop and commit as normal; your changes are reloaded automatically.

### Local development

The preferred way to have full control (and perhaps more resources) is local development.

1) Clone the repo.
2) Install dependencies with `npm install`.

> [!WARNING]
> Windows users may have to adjust dependencies locally. If you have problems, try installing Node through NVM
> (for example with winget).

Then you have two choices:

#### Docker Deployment

The preferred way to deploy is with Docker.
This ensures that we're running on the same system with no conflicts.

1) Run `npm run website` to build the Docker image.
2) Run `npm run logs` to see the logs from the container.
3) Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

#### Local Deployment

If you can't run Docker for whatever reason, or you're in a codespace:

1) Run `npm run dev`.
2) Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

> [!WARNING]
> **This method isn't supported. Try a codespace before using it.**

It has worked on an Ubuntu VPS, and on Windows as of 2/1/2025. If it fails on Windows, try WSL before NVM.

`npm run build` makes a production build, and `npm start` serves it.

## Contributing

The full combination chart, translations, and PNG/PDF generation are documented in
[docs/combo-chart.md](docs/combo-chart.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) for branching conventions (feature branches target `uat`, not `main`) and
the checks that run in CI.

## Staff appeal review

The staff appeal queue is available at `/dashboard/appeals`. See
[staff appeal review setup](docs/staff-appeal-review.md) for the separate staff
Keycloak client, runtime settings, TripBot API contract, and rollout checks.
