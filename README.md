# Welcome to Tripago!

Your all-in-one travelling app. Tired of jumping between apps to book flight tickets, find accommodation, and choose restaurants? Tripago has you covered. Our app consolidates these features into a single, seamless experience to simplify your travel planning. 


In order to run our awesome app, run the development server and the backend:

```bash
npm run dev
npm run backend
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## As we are currently in the implementation phase, the navigation is not finalized, so in order to move across the app, use those links (for the hotels page, update the page on load as it currently crashes):

```bash
localhost:3000/signup
localhost:3000/login
localhost:3000/flights -> navigates into localhost:3000/hotels with specific data passed in the link
localhost:3000/stripe
```

For the majority of our pages, we are using external API services (Amadeus, Google, Stripe, etc.). In order for the pages to work you would need access keys. Please, create .env files
for both frontend and backend and populate them with the following:

### Backend .env:

```
PORT=4000
AMADEUS_API_KEY= your amadeus key
AMADEUS_API_SECRET=your amadeus secret
PLACES_API_KEY=your google places api key
```

### Frontend .env:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_KEY= your firebase key
NEXT_PUBLIC_AUTH_DOMAIN= your firebase auth domain
NEXT_PUBLIC_PROJECT_ID= your firebase project id
NEXT_PUBLIC_STORAGE_BUCKET= your firebase storage bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your firebase messaging sender
NEXT_PUBLIC_APP_ID=your firebase app id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your stripe public key
STRIPE_SECRET_KEY= your stripe secret
```
