# AppClient

## Purpose
This builds and serves a single page browser script for f2f.live. This includes all the UI components but nothing related to the live video.  


## Setup
This part needs to be performed regardless of which build you are using.
```shell
# Clone the repo
git clone
cd AppClient

# Install dev dependencies
npm install --only=dev

# You will need a .env file to run webpack
cp .env.example .env
```


## Storybook
#### Storybook Build
```shell
npm run storybook
```
Storybook should be visible at http://localhost:6006/

#### Storybook Deployment
Deploy to our storybook server to share your changes.
```shell
npm run storybook:build
```
Replace `$BRANCH` with your branch name in the url below to view your changes.
http://138.197.128.225:6007/$BRANCH
Example: http://138.197.128.225:6007/feature/storybook_static


## Api
Https is required to use WebRTC in Chrome as of v47. We use valid ssl keys for the `dev.f2f.live` domain. They are not included in the repo and need to be obtained from an admin.  
1.
```shell
# Run webpack
npm run webpack
```
2.
- Obtain the `dev.f2f.live` private keys from an admin
- Add `fullchain.pem` and `privkey.pem` to `/dev_keys/secrets`
- Map `dev.f2f.live` to `127.0.0.1` on your machine by editing your hosts file

3.
- Follow the instructions in the AppCompose repo to test with the full api.  




## Compatibility
**Browser versions:**  
Chrome: 43+  
Firefox: 40+  
Opera: 37+  
Edge: 15+  
Safari: 11+  

**Devices:**  
Mac  
Windows  
Linux  
Android  
iOS: 11+  
