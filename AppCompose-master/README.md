# AppCompose

1. Map `dev.f2f.live` to `127.0.0.1` in your hosts file. This allows us to use a valid ssl certificate for local development. As an example, on a Mac it will look something like this (observe the last line):
```shell
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
127.0.0.1       dev.f2f.live
```
2. Clone [AppClient](https://github.com/facetofacebroadcasting/AppClient) and follow the README to set it up.
3. Clone [AppApi](https://github.com/facetofacebroadcasting/AppApi) and follow the README to set it up.
4. Clone this repo and start docker:
```shell
# Clone the repo
git@github.com:facetofacebroadcasting/AppCompose.git

# Run docker
cd AppCompose
docker-compose up

# ...some time later when you are finished using it
docker-compose down

# Use this instead if you are working on the video stack locally instead of using the production video stack (you will know if this is the case).
docker-compose -f docker-compose.yml -f docker-compose.video.yml up
```

By default, when everything is running, the html file is served at https://dev.f2f.live:444.
