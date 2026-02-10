# Roll for a New Cat 🐈🎲  
**CMU 15-113 — API Mini Project**

## Overview
This project is an interactive web feature embedded in my 15-113 projects page. Users can press a large **“Roll for a New Cat”** button to fetch a random cat image from **The Cat API**. The experience includes a loading state, breed filtering, a stat card derived from API metadata, a rolling history of recent cats, and a playful confetti reward that appears every three rolls.

The goal of this project was to gain hands-on experience working with public APIs, understanding how to make API calls from code, parsing JSON responses, and translating raw data into meaningful and engaging UI interactions.

---

## API Used
**The Cat API**  
https://thecatapi.com

This project uses two public REST endpoints:

### `GET /v1/images/search`
Fetches a random cat image. Optional query parameters are used to filter by breed:

The response is returned as JSON containing an image URL and, in some cases, embedded breed data.

### `GET /v1/breeds`
Returns a list of all cat breeds. Each breed object includes:
- `id` (used for filtering)
- `name`
- `origin`
- `temperament`

This endpoint is called once on page load to populate the breed filter dropdown and to cache breed metadata for use in the stat card.

---

## How the API Is Called
API requests are made client-side using JavaScript’s built-in `fetch()` function. JSON responses are parsed and used to dynamically update the page without reloading.

The Cat API allows unauthenticated requests for basic image search; however, the code is structured to optionally include an API key in the request headers for higher rate limits and future expansion.

---

## API Key Handling
An API key is optional but supported. If you don't have an API key, it will still run but with a limited library of images. 

- The key is stored locally in a `config.js` file:
  ```js
  const CAT_API_KEY = "YOUR_API_KEY_HERE";

## Prompts Used
- what about if i wanted to randomly generate a picture of a cat using this api, by pressing a buttyon thats like roll for a new cat https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR
- yes big button fir rol for new cat, should be in a card like frame and should have a loading statem and lkast 3 cats as history strip
- ok i want to add a way to make a filter for breeds if chosen: Example of how to filter Images by Breed endpoint: ./breeds e.g. https://api.thecatapi.com/v1/images/search?breed_ids={breed.id} Each breed has a unique 4 character id which can be used to filter a Search. This breed.id is available by listing all the Breeds via https://api.thecatapi.com/v1/breeds e.g. for only Bengal cats you’d request https://api.thecatapi.com/v1/images/search?breed_ids=beng 
- aspect ratio of the photo should be the original aspect ratio rather than following the pre set frame size
- ok make a stat card, and every 3 rolls add confetti with words that say you are deep in tyhe cat zone buddy