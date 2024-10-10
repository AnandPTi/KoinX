import React, { useState } from 'react';
import { Button, Container, Typography, Box, CircularProgress, Paper, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import styled from '@emotion/styled'; // Default import for styled from @emotion/styled
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
  const [cryptoData, setCryptoData] = useState(null);
  const [deviation, setDeviation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchCryptoStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const coinToFetch = useCustomCoin ? customCoin : coin;
      const { data } = await axios.get('http://localhost:3000/stats', {
        params: { coin: coinToFetch },
      });
      setCryptoData(data);
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
      setDeviation(data.deviation);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures dark theme is applied globally */}
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

        {cryptoData && (
          <CryptoDataBox component={Paper}>
            <Typography variant="h6" color="primary">Price: ${cryptoData.price}</Typography>
            <Typography variant="h6" color="primary">Market Cap: ${cryptoData.marketCap}</Typography>
            <Typography variant="h6" color="primary">24h Change: {cryptoData.change24h}%</Typography>
          </CryptoDataBox>
        )}

        {deviation && (
          <Box marginTop="20px">
            <Typography variant="h6" color="primary">Standard Deviation: {deviation}</Typography>
          </Box>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
