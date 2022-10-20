################################################
# Example Dockerfile for a common Node.js file #
################################################

# You can change this file if you need but read this first
# https://github.com/matilda-applicants/common-tasks-instructions/wiki/Docker-on-your-task

# Most up to date Node.js version (14) from alpine lightweight image.
# You can change it to 
# FROM node:lts-alpine # for Node.js 12
# FROM node:10-alpine3.10 # for Node.js 10
# or any other listed here https://hub.docker.com/_/node/
FROM node:current-alpine as ts-compiler

# Directory inside the container where your app code will live.
# You probably won't need to change this
WORKDIR /usr/app/

# This will export the PORT environment variable to your application.
# It has 12345 as default value, but when running the container we might pass
# any other port. You shouldn't change this unless you really know what you are doing.
ENV PORT 12345

# This will export the SUGGESTION_NUMBER environment variable to your application.
# It has 10 as default value, but when running the container we might pass
# any other value
ENV SUGGESTION_NUMBER 10

ENV HOST http://localhost:3000/

# Avoid changing this too; it will expose the port so
# other containers can connect to your app.
EXPOSE $PORT

# Copy just the needed files to install your dependencies.
# This is an optimization since these files change very little,
# so by copying just these files initially we'll be able to
# "cache" the layer that creates the node_modules, greatly increasing
# the speed of your build.
# If you are using `yarn` you might want to change this to
# COPY package.json yarn.lock ./
COPY package.json package-lock.json ./

# Add Typescript deps and configs
COPY tsconfig.json tsconfig.json ./

# Copy all the rest of the code
COPY . ./

# Now install dependencies. It's good to do this before copying the rest of the code
# so we take advantage of caching a docker layer that has the dependencies installed
# independently on whether the rest of the code changes.
# If you want to use yarn, change to
# RUN yarn
RUN npm install


# Finally, tell the container how to run your app. Imagine you "split"
# the command you usually use with spaces and write that array. This simple one
# will work if your app starts on the `index.js` file. Other possible ways
# you might want to run our app are:
# CMD [ "npm", "run", "start" ]
# CMD [ "yarn", "start" ]
CMD [ "npm", "build" ]

# Remove TS content
FROM node:current-alpine as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./
COPY --from=ts-compiler /usr/app/names.json ./
RUN npm install --only=production

# Install distroless and deps only
FROM gcr.io/distroless/nodejs:14
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
USER 1000
CMD ["main.js"]