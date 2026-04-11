# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy only frontend project
COPY mini-jira-frontend/package*.json ./

RUN npm install

COPY mini-jira-frontend .

RUN npm run build

# Stage 2: Serve using nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]