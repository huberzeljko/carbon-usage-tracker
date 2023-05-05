FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install

COPY . .

# Build the app (for production use --production flag to exclude devDependencies)
RUN yarn build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
