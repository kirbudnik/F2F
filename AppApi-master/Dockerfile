FROM node:8.5.0-wheezy

RUN mkdir /app
WORKDIR /app
ENV NODE_ENV production	

	

COPY package.json /app
RUN npm install --production

COPY ./container /app

CMD [ "node", "index.js" ]	


