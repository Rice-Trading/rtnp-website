# rtnp-website — documentation static site → docs.rtnp.in. No build step; nginx
# serves the HTML/CSS/JS directly. arm64. .dockerignore keeps repo cruft out of
# the web root.
# nginx-unprivileged: runs as the non-root `nginx` user with no root master
# process (stock nginx:alpine starts its master as root to bind port 80).
# Caddy's reverse_proxy upstream targets :8080, not :80.
FROM nginxinc/nginx-unprivileged:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# nginx.conf is copied into the web root by the line above; remove it so it isn't served.
RUN rm -f /usr/share/nginx/html/nginx.conf
EXPOSE 8080
