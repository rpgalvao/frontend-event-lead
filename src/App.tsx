import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { useState } from "react";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<Routes>
			{/* Rota de Login */}
			<Route
				path="/"
				element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
			/>

			{/* Rota do Dashboard (Protegida) */}
			<Route
				path="/dashboard"
				element={
					isLoggedIn ? (
						<Dashboard onLogout={() => setIsLoggedIn(false)} />
					) : (
						<Navigate to="/" />
					)
				}
			/>

			{/* Rota 404 - Se o usuário digitar qualquer besteira na URL */}
			<Route
				path="*"
				element={
					<div className="text-white text-center mt-20">
						Página não encontrada na @rpg!
					</div>
				}
			/>
		</Routes>
	);
}

export default App;
