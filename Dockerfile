FROM node:12

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install
RUN npm audit fix

# Copying source files
COPY . .

## docker 데몬에 매핑
EXPOSE 4000

# Running the app
CMD [ "npm", "run" ,"start" ]

## Docker run command
# docker run -d -p 4000:4000 --network=host apollo-prisma:[version]