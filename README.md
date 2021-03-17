# Collaborative_Sketchbook
## Built in Node js,mongodb and Socket.io (Web socket)

###Git configuration steps to setup in local machine:
1.Run this command `git clone https://github.com/sukanya934/Collaborative_Sketchbook.git`.
2.After successfully done with cloning,run `npm install` to install all dependencies.
3.Create a local database in mongodb named `test`.
4.Import exported file `users.json` which is inside `database` folder under `root` directory.

###Run Nodejs server
1. Run `npm run start` to start the server.
2. Open your browser and go to `http://localhost:3000`



#Notes--> overall functionality.How it is going to work.

`After Login, a blank drawing panel will open.
When one user draws something in the panel and saves it,another user can view the last saved drawing by clicking on the load button.
They also can draw over this file and save it ,as per the functionality the same can be opened by another user as well.
There is a clear button available for all the user.If any user wants to clear the whole drawing,they can do so by this button and once they save the file , it will be overridden.`
