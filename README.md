# TripSit's Website

 ## Table of Contents

---
[TripSit's Website](#tripsits-website)

- [TripSit's Website](#tripsits-website)
  - [Development - Getting Started](#development---getting-started)
    - [Codespace](#codespace)
    - [Local development](#local-development)
      - [Docker Deployment](#docker-deployment)
      - [Local Deployment](#local-deployment)

---!
Welcome to TripSit's Main Website, brought to you by THC.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development - Getting Started

You have two options:

### Codespace

The easiest way to get going is to create a codespace.

This will automatically set up a development environment for you, and you can start editing the code right away.

1) Create codespace from the repo
2) Run `npm install` to makes sure it installed properly ig, this was an issue when i tried, ill loop back eventually
3) Run `npm run .dev`if linux user or 'dev' if windows user to start the development server.
4) Github will pop up with a thing you can click to be taken to the live site where you can see your changes.
5) Develop and commit as normal, your changes should be refreshed automatically.
---
### Local development

The preferred way to have full control (and perhaps more resources) is local development.

1) Git clone the repo
2) Install dependencies with `npm install`


> [!WARNKNG]
> WINDOWS USERS MIGHT HAVE TO ADJUST DEPENDENCIES LOCALLY AS WITH TRY INSTALLING NVM THROUGH WINGET IF PROBLEMS OCCUR

Then you have two choices:

#### Docker Deployment

The preferred way to deploy is with docker.
This ensures that we're running on the same system with no conflicts.

1) Run the `npm run website` command to build the docker image
2) Run the `npm run logs` command to see the logs from the container
3) Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### Local Deployment

If you cannot run docker for whatever reason, or you're in codespace.

1) run the `npm run .dev` command
2) Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
> [!WARNING]
> **There is no support for this method, use a codespace before you use this method**


But it worked on my system (tm) when im running on an ubuntu vps, so give it a shot.
Also now works on windows as of 2/1/2025 on my machine (tm), if fails try WSL first before NVM
