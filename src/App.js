import './App.css';
import Currency from './currency';
import {useEffect,useState} from "react";

const BASE_URL = 'https://api.exchangerate.host/latest';

function App() {

  const [selectOptions,setSelectOptions] = useState([]);
  const [fromcurrency,setFromcurrency] = useState();
  const [tocurrency,setTocurrency] = useState();
  const [amount,setAmount] = useState(1);
  const [amountFrom,setAmountFrom] = useState(true);
  const [exchangerate,setExchangerate] = useState();

  let fromAmount,toAmount;

  if(amountFrom){
    fromAmount = amount
    toAmount = exchangerate * amount
  }
  else{
    toAmount = amount
    fromAmount = amount / exchangerate
  }
 

  useEffect(()=>{
    fetch(BASE_URL)
    .then(res=>res.json())
    .then(data=>{
      const currency = Object.keys(data.rates)[0];
      setSelectOptions([data.base,...Object.keys(data.rates)]);
      setFromcurrency(data.base);
      setTocurrency(currency);
      setExchangerate(data.rates[currency])
    })
  },[])

  useEffect(()=>{
   if(fromcurrency && tocurrency){
     fetch(`${BASE_URL}?base=${fromcurrency}&symbols=${tocurrency}`)
     .then(res=>res.json())
     .then(data=>setExchangerate(data.rates[tocurrency]))
   }
  },[fromcurrency,tocurrency])

  function handleFromAmount(e){
    setAmount(e.target.value);
    setAmountFrom(true);
  }

  function handleToAmount(e){
    setAmount(e.target.value);
    setAmountFrom(false);
  }

  return (
    <div className="App">
     <h1>Currency Converter</h1>
     <Currency selectOptions={selectOptions} selectedCurrency={fromcurrency} amount={fromAmount} onChangeCurrency={e=>setFromcurrency(e.target.value)} onChangeAmount={handleFromAmount}/>
     <div className='equals'>=</div>
     <Currency selectOptions={selectOptions} selectedCurrency={tocurrency} amount={toAmount} onChangeCurrency={e=>setTocurrency(e.target.value)} onChangeAmount={handleToAmount} />
    </div>
  );
}

export default App;
