FROM nginx

COPY nginxBuilder.sh /
RUN chmod +x /nginxBuilder.sh

COPY nginx.conf /etc/nginx/
COPY mime.types /etc/nginx/

RUN mkdir -p /app/dist

COPY ./dist /app/dist

CMD /nginxBuilder.sh
