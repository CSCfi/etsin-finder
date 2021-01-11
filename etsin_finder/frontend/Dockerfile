# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /etsin_finder/frontend/

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
# ADD package.json /etsin_finder/frontend/package.json
COPY package.json package.json
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

# start app
CMD ["npm", "run", "watch"]
