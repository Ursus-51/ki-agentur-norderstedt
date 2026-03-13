FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY impressum.html /usr/share/nginx/html/
COPY datenschutz.html /usr/share/nginx/html/

EXPOSE 80
