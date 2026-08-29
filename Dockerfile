# rtnp-website — documentation static site → docs.rtnp.in. No build step; nginx
# serves the HTML/CSS/JS directly. arm64. .dockerignore keeps repo cruft (including
# nginx.conf itself) out of the web root.
# nginx-unprivileged: runs as the non-root `nginx` user with no root master
# process (stock nginx:alpine starts its master as root to bind port 80). Since
# the base image's USER carries over to every instruction below, COPY/RUN here
# run as that non-root user too — no write access to fix up files after the
# fact, so .dockerignore must keep nginx.conf out of the build context instead.
# Caddy's reverse_proxy upstream targets :8080, not :80.
FROM nginxinc/nginx-unprivileged:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
