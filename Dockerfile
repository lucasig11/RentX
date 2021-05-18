FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

# copy the project files to the container root dir
COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]
