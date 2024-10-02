# :earth_asia: Tripago - Your All-in-One Travel App

Tripago is designed to streamline travel planning by consolidating the key features you need into one easy-to-use app. Whether you're booking flights, finding hotels, or choosing restaurants, Tripago has you covered.

Note: This project is currently in the implementation phase. Key features are being actively developed and refined.

# :rocket: Getting Started
Follow these instructions to set up Tripago on your local machine for development and testing purposes.

# Prerequisites
Node.js: Download and install from Node.js Official Site.
npm: Typically comes with Node.js. Verify installation with npm -v.

# Installation
1. Clone the repository: git clone https://github.com/your-username/tripago.git
2. Navigate to the project directory: cd tripago
3. Install dependancies: npm i
4. Create environmental variables: You'll need to create .env files for both the frontend and backend. See the Environment Variables section for more details.
5. Start the servers:
   ```bash
    - frontend (Next.js): npm run dev
   ```
   ```bash
    - backend: npm run backend
   ```
7. Access the app: Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the app.

# :link: Navigation (Temporary)
As the navigation is still in development, use these direct links to access the respective pages:
```bash
Signup: http://localhost:3000/signup
Login: http://localhost:3000/login
Flights: http://localhost:3000/flights -> navigates into localhost:3000/hotels with specific data passed in the link
Hotels: Redirected from Flights (please refresh if the page crashes)
Stripe Payment: http://localhost:3000/stripe
```
# :hammer_and_wrench: Built With
Next.js - Frontend framework for React-based apps.
Node.js - Backend runtime for JavaScript.
Express - Web framework for Node.js.
Firebase - Backend services for authentication and data storage.
Tailwind CSS - Utility-first CSS framework for styling.
Amadeus API - For flight and hotel booking data.
Google Places API - For retrieving restaurant and hotel information.
Stripe API - For payment processing.

For the majority of our pages, we are using external API services (Amadeus, Google, Stripe, etc.). In order for the pages to work you would need access keys. Please, create .env files
for both frontend and backend and populate them with the following:


# 🔑: Environmental Variables
⚠️ Important: Ensure that the .env files are correctly set up before running the application to prevent any issues.
To run Tripago, you'll need to set up the following environment variables in .env files for both the frontend and backend.

### Backend .env:
Sign up to get your own API key: 
https://developers.amadeus.com/register 
https://developers.amadeus.com/self-service/category/flights 
https://developers.amadeus.com/self-service/category/hotels
https://developers.google.com/maps/documentation/places/web-service
https://firebase.google.com/products/auth 
```bash
PORT=4000
AMADEUS_API_KEY= your amadeus key
AMADEUS_API_SECRET=your amadeus secret

PLACES_API_KEY=your google places api key

NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_KEY= your firebase key
NEXT_PUBLIC_AUTH_DOMAIN= your firebase auth domain
NEXT_PUBLIC_PROJECT_ID= your firebase project id
NEXT_PUBLIC_STORAGE_BUCKET= your firebase storage bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your firebase messaging sender
NEXT_PUBLIC_APP_ID=your firebase app id
```

### Frontend .env:
Sign up to get your own API key:
https://dashboard.stripe.com/register 

```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your stripe public key
STRIPE_SECRET_KEY= your stripe secret
```
### 🚧 Features in Progress
# 🍽️ Restaurant suggestions based on Google Places 
# 🌐 💸 Geo Currency Conversion   
# :rotating_light: Real time notifications [Booking confirmations]
# 🖼️ More appealing photos for Restaurants and Hotels
# ⭐ Restaurant ratings
# 🪄 Keyword filter searching for Restaurants


# 📧 Contact
# Project Link: [https://github.com/your-username/tripago](https://github.com/LetMeP1ay/Tripago)
# Email: qmr3767@autuni.ac.nz (Vadim)| yfp1726@autuni.ac.nz (Andrew)

# 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
