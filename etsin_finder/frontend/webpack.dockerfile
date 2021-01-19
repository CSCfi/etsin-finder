# Load base image (node)
FROM node:12.2.0-alpine

# Set working directory
WORKDIR /etsin_finder/frontend/

# Install npm packages based on package.json
RUN npm install

# Bundle app source
COPY . .

# Make port available
EXPOSE 8080

# Start development-configured app (see the command scripts.start inside the file ./package.json for details)
CMD ["npm", "run dev-build"]
