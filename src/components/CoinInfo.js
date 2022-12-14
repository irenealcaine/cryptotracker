/* eslint-disable no-unused-vars */
import { CircularProgress, createTheme, ThemeProvider, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { makeStyles } from 'tss-react/mui'
import { HistoricalChart } from '../config/api'
import { CryptoState } from '../CryptoContext'
import Chart from 'chart.js/auto';
import { chartDays } from '../config/data'
import SelectButton from './SelectButton'
import { Container } from '@mui/system'

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState()
  const [days, setDays] = useState(1)
  const { currency } = CryptoState()

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricData(data.prices);
  };
  console.log(coin)



  useEffect(() => {
    fetchHistoricData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const useStyles = makeStyles()((theme) => {
    return {
      container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        paddingTop: 0,
        [theme.breakpoints.down('md')]: {
          padding: 20,
          paddingTop: 0,
        }
      },
    };
  })

  const { classes } = useStyles();

  let percentage = ''
  if (days === 1) {
    percentage = coin?.market_data.price_change_percentage_24h
  } else if (days === 7) {
    percentage = coin?.market_data.price_change_percentage_7d
  } else if (days === 14) {
    percentage = coin?.market_data.price_change_percentage_14d
  } else if (days === 30) {
    percentage = coin?.market_data.price_change_percentage_30d
  } else if (days === 60) {
    percentage = coin?.market_data.price_change_percentage_60d
  } else {
    percentage = coin?.market_data.price_change_percentage_1y
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <div className={classes.container}>
          {
            !historicData ? (
              <CircularProgress
                style={{ color: '#06b6d4' }}
                size={250}
                thickness={1}
              />
            ) : (
              <>



                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  width: '100%',
                  marginTop: 10
                }}>
                  {chartDays.map(day => (
                    <SelectButton
                      key={day.value}
                      onClick={() => setDays(day.value)}
                      selected={day.value === days}
                      className={classes.buttons}
                      size="small"
                    >{day.label}</SelectButton>
                  ))}
                </div>

                <Typography variant='h4' style={{ fontFamily: 'Raleway', margin: 10, borderBottom: '2px solid', color: percentage > 0 ? '#65a30d' : '#dc2626' }}>
                  {percentage > 0 ? '+' : ''}{percentage.toFixed(2)}%
                </Typography>

                <Line
                  data={{
                    labels: historicData.map((coin) => {
                      let date = new Date(coin[0]);
                      let time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
                      return days === 1 ? time : date.toLocaleDateString();
                    }),
                    datasets: [{
                      data: historicData.map((coin) => coin[1]),
                      borderColor: '#06b6d4'
                    }]
                  }}
                  options={{
                    elements: {
                      point: {
                        radius: 0
                      },
                      line: {
                        tension: 0.2,
                        borderWidth: 1
                      },
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      datalabels: {
                        color: '#FFCE56'
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          mirror: true
                        }
                      }
                    }
                  }}
                />

              </>
            )
          }
        </div >
      </Container>
    </ThemeProvider >
  )
}

export default CoinInfo
