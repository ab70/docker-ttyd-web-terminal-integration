### Pull ttyd(which serves terminal over web) image
```
docker pull tsl0922/ttyd:alpine
``` 

### Then go to server and start (:30001)
```
bun run server.js
```

### Then go to frontend and run that. (:3000)


### TO test if that docker terminal can be accessed via the terminal use this:
```
docker run -d -p 7682:7681 --tty --interactive tsl0922/ttyd ttyd --port 7681 --check-origin=false --writable /bin/bash
```
