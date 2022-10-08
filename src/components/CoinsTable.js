import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { CoinList } from '../config/api'
import { CryptoState } from '../CryptoContext'
import { createTheme, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@mui/material'
import { Container } from '@mui/system'
// import { Navigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom';

const CoinsTable = () => {

  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const { currency, symbol } = CryptoState()

  const fetchCoins = async () => {
    setLoading(true)
    const { data } = await axios.get(CoinList(currency))
    setCoins(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCoins()
  }, [currency])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleSearch = () => {
    return coins.filter((coin) => (
      coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
    ))
  }

  const useStyles = makeStyles()(() => {
    return {
      row: {
        backgroundColor: '#16171a',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#131111'
        },
        fontFamily: 'Montserrat'
      },
    };
  })

  const { classes } = useStyles();
  const navigate = useNavigate()
  console.log(coins)

  return (


    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: 'center' }}>
        <Typography
          variant='h4'
          style={{ margin: 18, fontFamily: 'Montserrat' }}
        >
          Precios
        </Typography>
        <TextField
          label='Busca una criptomoneda...'
          varaint='outlined'
          style={{ marginBottom: 20, width: '100%' }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          {
            loading ? (
              <LinearProgress style={{ backgroundColor: 'gold' }} />
            ) : (
              <Table>
                <TableHead style={{ backgroundColor: 'gold' }}>
                  <TableRow>
                    {['Moneda', 'Precio', 'Cambio en 24h', 'Market cap'].map((head) => (
                      <TableCell
                        style={{
                          color: 'black',
                          fontWeight: '700',
                          fontFamily: 'Montserrat'
                        }}
                        key={head}
                        align={head === 'Moneda' ? '' : 'right'}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {handleSearch().map((row) => {
                    const profit = row.price_change_percentage_24h > 0
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell component='th' scope='row' style={{ display: 'flex', gap: 15 }}>
                          <img src={row.image} alt={row.name} height='50' style={{ marginBottom: 10 }} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: 22 }}>
                              {row.symbol}
                            </span>
                            <span style={{ color: 'darkgrey' }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          align='right'
                        >
                          {row.current_price.toFixed(2)}{symbol}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ color: profit > 0 ? 'green' : 'red', fontWeight: '500' }}
                        >
                          {profit && '+'}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell
                          align='right'
                        >
                          {row.market_cap.toString().slice(0, -6)}M
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )
          }
        </TableContainer>
      </Container>
    </ThemeProvider>
  )
}

export default CoinsTable