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

yes | docker login -u $REG_USER -p $REG_PASSWORD $REGISTRY
docker push $REGISTRY/$APP_NAME:$CIRCLE_TAG

ssh deploy@$SERVER_IP "docker login -u $REG_USER -p $REG_PASSWORD $REGISTRY && env CERT_VERSION=1 ENVIRONMENT=$CIRCLE_TAG docker stack deploy --with-registry-auth --compose-file docker-compose.yml $STACK_NAME && docker container prune -f && docker image prune -f"

curl -s https://api.rollbar.com/api/1/deploy/ \
    -F access_token=$ROLLBAR_TOKEN \
    -F environment=$CIRCLE_TAG \
    -F revision=$CIRCLE_SHA1 \
    -F local_username=$CIRCLE_USERNAME \
    -F comment=$CIRCLE_BUILD_URL \
    > /dev/null

exit 0
