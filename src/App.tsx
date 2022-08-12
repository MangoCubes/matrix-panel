import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Login } from "./root/login/Login";
import 'react-toastify/dist/ReactToastify.css';
import { FilterLogin } from "./root/FilterLogin";

export function App() {
	const theme = createTheme({
		palette: {
			mode: 'dark',
		}
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/*' element={<FilterLogin />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer
				position='bottom-right'
				autoClose={5000}
				closeOnClick
				draggable
				theme='dark'
			/>
		</ThemeProvider>
	);
}