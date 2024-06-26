FROM node:18

#Set working directory
WORKDIR /var/src/

#Copy package.json file
COPY ./src/package.json .

#Install node packages
RUN npm install --unsafe-perm || cat npm-debug.log
#Copy all files 
COPY ./src .

#Expose the application port
EXPOSE 3567

#Start the application
CMD [ "node", "app.js" ]
