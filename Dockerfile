FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# The "" are not needed, can be removed when values are inserted.
ENV REACT_APP_API_URL=""
ENV REACT_APP_FIREBASE_DB_URL=""
ENV REACT_APP_VAPID_PUBLICKEY=""

# Bundle app source
COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]