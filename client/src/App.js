import React, {useEffect, useState} from 'react';
import ServicesContainer from "./ServicesContainer";

const STATUS_REFRESH_RATE = 10000;

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getConfiguration();
    const interval = setInterval(getConfiguration, STATUS_REFRESH_RATE);
    return () => clearInterval(interval);
  }, []);

  const getConfiguration = () => {
    fetch(`/api/configuration`)
      .then(res => res.json())
      .then(setConfig)
  }

  return (
    <div className="App">
      {config && <ServicesContainer config={config}/>}
    </div>
  )
}

export default App;