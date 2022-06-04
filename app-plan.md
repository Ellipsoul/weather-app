## Overall Plan for Weather App

### Technologies

- Angular
- TypeScript
- Tailwind
- PWA
- Angular Material
- Parallax Effect: https://www.youtube.com/watch?v=UgIwjLg4ONk
- Weatherapi: https://www.weatherapi.com/my/
- Firebase

### Logic and Features

#### Pages

- Homepage - supports realtime weather query
- User profile - for logged in users

##### Homepage

- General introduction and info about app
- Support current weather query, without Firebase login or query saving

##### Profile Page

- User profile page maybe showing:
  - The day they signed up
  - Number of queries they have made for current and forecast weather

##### Side Nav

- Instead of a separate dashboard page, have a drawer that opens from the side.
- If the user is not logged in, there will be a prompt to log the user in here, as well as a log out button at the botom here.
- User can click on a previous query, and a new query will be made. Search bar will also be filled with that query.
- Navigation can remain at the top, but selecting either realtime or forecast weather should occur in the bottom row, with some animated tab switching when navigating between request types.

#### Logic

Autocomplete
- Need to provide autocomplete for the user. Debounce the search query every 1 second and return a list of the possible options to select.
- Also need to find a way to ensure user cannot submit a search for a location that isn't provided.

API Queries
- Use observables!

Interfaces
- There are a lot of objects to handle from the API. Maybe have a file containing all the interfaces that will be returned


Units
- Units toggle between metric and imperial!
  - F and C
  - mph and kph
  - Maybe some others related to pressure

Online
- PWA will only work when the app is online.
- Navigation.online observable to warn users if they are offline.

#### Supported Weather Queries

- Support current weather (detailed view) and future 3-day forecast weather (less detail for 7 dats)
- Only authorised userse can use the 3-day forecast feature
- To keep things simple, do not allow users to select the number of days for forecast, otherise grid can be messed up

#### Authentication Model

- Authguard for User Profile will be implemented
- If users log in with Google, they can use both weather query features
- QUERIES will be saved for easy future access, useres can access these from the side drawer
- When clicking on a new query, the app will make a new API request for fresh data
- Consider storing the stale weather data, in case the servers are down, and return that data
- Include some note about being on the free plan if API call fails because of only 95.5% uptime for free users.
