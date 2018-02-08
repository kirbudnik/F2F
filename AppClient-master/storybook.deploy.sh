if [ -z $branch ]; then
    echo "branch argument is required"
    exit 1
fi

ADDRESS="138.197.128.225"
SERVER="root@$ADDRESS"
DIRECTORY="/app/container/dist/$branch"

echo "Deploying storybook to $SERVER:$DIRECTORY"

ssh $SERVER "mkdir -p $DIRECTORY"
cd "./.storybook_static/$branch"
scp -r * "$SERVER:$DIRECTORY/"
