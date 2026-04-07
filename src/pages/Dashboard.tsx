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
	Eye,
} from "lucide-react";
import { api } from "../services/api";

export function Dashboard({ onLogout }: { onLogout: () => void }) {
	const navigate = useNavigate();
	const [eventos, setEventos] = useState<any[]>([]);
	const [totalLeads, setTotalLeads] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	const user = JSON.parse(localStorage.getItem("@rpg:user") || "{}");
	const isAdmin = user.role === "ADMIN";

	async function loadData() {
		try {
			const [eventsRes, leadsRes] = await Promise.all([
				api.get("/events"),
				api.get("/leads"),
			]);

			setEventos(eventsRes.data.data || eventsRes.data);
			const leadsData = leadsRes.data.data || leadsRes.data;
			setTotalLeads(leadsData.length || 0);
		} catch (err) {
			console.error("Erro @rpg Sistemas:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white font-sans">
			<header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3">
						<LayoutDashboard size={32} />
					</div>
					<div>
						<h1 className="text-3xl font-black tracking-tighter uppercase">
							@rpg <span className="text-blue-500">Sistemas</span>
						</h1>
						<p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
							Evento Control Panel • v1.0
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
					<div className="pl-4 pr-2">
						<p className="text-[10px] font-black text-slate-500 uppercase">
							Operador
						</p>
						<p className="text-sm font-bold">{user.name}</p>
					</div>
					<button
						onClick={onLogout}
						className="p-3 bg-slate-900 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-xl active:scale-95"
					>
						<LogOut size={20} />
					</button>
				</div>
			</header>

			<main className="max-w-6xl mx-auto space-y-12">
				{/* SEÇÃO DE MÉTRICAS SIMPLIFICADA (LEADS E EVENTOS) */}
				<section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl relative overflow-hidden group shadow-xl">
						<div className="absolute top-0 right-0 p-4 bg-blue-500/10 text-blue-500 rounded-bl-3xl">
							<Users size={24} />
						</div>
						<p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2 text-blue-500">
							Total de Leads Captados
						</p>
						<h2 className="text-5xl font-black tracking-tighter">
							{totalLeads}
						</h2>
					</div>

					<div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl relative overflow-hidden group shadow-xl">
						<div className="absolute top-0 right-0 p-4 bg-amber-500/10 text-amber-500 rounded-bl-3xl">
							<Calendar size={24} />
						</div>
						<p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2 text-amber-500">
							Eventos Cadastrados
						</p>
						<h2 className="text-5xl font-black tracking-tighter">
							{eventos.length}
						</h2>
					</div>
				</section>

				{/* AÇÕES ESTRATÉGICAS - COM O BOTÃO DE NOVO PRODUTO REPOSTO */}
				<section>
					<h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
						<div className="h-[2px] w-8 bg-blue-600"></div> Ações
						Estratégicas
					</h2>
					<div className="flex flex-wrap gap-4">
						<button
							onClick={() => navigate("/leads")}
							className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl"
						>
							<Users size={18} className="text-blue-500" />{" "}
							Gerenciar Todos os Leads
						</button>

						{isAdmin && (
							<>
								<button
									onClick={() => navigate("/new-product")}
									className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl"
								>
									<Package
										size={18}
										className="text-amber-500"
									/>{" "}
									Adicionar Produto
								</button>
								<button
									onClick={() => navigate("/users")}
									className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl"
								>
									<Plus
										size={18}
										className="text-green-500"
									/>{" "}
									Novo Integrante
								</button>
							</>
						)}
					</div>
				</section>

				{/* LISTA DE EVENTOS */}
				<section>
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
							<div className="h-[2px] w-8 bg-blue-600"></div>{" "}
							Eventos Ativos
						</h2>
						{isAdmin && (
							<button
								onClick={() => navigate("/new-event")}
								className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase hover:bg-blue-500/10 px-4 py-2 rounded-lg transition-all"
							>
								<Plus size={14} /> Criar Novo Evento
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{eventos.map((evento) => (
							<div
								key={evento.id}
								className="bg-slate-800 border border-slate-700 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all group relative flex flex-col justify-between shadow-xl"
							>
								{isAdmin && (
									<button
										onClick={() =>
											navigate(`/edit-event/${evento.id}`)
										}
										className="absolute top-4 right-4 p-2 bg-slate-900/80 text-blue-400 rounded-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
									>
										<Edit size={16} />
									</button>
								)}
								<div>
									<h3 className="text-xl font-bold text-white mb-4 line-clamp-1">
										{evento.name}
									</h3>
									<div className="space-y-3 text-slate-400 text-sm mb-8">
										<div className="flex items-center gap-3">
											<Calendar
												size={14}
												className="text-blue-500"
											/>
											{new Date(
												evento.start_date,
											).toLocaleDateString("pt-BR")}
										</div>
										<div className="flex items-center gap-3">
											<MapPin
												size={14}
												className="text-blue-500"
											/>
											{evento.location ||
												"Local Presencial"}
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<button
										onClick={() =>
											navigate(
												`/new-lead?eventId=${evento.id}&eventName=${encodeURIComponent(evento.name)}`,
											)
										}
										className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
									>
										<Plus size={14} /> Capturar Novo Lead
									</button>

									<button
										onClick={() =>
											navigate(
												`/leads?eventId=${evento.id}`,
											)
										}
										className="w-full py-3 bg-slate-900/50 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
									>
										<Eye size={14} /> Ver Leads do Evento
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
