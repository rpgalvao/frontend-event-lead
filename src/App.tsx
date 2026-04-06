import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { useState } from "react";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate(); // Para usar no logout se necessário

	const handleLogout = () => {
		setIsLoggedIn(false);
		navigate("/"); // Garante que a URL volta para a raiz ao sair
	};

	return (
		<Routes>
			<Route
				path="/"
				element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
			/>

			<Route
				path="/dashboard"
				element={
					isLoggedIn ? (
						<Dashboard onLogout={handleLogout} />
					) : (
						<Navigate to="/" /> // Se não estiver logado, "expulsa" para o login
					)
				}
			/>

			<Route
				path="*"
				element={
					<div className="text-white text-center mt-20">
						Página não encontrada!
					</div>
				}
			/>
		</Routes>
	);
}

export default App;
