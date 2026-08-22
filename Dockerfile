# rtnp-website — documentation static site → docs.rtnp.in. No build step; nginx
# serves the HTML/CSS/JS directly. arm64. .dockerignore keeps repo cruft out of
# the web root.
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# nginx.conf is copied into the web root by the line above; remove it so it isn't served.
RUN rm -f /usr/share/nginx/html/nginx.conf
EXPOSE 80
