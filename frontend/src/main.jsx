import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { Global, css } from '@emotion/react';
import App from './App.jsx'
import './index.css'
import Context from "./Context/Context.jsx";

const globalStyles = css`
  body {
    background-color: black;
    color: white;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
`;
ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Context>
			<ChakraProvider>
				<Global styles={globalStyles} />
				<App />
			</ChakraProvider>
		</Context>
	</BrowserRouter>
)
