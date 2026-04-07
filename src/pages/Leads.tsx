import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Phone,
	Building2,
	Trash2,
	Edit,
	ArrowLeft,
	Loader2,
	Image as ImageIcon,
	Search,
	MapPin,
	Users,
} from "lucide-react";
import { api } from "../services/api";

interface Lead {
	id: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	city: string;
	state: string;
	card_image?: string;
}

export function Leads() {
	const navigate = useNavigate();
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	// FUNÇÃO DE MÁSCARA PARA EXIBIÇÃO
	const formatPhone = (value: string) => {
		if (!value) return "N/A";
		let phone = value.replace(/\D/g, ""); // Remove caracteres não numéricos

		if (phone.length === 11) {
			// Formato (00) 00000-0000
			return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
		} else if (phone.length === 10) {
			// Formato (00) 0000-0000
			return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
		}

		return value; // Retorna o original caso fuja do padrão esperado
	};

	async function loadLeads() {
		try {
			const response = await api.get("/leads");
			setLeads(response.data.data || response.data);
		} catch (err) {
			console.error("Erro ao carregar leads @rpg:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadLeads();
	}, []);

	const handleDelete = async (id: string, name: string) => {
		if (confirm(`Deseja realmente excluir o lead "${name}"?`)) {
			try {
				// Rota DELETE /leads/:id conforme definido no lead.routes.ts
				await api.delete(`/leads/${id}`);
				setLeads((prev) => prev.filter((l) => l.id !== id));
			} catch (err) {
				alert("Erro ao remover lead.");
			}
		}
	};

	const filteredLeads = leads.filter(
		(l) =>
			l.name.toLowerCase().includes(search.toLowerCase()) ||
			l.company?.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white">
			<header className="max-w-6xl mx-auto mb-10">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 cursor-pointer transition-colors"
				>
					<ArrowLeft size={20} /> Painel Principal
				</button>

				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold">Leads Capturados</h1>
						<p className="text-slate-400 text-sm mt-1">
							Gestão de contatos e prospecção
						</p>
					</div>

					<div className="relative w-full md:w-80">
						<Search
							className="absolute left-3 top-3 text-slate-500"
							size={18}
						/>
						<input
							placeholder="Buscar por nome ou empresa..."
							className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto grid gap-4">
				{filteredLeads.length > 0 ? (
					filteredLeads.map((lead) => (
						<div
							key={lead.id}
							className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-500 transition-all group shadow-lg"
						>
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-3">
									<h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
										{lead.name}
									</h3>
									{lead.card_image && (
										<div
											className="bg-blue-500/10 text-blue-400 p-1 rounded-md"
											title="Foto do cartão disponível"
										>
											<ImageIcon size={14} />
										</div>
									)}
								</div>

								<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
									<span className="flex items-center gap-2">
										<Building2
											size={16}
											className="text-blue-500"
										/>
										{lead.company ||
											"Empresa não informada"}
									</span>

									<span className="flex items-center gap-2">
										<Phone
											size={16}
											className="text-blue-500"
										/>
										{/* APLICAÇÃO DA MÁSCARA AQUI */}
										{formatPhone(lead.phone)}
									</span>

									{(lead.city || lead.state) && (
										<span className="flex items-center gap-2">
											<MapPin
												size={16}
												className="text-blue-500"
											/>
											{lead.city}
											{lead.state
												? ` - ${lead.state}`
												: ""}
										</span>
									)}
								</div>
							</div>

							<div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-700 pt-4 md:pt-0">
								<button
									onClick={() =>
										navigate(`/edit-lead/${lead.id}`)
									}
									className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700 hover:bg-blue-600 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium active:scale-95"
								>
									<Edit size={16} /> Editar
								</button>
								<button
									onClick={() =>
										handleDelete(lead.id, lead.name)
									}
									className="p-2.5 bg-slate-700 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer active:scale-95"
								>
									<Trash2 size={20} />
								</button>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-24 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
						<Users className="mx-auto mb-4 opacity-20" size={48} />
						<p className="font-medium">
							Nenhum lead encontrado para esta busca.
						</p>
					</div>
				)}
			</main>
		</div>
	);
}
