# TripSit's Website

I. I. ## Table of Contents

- [TripSit's Website](#tripsits-website)
  - [Development - Getting Started](#development---getting-started)
    - [Codespace](#codespace)
  - [Local dev env](#local-dev-env)
  - [Local development](#local-development)
  - [Docker Deployment](#docker-deployment)

---!
Welcome to TripSit's Main Website, brought to you by your friends at Tripsit!

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development - Getting Started

You have two options:

### Codespace

The easiest way to get going is to create a codespace.

This will automatically set up a development environment for you, and you can start editing the code right away.

1) Create codespace from the repo

2) Run `npm install` to install website packages, this will display "WARNING"/"CAUTIONS" for the most part, these can be ignored, and you do not need to run the npm audit command, as these packages are monitored by us and actively handled.

3) Run `npm run .dev` to start the server within the code space.

4) Make your changes, and make a PR as you would normally on desktop. (WIP) And Please follow the style format and rules in the contributors.md

## Local dev env

1) Create codespace from the repo

2) Run `npm install` to install website packages, this will display "WARNING"/"CAUTIONS" for the most part, these can be ignored, and you do not need to run the npm audit command, as these packages are monitored by us and actively handled.

3) Run `npm run .dev`if linux user or 'dev' if windows user to start the development server.

4) If you are on linux please install via your package manager "git", and optionally "gh" which is a huge helper. If on windows please download git from this following link, press WIN key type "Optional features" enable WSL, Virtual Machine platform and OpenSSH client(For your signing and auth keys)

5) *Skip if you have SSH keys* If you have not already, both linux and windows type into the CLI, `ssh-keygen` and follow the prompts, cd into the directory of where it was saved, and upload the key to your github profile under settings.

>[!NOTE]
>DO NOT UPLOAD YOUR PRIVATE KEY, YOUR PUBLIC KEY IS THE F9LE THAT ENDS WITH THE EXTENSION ".pub"

## Local development

The preferred way to have full control (and perhaps more resources) is local development.

1) Git clone the repo
2) Install dependencies with `npm install`

---
> [!WARNING]
> **Local development is not supported officially in this way**:
> WINDOWS USERS MIGHT HAVE TO ADJUST DEPENDENCIES LOCALLY AS WITH TRY INSTALLING NVM THROUGH WINGET  IF PROBLEMS OCCUR
---

## Docker Deployment

**The preferred way** to deploy is with docker.
This ensures that we're running on the same system with no conflicts.

1) Run the `npm run website` command to build the docker image

2) Run the `npm run logs` command to see the logs from the container

3) Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
