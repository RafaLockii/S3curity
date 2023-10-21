import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {

  const [userCount, setUserCount] = useState()

  useEffect(() => {
    axios.get("http://localhost:3333/users/count").then(response => {
      setUserCount(response.data.count)

      console.log(response.data)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>

      User Count : {userCount}

    </div>
  );
}

export default App;
