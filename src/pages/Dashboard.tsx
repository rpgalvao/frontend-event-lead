import { useState, useEffect } from "react";
import { Calendar, MapPin, LogOut, Loader2, CheckCircle2 } from "lucide-react";

interface DashboardProps {
	onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
	const [eventos, setEventos] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedId, setSelectedId] = useState<number | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				// Buscando dados reais de uma API de teste
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/todos?_limit=6",
				);
				const data = await response.json();

				// Adaptando o JSON da API para o nosso layout
				const formatted = data.map((item: any) => ({
					id: item.id,
					title: item.title.substring(0, 25), // Encurta o título
					date: "04/04/2026",
					location: "Escritório Central",
				}));

				setEventos(formatted);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6 md:p-12">
			<header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
				<div>
					<h1 className="text-3xl font-bold text-white">
						Dashboard @rpg
					</h1>
					<p className="text-slate-400">
						Gerencie seus eventos ativos
					</p>
				</div>
				<button
					onClick={onLogout}
					className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-500 px-4 py-2 rounded-lg transition-all border border-slate-700"
				>
					<LogOut size={18} /> Sair
				</button>
			</header>

			<main className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{eventos.map((evento) => (
					<div
						key={evento.id}
						onClick={() => setSelectedId(evento.id)}
						className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
              ${
					selectedId === evento.id
						? "bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10"
						: "bg-slate-800 border-slate-700 hover:border-slate-500"
				}`}
					>
						<h3 className="text-xl font-semibold text-white mb-4 pr-6">
							{evento.title}
						</h3>

						<div className="space-y-3">
							<div className="flex items-center gap-2 text-slate-400 text-sm">
								<Calendar size={16} className="text-blue-500" />
								{evento.date}
							</div>
							<div className="flex items-center gap-2 text-slate-400 text-sm">
								<MapPin size={16} className="text-blue-500" />
								{evento.location}
							</div>
						</div>

						{selectedId === evento.id && (
							<CheckCircle2
								className="absolute top-4 right-4 text-blue-500 animate-bounce"
								size={24}
							/>
						)}
					</div>
				))}
			</main>
		</div>
	);
}
