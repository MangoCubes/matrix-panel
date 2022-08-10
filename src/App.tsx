import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./root/login/Login";

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
					<Route path='/*' element={<>123</>} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}