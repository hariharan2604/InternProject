# Use the latest official Node.js runtime as a parent image
FROM node:latest


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install



# Copy the rest of the application code
COPY . .


# Expose the port your app will run on
EXPOSE 4000

# Define the command to start your Express.js app
# CMD ["npx", "sequelize-cli", "db:migrate", "npm", "start"]

