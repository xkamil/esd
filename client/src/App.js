import React, {useEffect, useState} from 'react';
import Dashboard from "./Dashboard";

const STATUS_REFRESH_RATE = 10000;

function App() {
  const [config, setConfig] = useState();

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
      {config && <Dashboard config={config}/>}
    </div>
  )
}

export default App;