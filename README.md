## How-To
To run the app in development mode, please run theses commands:
```
npm run dev
```

If you want to have a build check, this command will the the job for you:
```
npm run build
```

After the build if you want to test the shippable version of the app, you can go with:
```
npm run preview
```

<br>

# Assessment Breakdown. 

Hello Instatus team,

First of all I decided cut of the quality of the the backend code to able to manage delivering this task relying on the big challenges at the frontend.

So for the frontend I chose to go with sort of a mix of clean and hexagonal architecture following the concept of Domain-Driven design. alongside your required/preferred stack of packages I tried to make the client code as performant as possible, page prefetches the data before react components being rendered considering this is a POC the implementation might get enhanced in production case with loaders, server-side-fetched data or event to show a loading indicator and waiting for the request to get initiated after the page component being mounted. regarding the search feature is being debounced I didn’t try hard to try to make SWR listen to my abort signals to avoid any race condition relying on SWR documentations that SWR might help avoiding this scenario. Filters button doesnt provide any real interaction (UI only). exporting make the user save a copy of the complete history of the logs or even the logs in a specific period of time live button connects to an SSE request being streamed from the backend, once it’s activated user should be able to have a synchronized version of the logs respecting any newly created event to be also shown on the list as long as the user is still using the app.

I believe nothing fancy or need description about the list, I chose to try a new package “virtuoso” to handle the rendering optimization for me relying usually on “react-window” also integrated MobX to make the events list state piece comfortably dealing with the frequent changes the backend streams.

Quality: 

- re-renders aside any list-virtualization behaviour any newly added item to list doesn’t propagate any re-render for its siblings.
- didn’t have time to handle the accessibility of the page/table.
- Markup code readability isn’t that good as a matter of relying on tailwind utility classes.
- Again, didn’t have the luxury of time to optimize any animation FPS for the sliding animation of the newly add list item.
- Didn’t have the time to check the bundle size or any unused npm package.

Overall, I enjoyed the task it might get optimized from many different aspects in a real-world app all along from system design for example transaction processing system till reaching the client making it accessible, more performant more of a product-driven feature.