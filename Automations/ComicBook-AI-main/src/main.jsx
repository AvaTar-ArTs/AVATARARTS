import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ComicBookPage from './components/ComicBookPage.jsx';
import Upload from './components/Upload.jsx';
import Search from './components/Search.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/comicbook",
    element: <ComicBookPage />,
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    path: "/search",
    element: <Search />,
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
);