# Flicks & Flops

Welcome to Flicks & Flops, a movie booking website built with React, Vite, and the TMDB API

Browse movies, view movie details, pick your seats, and book tickets. Every movie also gets a verdict. Anything rated 7.0 or higher is a Flick 🍿, and everything below 7.0 is a Flop 🍅 🤮

Some parts of the app are not working correctly and incomplete.

Use the checklists to keep track of where you are. You have 50 minutes to complete all sections. If you get stuck, you can move on. You may solve them in any order.

**Go over the 3 sections to help finish it up!**

☐ Open the website and evaluate it

## Bugs to Fix

☐ **1** The homepage is not loading any movies from the TMDB API

☐ **2** The movie API is not importing correctly

☐ **3** The movie details page shows an unexpected value instead of the movie information

☐ **4** The booking total is calculated incorrectly when selecting multiple seats

☐ **5** The "8 seats per booking" warning appears after selecting 5 seats instead of 8

☐ **6** Today's date is missing from the booking date picker

☐ **7** Clicking the Cinema Booking System logo does not return to the homepage

☐ **8** The actors are sorted alphabetically instead of by popularity

## Feature Addition

☐ Open `verdict.js` and update the verdict function so it always returns a `type`, `label`, and `emoji`\
This depends on the rating received. Anything 7 and above is a flick. Anything below is a flop. If there is no rating, it should show as unrated.

| Emoji                          | Label   | Type      |
| ------------------------------ | ------- | --------- |
| 🍿                             | Flick   | `flick`   |
| Random emoji from `FLIP_EMOJI` | Flop    | `flop`    |
| 🤷                             | Unrated | `unrated` |

## Deployment

☐ Upload your application on GitHub\
☐ Deploy the application on Vercel
