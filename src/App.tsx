import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { NewEvent } from "./pages/NewEvent";
import { EditEvent } from "./pages/EditEvent";
import { Products } from "./pages/Products";
import { NewProduct } from "./pages/NewProduct";
import { EditProduct } from "./pages/EditProduct";
import { NewLead } from "./pages/NewLead";
import { UploadCard } from "./pages/UploadCard";
import { Leads } from "./pages/Leads";
import { EditLead } from "./pages/EditLead";

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

			{/* Eventos */}
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
				path="/upload-card/:id"
				element={
					isLoggedIn ? <UploadCard /> : <Navigate to="/" replace />
				}
			/>
			<Route
				path="/edit-lead/:id"
				element={
					isLoggedIn ? <EditLead /> : <Navigate to="/" replace />
				}
			/>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
