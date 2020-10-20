FROM node:alpine3.12

WORKDIR /build
COPY . .

WORKDIR /build/client
RUN npm install -production && npm run build
RUN cp -R build/* ../server/public

WORKDIR /build/server
RUN npm install -production

FROM node:alpine3.12

EXPOSE 8080
ENV ENVIRONMENT=test

WORKDIR /root
COPY  --from=0 /build/server ./server
COPY  --from=0 /build/configuration ./configuration
WORKDIR /root/server

ENTRYPOINT ["npm","start"]
