###################
# BUILD FOR LOCAL DEVELOPMENT
###################
# In this step we copy over everything we need and install all dependancies
# We stop at the end of this step in development, so it also includes the deploy command
# We install jest, eslint and ts-node so we can run tests and lint.

FROM node:lts-alpine AS development

ENV NODE_ENV=development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
# Use NPM CI even though this may be your first time, cuz package-lock already thinks you installed stuff
# The cache mount persists npm's download cache across builds on the same host,
# so unchanged dependencies don't get re-fetched every time.
RUN --mount=type=cache,target=/root/.npm npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
# USER node

# For container development, the following command runs forever, so we can inspect the container
CMD ["npm", "run", ".dev"]

###################
# BUILD FOR PRODUCTION
###################
# This stage prepares for and builds the production .js code
# We copy over the node_modules directory from the development image to ensure that the production image has access to all the dependencies it needs
# Then we copy over everything else that may be needed to run
# We run the build command which creates the production bundle
# `output: "standalone"` (next.config.js) makes `next build` trace each page's
# real dependencies into .next/standalone, so we no longer need a second
# `npm ci --omit=dev` pass to shrink node_modules afterward.

FROM node:lts-alpine AS build

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Copy over the existing source code
COPY --chown=node:node . .

# The cache mount persists Next's webpack/turbopack build cache across builds
# on the same host, so unchanged pages don't get fully recompiled every time.
RUN --mount=type=cache,target=/usr/src/app/.next/cache npx next build

###################
# PRODUCTION
###################
# This stage creates the final, small-as-can-be, production image.
# The standalone build already contains a minimal server.js plus only the
# node_modules each page actually needs, so we just copy that output over
# along with the static assets it doesn't bundle by default.

FROM node:lts-alpine AS production

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/static ./static
COPY --chown=node:node --from=build /usr/src/app/.next/standalone ./
COPY --chown=node:node --from=build /usr/src/app/.next/static ./.next/static

USER node

CMD ["node", "server.js"]