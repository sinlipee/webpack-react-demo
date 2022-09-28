import React from "react";
import './scss/bundle.scss';

const App = () => {

    React.useEffect(() => {
        console.log(process.env.API_APP);
    }, [])

    return <h1>Hello React</h1>;
};

export default App;
