
# KoinX Crypto Insights

## Project Description
KoinX Crypto Insights is a cryptocurrency analysis dashboard designed to fetch real-time statistics and calculate price deviations for popular cryptocurrencies like Bitcoin, Ethereum, and Matic Network. The user-friendly web application allows users to view essential market data such as current prices, market cap, and 24-hour price changes. 

Additionally, users can choose to either select from predefined coins or type in any other cryptocurrency using the "Other Coin" feature to get real-time stats and deviation metrics.

## Features
- Dark theme for an enhanced user experience.
- Real-time price, market cap, and 24-hour price change for selected coins.
- Standard deviation calculation based on historical price data stored in MongoDB.
- Option to input and retrieve data for other cryptocurrencies.
- Responsive and aesthetically pleasing UI built with Material-UI.

## Tech Stack
- **Frontend:** React, Material-UI, Emotion.js for styling, Axios for API requests.
- **Backend:** Node.js, Express, MongoDB, Cron for scheduling, CoinGecko API for crypto data.

## Installation Instructions

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running (or use a cloud database).
- A GitHub account.

### Clone the Repository
```bash
git clone https://github.com/AnandPTi/KoinX.git
cd KoinX
```

### Install Dependencies
For the frontend and backend, run:
```bash
# For backend
npm install

# For frontend
cd frontend
npm install
```

### Set Up Environment Variables
Create a `.env` file in the `backend` directory and add your CoinGecko API URL and key:
```
MONGO_URI= your mongo uri
COINGECKO_API_URL=your_coingecko_api_url
COINGECKO_API_KEY=your_coingecko_api_key
PORT= 3000
```

### Start the Application
Open two terminal windows. In the first window, start the backend server:
```bash
cd backend
node index.js
```

In the second window, start the frontend:
```bash
cd frontend
npm start
```

## Usage
1. Open your browser and go to `http://localhost:3001`.
2. Choose a cryptocurrency (Bitcoin, Ethereum, Matic Network) or type in another coin name.
3. Click the "Get Stats" or "Calculate Deviation" button to retrieve the desired information.

## Demo
Here are some screenshots of the application in action:

# Home Page
![Demo Image 1](images/image%20copy%204.png)
# Options for chosing coin
![Demo Image 2](images/image%20copy%205.png)
# Fetched Details
![Demo Image 3](images/image%20copy%206.png)
# Any other coin's insights if you want to know other than these three
![Demo Image 4](images/image%20copy%207.png)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to CoinGecko for providing the cryptocurrency data API.
- Thanks to the open-source community for the tools and libraries used in this project.


