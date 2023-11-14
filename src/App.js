import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    getTransactions().then(setTransactions);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  async function getTransactions() {
    const url = `${process.env.REACT_APP_API_URL}/transactions`;
    const response = await fetch(url);
    return await response.json();
  }

  const toggleMode = () => {
    document.body.classList.toggle('dark-mode');
    setDarkMode(!darkMode);
  }

  const handleNameChange = (ev) => {
    setName(ev.target.value);
  };

  const handleDatetimeChange = (ev) => {
    const { value } = ev.target;
    setDatetime(value);
    ev.target.blur();
  };

  const handleDescriptionChange = (ev) => {
    setDescription(ev.target.value);
  };

  async function addNewTransaction(ev) {
    ev.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/transaction`;
    const price = name.split(' ')[0];
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          name: name.substring(price.length + 1),
          description,
          datetime
        })
      });
      const json = await response.json();
      if (response.ok) {
        setName('');
        setDatetime('');
        setDescription('');
        // Handle successful response
        console.log('Transaction', json);
        window.location.reload();
      } else {
        // Handle error response
        const errorMessage = json.message || 'Something went wrong';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error adding new transaction:', error);
    }
  }
  let balance = 0;
  transactions.forEach((transaction) => {
    balance += transaction.price;
  })
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <button className={`App ${darkMode ? 'dark-mode' : ''}`} onClick={toggleMode}>
          {darkMode ? 'Switch To Light Mode' : 'Switch To Dark Mode'}
        </button>
      <h1>${balance}<span>.{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input
            type='text'
            value={name}
            onChange={handleNameChange}
            placeholder='Want Something?'
          />
          <input
            type='datetime-local'
            value={datetime}
            onChange={handleDatetimeChange}
          />
        </div>

        <div className='description'>
          <input
            type='text'
            value={description}
            onChange={handleDescriptionChange}
            placeholder='description'
          />
        </div>
        <button type='submit'>Add Transactions</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map((transaction) => (
          <div className='transaction'>
            <div className='left'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
              <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className='datetime'>{transaction.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
