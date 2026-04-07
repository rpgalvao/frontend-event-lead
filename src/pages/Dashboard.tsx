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
	Edit,
	LayoutDashboard,
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

	// Recupera dados do usuário e verifica permissões
	const user = JSON.parse(localStorage.getItem("@rpg:user") || "{}");
	const isAdmin = user.role === "ADMIN";

	// FUNÇÃO DE MÁSCARA: Para exibir telefones formatados caso necessário
	const formatPhone = (value: string) => {
		if (!value) return "";
		let phone = value.replace(/\D/g, ""); // Remove não numéricos
		if (phone.length > 10) {
			return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
		} else if (phone.length > 5) {
			return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
		} else if (phone.length > 2) {
			return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
		}
		return phone;
	};

	async function loadData() {
		try {
			const response = await api.get("/events");
			// Suporta retorno direto ou aninhado em .data
			setEventos(response.data.data || response.data);
		} catch (err) {
			console.error("Erro ao carregar eventos @rpg:", err);
		} finally {
			setLoading(false);
		}
	}

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
		<div className="min-h-screen bg-slate-900 p-6 text-white">
			{/* HEADER PROFISSIONAL */}
			<header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
				<div className="flex items-center gap-4">
					<div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
						<LayoutDashboard size={32} />
					</div>
					<div>
						<h1 className="text-3xl font-bold">
							Olá, {user.name}!
						</h1>
						<p className="text-slate-400 font-medium">
							Painel de Controle | @rpg Sistemas
						</p>
					</div>
				</div>

				<div className="flex flex-wrap gap-3">
					{isAdmin && (
						<>
							<button
								onClick={() => navigate("/new-event")}
								className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95"
							>
								<Plus size={18} /> Novo Evento
							</button>

							<button
								onClick={() => navigate("/leads")}
								title="Ver Leads"
								className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer hover:border-slate-500"
							>
								<Users size={22} />
							</button>

							<button
								onClick={() => navigate("/products")}
								title="Gerenciar Produtos"
								className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer hover:border-slate-500"
							>
								<Package size={22} />
							</button>
						</>
					)}

					<button
						onClick={onLogout}
						className="flex items-center gap-2 bg-slate-800 text-slate-400 hover:text-red-500 px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer font-medium hover:border-red-500/50"
					>
						<LogOut size={18} /> Sair
					</button>
				</div>
			</header>

			{/* GRID DE EVENTOS */}
			<main className="max-w-6xl mx-auto">
				<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
					<Calendar className="text-blue-500" size={20} /> Eventos
					Ativos
				</h2>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{eventos.length > 0 ? (
						eventos.map((evento) => (
							<div
								key={evento.id}
								className="bg-slate-800 border border-slate-700 p-6 rounded-3xl hover:border-blue-500/50 transition-all group relative flex flex-col justify-between shadow-xl"
							>
								{isAdmin && (
									<div className="absolute top-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
										<button
											onClick={() =>
												navigate(
													`/edit-event/${evento.id}`,
												)
											}
											className="p-2 bg-slate-900/80 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
										>
											<Edit size={16} />
										</button>
									</div>
								)}

								<div>
									<h3 className="text-xl font-bold text-white mb-4 pr-8 line-clamp-1 group-hover:text-blue-400 transition-colors">
										{evento.name}
									</h3>

									<div className="space-y-3 text-slate-400 text-sm mb-8">
										<div className="flex items-center gap-3">
											<div className="p-1.5 bg-slate-900 rounded-lg text-blue-500">
												<Calendar size={14} />
											</div>
											{new Date(
												evento.start_date,
											).toLocaleDateString("pt-BR")}
										</div>
										<div className="flex items-center gap-3">
											<div className="p-1.5 bg-slate-900 rounded-lg text-blue-500">
												<MapPin size={14} />
											</div>
											{evento.location ||
												"Local não definido"}
										</div>
									</div>
								</div>

								<button
									onClick={() =>
										navigate(
											`/new-lead?eventId=${evento.id}&eventName=${encodeURIComponent(evento.name)}`,
										)
									}
									className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-bold cursor-pointer shadow-lg shadow-blue-600/10 active:scale-[0.98]"
								>
									Capturar Novo Lead
								</button>
							</div>
						))
					) : (
						<div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
							<p className="text-slate-500 font-medium">
								Nenhum evento cadastrado no momento.
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
