import React from 'react';

import { Router, RouteComponentProps } from "@reach/router"
import App from '../pages/App';
import Login from '../pages/Login';

const RouterPage = (
    props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;


export default function Routes() {
    return (
        <Router>
            <RouterPage path="/" pageComponent={<App />} />
            <RouterPage path="/login" pageComponent={<Login />} />
        </Router>
    )
}