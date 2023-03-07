# Install dependencies
FROM node:19 as ubuntu

WORKDIR /app

ADD ./.env.production .env.production
ADD ./public public
ADD ./.next .next
ADD ./package.json package.json
ADD ./next.config.js next.config.js
ADD ./run.sh run.sh

RUN npm install --only=production

# Copy built service into production image
FROM node:19-alpine as alpine
COPY --from=ubuntu /app /app

WORKDIR /app

ENV NODE_ENV="production"
EXPOSE 3000
CMD [ "npm", "start" ]
