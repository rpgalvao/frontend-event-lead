import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Importação das suas páginas
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { NewEvent } from "./pages/NewEvent";
import { EditEvent } from "./pages/EditEvent"; // Importação da nova página

function App() {
	// 1. Persistência: Verificamos se existe um token no navegador logo ao carregar
	// O '!!' converte o valor (token ou null) em um booleano (true/false)
	const [isLoggedIn, setIsLoggedIn] = useState(
		() => !!localStorage.getItem("@rpg:token"),
	);

	// 2. Função de Logout: Limpa o storage e reseta o estado de login
	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
	};

	return (
		<Routes>
			{/* RAIZ: Se já estiver logado (ex: após F5), pula direto para o Dashboard.
        Caso contrário, mostra a tela de Login.
      */}
			<Route
				path="/"
				element={
					isLoggedIn ? (
						<Navigate to="/dashboard" replace />
					) : (
						<Login onLoginSuccess={() => setIsLoggedIn(true)} />
					)
				}
			/>

			{/* DASHBOARD: Rota principal. 
        Se o usuário tentar acessar sem login, o Navigate o joga de volta para a raiz.
      */}
			<Route
				path="/dashboard"
				element={
					isLoggedIn ? (
						<Dashboard onLogout={handleLogout} />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>

			{/* NOVO EVENTO: Acesso apenas para usuários logados (O backend validará se é ADMIN)
			 */}
			<Route
				path="/new-event"
				element={
					isLoggedIn ? <NewEvent /> : <Navigate to="/" replace />
				}
			/>

			{/* EDITAR EVENTO: Note o ':id' na URL. 
        Isso permite que a página EditEvent saiba qual evento carregar do seu banco.
      */}
			<Route
				path="/edit-event/:id"
				element={
					isLoggedIn ? <EditEvent /> : <Navigate to="/" replace />
				}
			/>

			{/* Rota de segurança: Qualquer endereço inválido volta para o início */}
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
