FROM node:24 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24 AS development
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/drizzle ./drizzle
CMD [ "npm", "run", "dev" ]


FROM node:24 AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/drizzle ./drizzle
RUN npm ci --only=production
CMD [ "npm", "run", "start" ]