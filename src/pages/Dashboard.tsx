import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Calendar,
	MapPin,
	LogOut,
	Loader2,
	Plus,
	Users,
	Package,
	Trash2,
	Edit,
} from "lucide-react";
import { api } from "../services/api";

interface Evento {
	id: string;
	name: string;
	location: string;
	start_date: string;
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
	const navigate = useNavigate();
	const [eventos, setEventos] = useState<Evento[]>([]);
	const [loading, setLoading] = useState(true);

	// 1. Recuperamos o usuário. Se não houver nome, usamos 'Usuário' como fallback.
	const user = JSON.parse(localStorage.getItem("@rpg:user") || "{}");
	const isAdmin = user.role === "ADMIN";

	// FUNÇÃO PARA CARREGAR EVENTOS
	async function loadData() {
		try {
			const response = await api.get("/events");
			// Ajustado para o padrão do seu backend: data.data
			setEventos(response.data.data || response.data);
		} catch (err) {
			console.error("Erro ao carregar eventos:", err);
		} finally {
			setLoading(false);
		}
	}

	// FUNÇÃO PARA DELETAR EVENTO
	const handleDelete = async (id: string, name: string) => {
		// Confirmação simples antes de apagar
		if (
			confirm(
				`@rpg Sistemas: Deseja realmente excluir o evento "${name}"?`,
			)
		) {
			try {
				await api.delete(`/events/${id}`);
				// Filtro Otimista: remove da tela sem precisar de F5
				setEventos((prev) => prev.filter((e) => e.id !== id));
			} catch (err: any) {
				alert(err.response?.data?.message || "Erro ao deletar evento.");
			}
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6">
			{/* CABEÇALHO DA PÁGINA - Restaurado e Atualizado */}
			<header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Olá, {user.name || "Usuário"}!
					</h1>
					<p className="text-slate-400">
						Painel de Controle @rpg Sistemas
					</p>
				</div>

				<div className="flex gap-3">
					{/* BOTÕES EXCLUSIVOS PARA ADMIN */}
					{isAdmin && (
						<>
							<button
								onClick={() => navigate("/new-event")}
								className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
							>
								<Plus size={18} /> Novo Evento
							</button>

							<button
								title="Gestão de Usuários"
								className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
							>
								<Users size={20} />
							</button>
							<button
								title="Gestão de Produtos"
								className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
							>
								<Package size={20} />
							</button>
						</>
					)}

					<button
						onClick={onLogout}
						className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 px-4 py-2 rounded-lg border border-slate-700 transition-all"
					>
						<LogOut size={18} /> Sair
					</button>
				</div>
			</header>

			<main className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{eventos.length > 0 ? (
					eventos.map((evento) => (
						<div
							key={evento.id}
							className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-blue-500 transition-all group relative"
						>
							{/* BOTÕES DE EDIÇÃO/EXCLUSÃO (Aparecem no Hover do card) */}
							{isAdmin && (
								<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={() =>
											navigate(`/edit-event/${evento.id}`)
										}
										className="p-1.5 bg-slate-700 text-blue-400 hover:bg-blue-500 hover:text-white rounded-md transition-colors"
									>
										<Edit size={16} />
									</button>
									<button
										onClick={() =>
											handleDelete(evento.id, evento.name)
										}
										className="p-1.5 bg-slate-700 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors"
									>
										<Trash2 size={16} />
									</button>
								</div>
							)}

							<h3 className="text-xl font-semibold text-white mb-4 pr-12">
								{evento.name}
							</h3>

							<div className="space-y-2 text-slate-400 text-sm">
								<div className="flex items-center gap-2">
									<Calendar
										size={16}
										className="text-blue-500"
									/>
									{new Date(
										evento.start_date,
									).toLocaleDateString("pt-BR")}
								</div>
								<div className="flex items-center gap-2">
									<MapPin
										size={16}
										className="text-blue-500"
									/>
									{evento.location || "Local remoto"}
								</div>
							</div>

							<button className="w-full mt-6 py-2.5 bg-slate-700 group-hover:bg-blue-600 text-white rounded-xl transition-all font-medium">
								Capturar Leads
							</button>
						</div>
					))
				) : (
					<div className="col-span-full text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
						Nenhum evento ativo no momento.
					</div>
				)}
			</main>
		</div>
	);
}
