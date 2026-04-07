import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

// Eventos
import { NewEvent } from "./pages/NewEvent";
import { EditEvent } from "./pages/EditEvent";

// Produtos
import { Products } from "./pages/Products";
import { NewProduct } from "./pages/NewProduct";
import { EditProduct } from "./pages/EditProduct";

// Leads
import { Leads } from "./pages/Leads";
import { NewLead } from "./pages/NewLead";
import { EditLead } from "./pages/EditLead";
import { UploadCard } from "./pages/UploadCard";

// Usuários (Equipe)
import { Users } from "./pages/Users";
import { NewUser } from "./pages/NewUser";
import { EditUser } from "./pages/EditUser";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(
		() => !!localStorage.getItem("@rpg:token"),
	);

	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
	};

	return (
		<Routes>
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

			{/* Áreas Protegidas */}
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

			{/* Eventos */}
			<Route
				path="/new-event"
				element={
					isLoggedIn ? <NewEvent /> : <Navigate to="/" replace />
				}
			/>
			<Route
				path="/edit-event/:id"
				element={
					isLoggedIn ? <EditEvent /> : <Navigate to="/" replace />
				}
			/>

			{/* Produtos */}
			<Route
				path="/products"
				element={
					isLoggedIn ? <Products /> : <Navigate to="/" replace />
				}
			/>
			<Route
				path="/new-product"
				element={
					isLoggedIn ? <NewProduct /> : <Navigate to="/" replace />
				}
			/>
			<Route
				path="/edit-product/:id"
				element={
					isLoggedIn ? <EditProduct /> : <Navigate to="/" replace />
				}
			/>

			{/* Leads */}
			<Route
				path="/leads"
				element={isLoggedIn ? <Leads /> : <Navigate to="/" replace />}
			/>
			<Route
				path="/new-lead"
				element={isLoggedIn ? <NewLead /> : <Navigate to="/" replace />}
			/>
			<Route
				path="/edit-lead/:id"
				element={
					isLoggedIn ? <EditLead /> : <Navigate to="/" replace />
				}
			/>
			<Route
				path="/upload-card/:id"
				element={
					isLoggedIn ? <UploadCard /> : <Navigate to="/" replace />
				}
			/>

			{/* Equipe (Gestão de Usuários) */}
			<Route
				path="/users"
				element={isLoggedIn ? <Users /> : <Navigate to="/" replace />}
			/>
			<Route
				path="/new-user"
				element={isLoggedIn ? <NewUser /> : <Navigate to="/" replace />}
			/>
			<Route
				path="/edit-user/:id"
				element={
					isLoggedIn ? <EditUser /> : <Navigate to="/" replace />
				}
			/>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
