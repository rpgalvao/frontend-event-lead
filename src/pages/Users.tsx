import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Shield,
	Trash2,
	Edit,
	ArrowLeft,
	Loader2,
	Plus,
	Mail,
} from "lucide-react";
import { api } from "../services/api";

export function Users() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	async function loadUsers() {
		try {
			const response = await api.get("/users");
			setUsers(response.data.data || response.data);
		} catch (err) {
			console.error("Erro @rpg:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadUsers();
	}, []);

	const handleDelete = async (id: string, name: string) => {
		if (confirm(`Remover acesso de ${name}?`)) {
			try {
				await api.delete(`/users/${id}`);
				setUsers((prev) => prev.filter((u) => u.id !== id));
			} catch (err) {
				alert("Erro ao remover integrante.");
			}
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white">
			<header className="max-w-5xl mx-auto mb-10">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition-colors"
				>
					<ArrowLeft size={20} /> Painel Principal
				</button>

				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">Gestão de Equipe</h1>
					<button
						onClick={() => navigate("/new-user")}
						className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-600/20"
					>
						<Plus size={20} /> Novo Integrante
					</button>
				</div>
			</header>

			<main className="max-w-5xl mx-auto space-y-4">
				{users.map((user) => (
					<div
						key={user.id}
						className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-500/50 transition-all"
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-600 shadow-inner">
								{user.avatar_url ? (
									<img
										src={user.avatar_url}
										alt={user.name}
										className="w-full h-full object-cover"
										referrerPolicy="no-referrer"
										crossOrigin="anonymous"
										onError={(e) => {
											e.currentTarget.src = ""; // Limpa src em erro
											e.currentTarget.parentElement!.innerHTML =
												'<div class="text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
										}}
									/>
								) : (
									<User
										size={24}
										className="text-slate-500"
									/>
								)}
							</div>
							<div>
								<h3 className="font-bold flex items-center gap-2">
									{user.name}
									{user.role === "ADMIN" && (
										<Shield
											size={14}
											className="text-blue-500"
										/>
									)}
								</h3>
								<p className="text-sm text-slate-400 flex items-center gap-1">
									<Mail size={12} /> {user.email}
								</p>
							</div>
						</div>

						<div className="flex gap-2">
							<button
								onClick={() =>
									navigate(`/edit-user/${user.id}`)
								}
								className="p-2.5 bg-slate-900 text-slate-400 hover:text-blue-400 rounded-xl transition-all border border-slate-700 hover:border-blue-400/50"
							>
								<Edit size={18} />
							</button>
							<button
								onClick={() => handleDelete(user.id, user.name)}
								className="p-2.5 bg-slate-900 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-slate-700 hover:border-red-500/50"
							>
								<Trash2 size={18} />
							</button>
						</div>
					</div>
				))}
			</main>
		</div>
	);
}
