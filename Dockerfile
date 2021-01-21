FROM registry.access.redhat.com/ubi8/nodejs-12

LABEL name="Stakater Playbook" \
      maintainer="Stakater <stakater@aurorasolutions.io>" \
      vendor="Stakater" \
      release="1" \
      summary="Stakater Playbook"

# set workdir
RUN mkdir -p $HOME/application
WORKDIR $HOME/application

# copy the entire application
COPY --chown=1001:root . .

# install yarn globaly
RUN npm install -g yarn

# download the application dependencies
RUN yarn install

# build the application
RUN yarn run build

# Change ownership of cache to make it writable
RUN chown -R 1001 ~/.cache

# Change permissions to fix EACCESS permission errors
RUN chmod -R 755 $HOME

# set non-root user
USER 1001

ENTRYPOINT ["yarn", "run", "serve"]
