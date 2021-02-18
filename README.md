# Youtube video and playlist downloader

## :hand: Getting Started
- Clone This project
- Create `.env` file in project root
- Insert `.env.example` vars in `.env`
- Install packages with the commands `yarn` or `npm i`
- To start the Server you need to run: `yarn dev` or `npm run dev`
- If you want to see the frontend you can clone it clicking [here](https://github.com/arthurguedes375/youtube-video-and-playlist-downloader-frontend)

## :satellite: Env vars
- ` HTTP_PORT ` is the server's HTTP PORT example(on this example the port is 3333): ` http://localhost:3333 `)
- ` DOMAIN ` is the server's domain example(on this example the domain is example.com): ` http://example.com `)
- ` FORCE_COMPRESSING ` this var defines if the user can or not choose  about compress the whole playlist in a single file, if you are developing then turn it OFF but if it is on production then turn it ON
- ` YOUTUBE_API_SECRET ` is the youtube api access token you can get one using this [link](https://developers.google.com/youtube/registering_an_application)
- ` LOGS ` if you want to see the download progress and the compression's data and if the download is done you turn it on but if you dont want to see the progress just turn it off
- ` WORKERS ` is how many videos you want to install per time, each worker install one video per time and when the video is downloaded the worker go to the next, but for example if you have 5 workers then each one will install 1 video at the same time, so you can install the same quantity of videos in a shorter time(1/5 of the time) but if you have more workers the app will use more internet and more computional processing for the time that it is downloading, so if you have a bad wifi or a bad computer then I recommend you to set it as 7, but if you have a good computer and a good internet then I recommend you to set it as 20, even if you have a really good computer and a really good internet I DO NOT recommend you to use more than 20

## :recycle: Contribute
- Clone this Project
- Make a branch with your feature
- Commit your changes
- Make a pull request

## :bulb: Tips
- If you want to see the routes docs
- On the vscode press <kbd>CTRL+P</kbd>
- Paste it: `ext install develiteio.api-blueprint-viewer` then press <kbd>Enter</kbd>
- Go to the file: `routes.apib` and press on top-right on of those buttons will show you a preview

<p align="center">Made with :heart: by <strong>Arthur Guedes</strong></p>
