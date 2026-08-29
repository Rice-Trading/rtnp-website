# rtnp-website — documentation static site → docs.rtnp.in. No build step; nginx
# serves the HTML/CSS/JS directly. arm64. .dockerignore keeps repo cruft out of
# the build context.
# Prep stage runs as root so it can freely drop nginx.conf/Dockerfile/README
# before the site content ever reaches the nginx-unprivileged stage below.
# nginxinc/nginx-unprivileged only makes /var/cache/nginx and /etc/nginx
# group-writable for its non-root user — /usr/share/nginx/html stays root-owned
# with no write bit, so a RUN in that stage can never delete a file from it.
FROM alpine:3 AS prep
WORKDIR /site
COPY . .
RUN rm -f nginx.conf Dockerfile .dockerignore README.md

# nginx-unprivileged: runs as the non-root `nginx` user with no root master
# process (stock nginx:alpine starts its master as root to bind port 80).
# Caddy's reverse_proxy upstream targets :8080, not :80.
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=prep /site /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
