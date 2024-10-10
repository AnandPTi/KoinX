import React, { useState } from 'react';
import { Button, Container, Typography, Box, CircularProgress, Paper, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import axios from 'axios';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
      secondary: '#aaa',
    },
  },
});

// Styled components
const StyledContainer = styled(Container)`
  margin-top: 50px;
  text-align: center;
`;

const CryptoDataBox = styled(Box)`
  margin-top: 20px;
  padding: 20px;
  background-color: #2e2e2e;
  border-radius: 8px;
`;

function App() {
  const [coin, setCoin] = useState('');
  const [customCoin, setCustomCoin] = useState('');
  const [useCustomCoin, setUseCustomCoin] = useState(false);
  const [responses, setResponses] = useState([]); // Store multiple responses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString(); // Returns the current timestamp
  };

  const handleFetchCryptoStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const coinToFetch = useCustomCoin ? customCoin : coin;
      const { data } = await axios.get('http://localhost:3000/stats', {
        params: { coin: coinToFetch },
      });
      setResponses((prev) => [
        { type: 'stats', coin: coinToFetch, data, timestamp: getCurrentTimestamp() },
        ...prev,
      ]); // Add new response with timestamp and coin name
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDeviation = async () => {
    setLoading(true);
    setError(null);
    try {
      const coinToFetch = useCustomCoin ? customCoin : coin;
      const { data } = await axios.get('http://localhost:3000/deviation', {
        params: { coin: coinToFetch },
      });
      setResponses((prev) => [
        
        { type: 'deviation', coin: coinToFetch, data: data.deviation, timestamp: getCurrentTimestamp() },
        ...prev,
      ]); // Add new response with timestamp and coin name
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StyledContainer maxWidth="sm">
        <Typography variant="h3" gutterBottom color="primary">
          KoinX Crypto Insights
        </Typography>

        {!useCustomCoin && (
          <>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Select Cryptocurrency</InputLabel>
              <Select
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                label="Select Cryptocurrency"
              >
                <MenuItem value="bitcoin">Bitcoin</MenuItem>
                <MenuItem value="matic-network">Matic Network</MenuItem>
                <MenuItem value="ethereum">Ethereum</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setUseCustomCoin(true)}
              style={{ marginTop: '10px' }}
            >
              Use Other Coin
            </Button>
          </>
        )}

        {useCustomCoin && (
          <Box marginTop="20px">
            <TextField
              fullWidth
              variant="outlined"
              label="Enter Coin Name"
              value={customCoin}
              onChange={(e) => setCustomCoin(e.target.value)}
              margin="normal"
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setUseCustomCoin(false)}
              style={{ marginTop: '10px' }}
            >
              Back to Select
            </Button>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchCryptoStats}
            disabled={!coin && !customCoin}
          >
            Fetch Stats
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleFetchDeviation}
            disabled={!coin && !customCoin}
          >
            Fetch Deviation
          </Button>
        </Box>

        {loading && <CircularProgress style={{ marginTop: '20px' }} />}

        {error && <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>}

        {/* Mapping responses */}
        {responses.map((response, index) => (
          <CryptoDataBox component={Paper} key={index}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setResponses(responses.filter((_, i) => i !== index))}
              style={{ float: 'right' }}
            >
              Close
            </Button>

            <Typography variant="subtitle2" color="textSecondary">
              Coin: {response.coin} - Generated at: {response.timestamp}
            </Typography>

            {response.type === 'stats' ? (
              <>
                <Typography variant="h6" color="primary">Price: ${response.data.price}</Typography>
                <Typography variant="h6" color="primary">Market Cap: ${response.data.marketCap}</Typography>
                <Typography variant="h6" color="primary">24h Change: {response.data.change24h}%</Typography>
              </>
            ) : (
              <Typography variant="h6" color="primary">Standard Deviation: {response.data}</Typography>
            )}
          </CryptoDataBox>
        ))}

      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
