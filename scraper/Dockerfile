# Install dependencies
FROM node:19 as ubuntu

WORKDIR /app

ADD ./dist dist
ADD ./package.json package.json
ADD ./run.sh run.sh

RUN npm install --only=production

# Copy built service into production image
FROM node:19-alpine as alpine
COPY --from=ubuntu /app /app

WORKDIR /app

ENV NODE_ENV="production"
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
