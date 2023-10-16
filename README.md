Per the requests
The app does not require a backend, but because this is meant to be a productivity app losing all your todos by closing the tab is a NO NO.
DATA PERSISTENCE is achieved using the in built IndexDB database of the browsers. 
There are some issues with the boundaries of the drag boxes and sorting might behave inconsistently..
IndexDB is "supported by most modern browsers" regarless it is still a finicky thing to work with and requires cross browser testing to ensure reliability. To run this app use Chrome, or some other V8 based browser like brave, opera, edge, etc.
This react app run using the vite build tool;

Running the app
The app comes preconfigured with the all the packaged needed to run, build and deploy the app.
Simply clone the repo, cd into it,and run npm install; npm run dev;

To run this project you need to have npm on your pc. If you already have it configured, copy and paste the following commands.
git clone https://github.com/utajaraj/mt3.git mt3; cd mt3; npm install;npm run dev;

The build path outputs at dist. If you change it is is also important to change the 'scripts' entry package.json file, and change the -d (dirsctory flag of the deploy script to the appropriate new build folder.)
 "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "deploy":"gh-pages -d dist"
  },

The base path of the app is at mt3, if it is deployed under a different path it is important to update the base entry in the vite.config.ts file.
export default defineConfig({
  base:"/mt3",
  plugins: [react()],
})

To avoid some errors here and there the project uses typescript and strict mode, you can change that by removing the React.StrictMode wrapper
      <React.StrictMode>
        <App />
      </React.StrictMode>

Usage
- The items in the list can be dragged while being pressed to rearrange their order.
- Clicking on the active toggler in each card change the status of the item
- The same menu has three options. One to access the new tasks form, one to delete every item mt3, and one to change all tasks statuses to deleted. 

VERY IMPORTANT === THE "DELETE ALL TASKS" LINK IN THE SIDENAV WILL ERASE DATA FROM THE DATABASES IF YOU ONLY WANT TO CHANGE ITEMS TO DELETED CLICK THE "CHANGE ALL COMPLETED TO DELETED"

The "change all completed to deleted" will change the status of "Done" items to "Deleted" - ONLY "DONE" ITEMS, items labels active won't be affected


For any further questions my email is:
chavezutajara@gmail.com