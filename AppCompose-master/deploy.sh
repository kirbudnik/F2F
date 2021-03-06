#!/bin/bash

case $CIRCLE_TAG in
    production )
        # noop, SERVER_IP is production IP by default
        ;;
    staging )
        SERVER_IP=$SERVER_IP_STAGING
        ;;
    * )
        echo "Unrecognized environment: $CIRCLE_TAG"
        exit 1
        ;;
esac

rsync -avz -e 'ssh' ./prod/docker-compose.yml deploy@$SERVER_IP:/home/deploy/docker-compose.yml

ssh deploy@$SERVER_IP "docker login -u $REG_USER -p $REG_PASSWORD $REGISTRY && env CERT_VERSION=1 ENVIRONMENT=$CIRCLE_TAG docker stack deploy --with-registry-auth --compose-file docker-compose.yml $STACK_NAME && docker container prune -f && docker image prune -f"


exit 0
