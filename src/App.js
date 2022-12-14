
import { makeStyles } from 'tss-react/mui';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import CoinPage from './pages/CoinPage';
import Homepage from './pages/Homepage';

function App() {


  const useStyles = makeStyles()(() => {
    return {
      App: {
        backgroundColor: '#14161a',
        color: 'white',
        minHeight: '100vh'
      },
    };
  })

  const { classes } = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
