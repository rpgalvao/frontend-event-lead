import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	ArrowLeft,
	Search,
	Calendar,
	Phone,
	Mail,
	ExternalLink,
	FileText,
	X,
	Loader2,
	Edit,
	Trash2,
	Eye,
	Tag,
	MessageSquare,
} from "lucide-react";
import { api } from "../services/api";

export function Leads() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [leads, setLeads] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedLead, setSelectedLead] = useState<any | null>(null);
	const [zoomImage, setZoomImage] = useState<string | null>(null);
	const [filterText, setFilterText] = useState("");

	const eventId = searchParams.get("eventId") || "";

	async function loadLeads() {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			if (eventId) params.append("eventId", eventId);
			const response = await api.get(`/leads?${params.toString()}`);
			setLeads(response.data.data || response.data);
		} catch (err) {
			console.error("Erro @rpg Sistemas:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadLeads();
	}, [eventId]);

	const handleDelete = async (id: string, name: string) => {
		if (confirm(`Deseja excluir o lead ${name}?`)) {
			try {
				await api.delete(`/leads/${id}`);
				setLeads((prev) => prev.filter((l) => l.id !== id));
				setSelectedLead(null);
			} catch (err) {
				alert("Erro ao excluir.");
			}
		}
	};

	const filteredLeads = leads.filter(
		(lead) =>
			lead.name.toLowerCase().includes(filterText.toLowerCase()) ||
			(lead.company &&
				lead.company.toLowerCase().includes(filterText.toLowerCase())),
	);

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
			{zoomImage && (
				<div
					className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
					onClick={() => setZoomImage(null)}
				>
					<button className="absolute top-6 right-6 text-white bg-slate-800 p-3 rounded-full hover:bg-slate-700">
						<X size={32} />
					</button>
					<img
						src={zoomImage}
						className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
						alt="Zoom"
						crossOrigin="anonymous"
					/>
				</div>
			)}

			<header className="max-w-6xl mx-auto mb-8">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-bold uppercase text-[10px] tracking-widest"
				>
					<ArrowLeft size={16} /> Painel Principal
				</button>
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<h1 className="text-4xl font-black tracking-tighter uppercase">
						Gestão de <span className="text-blue-500">Leads</span>
					</h1>
					<div className="relative group">
						<Search
							className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500"
							size={20}
						/>
						<input
							type="text"
							placeholder="Filtrar por nome ou empresa..."
							className="bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-6 w-full md:w-96 outline-none focus:border-blue-500 shadow-xl backdrop-blur-sm transition-all"
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
						/>
					</div>
				</div>
			</header>

			<main className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{filteredLeads.map((lead) => (
					<div
						key={lead.id}
						className="bg-slate-800 border border-slate-700 p-6 rounded-[2.5rem] flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-xl group relative overflow-hidden"
					>
						<div>
							<div className="flex justify-between items-start mb-6">
								<div className="max-w-[75%]">
									<h3 className="font-black text-xl truncate uppercase">
										{lead.name}
									</h3>
									<p className="text-sm text-blue-500 font-black uppercase mt-1 truncate">
										{lead.company || "Particular"}
									</p>
								</div>
								<button
									onClick={() => setSelectedLead(lead)}
									className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all shadow-lg"
								>
									<ExternalLink size={20} />
								</button>
							</div>
							<div className="space-y-3 text-sm text-slate-400 mb-8 font-medium">
								<div className="flex items-center gap-3">
									<Mail
										size={14}
										className="text-slate-500"
									/>{" "}
									{lead.email || "---"}
								</div>
								<div className="flex items-center gap-3">
									<Phone
										size={14}
										className="text-slate-500"
									/>{" "}
									{lead.phone}
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
							<span className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-1.5">
								<Calendar size={12} className="text-blue-500" />{" "}
								{lead.event?.name || "Geral"}
							</span>
							<div className="flex gap-2">
								<button
									onClick={() =>
										navigate(`/edit-lead/${lead.id}`)
									}
									className="p-2 text-slate-500 hover:text-amber-500 transition-colors"
								>
									<Edit size={18} />
								</button>
								<button
									onClick={() =>
										handleDelete(lead.id, lead.name)
									}
									className="p-2 text-slate-500 hover:text-red-500 transition-colors"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					</div>
				))}
			</main>

			{selectedLead && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
					<div className="bg-slate-800 border border-slate-700 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl">
						<div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
									<FileText size={24} />
								</div>
								<h2 className="font-black text-2xl uppercase tracking-tighter">
									Dossiê do{" "}
									<span className="text-blue-500">Lead</span>
								</h2>
							</div>
							<button
								onClick={() => setSelectedLead(null)}
								className="p-3 hover:bg-slate-700 rounded-2xl text-slate-400 transition-colors"
							>
								<X size={32} />
							</button>
						</div>

						<div className="p-10 grid md:grid-cols-2 gap-12 max-h-[70vh] overflow-y-auto">
							<div className="space-y-8">
								<section>
									<label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-3">
										Identificação
									</label>
									<p className="text-3xl font-black text-white uppercase tracking-tight">
										{selectedLead.name}
									</p>
									<p className="text-xl text-blue-500 font-black uppercase tracking-widest mt-1">
										{selectedLead.company ||
											"Empresa não informada"}
									</p>
								</section>

								<div className="grid gap-4">
									<div className="flex items-center gap-5 p-5 bg-slate-900/50 rounded-[2rem] border border-slate-700/50">
										<Mail
											className="text-blue-500"
											size={24}
										/>
										<div>
											<label className="text-[9px] uppercase font-black text-slate-600 tracking-widest">
												E-mail de Contato
											</label>
											<p className="text-sm font-bold">
												{selectedLead.email ||
													"NÃO INFORMADO"}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-5 p-5 bg-slate-900/50 rounded-[2rem] border border-slate-700/50">
										<Phone
											className="text-green-500"
											size={24}
										/>
										<div>
											<label className="text-[9px] uppercase font-black text-slate-600 tracking-widest">
												WhatsApp
											</label>
											<p className="text-sm font-bold">
												{selectedLead.phone}
											</p>
										</div>
									</div>
								</div>

								<section>
									<label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-4 flex items-center gap-2">
										<Tag
											size={12}
											className="text-blue-500"
										/>{" "}
										Interesses do Cliente
									</label>
									<div className="flex flex-wrap gap-2">
										{selectedLead.interests &&
										selectedLead.interests.length > 0 ? (
											selectedLead.interests.map(
												(prod: any) => (
													<span
														key={prod.id}
														className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
													>
														{prod.name}
													</span>
												),
											)
										) : (
											<span className="text-slate-600 text-xs italic">
												Nenhum produto selecionado
											</span>
										)}
									</div>
								</section>

								<section>
									<label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-3 flex items-center gap-2">
										<MessageSquare
											size={12}
											className="text-blue-500"
										/>{" "}
										Observações de Campo
									</label>
									<div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700/50 text-slate-300 text-sm leading-relaxed italic">
										{selectedLead.observation
											? `"${selectedLead.observation}"`
											: "Sem observações registradas."}
									</div>
								</section>
							</div>

							<div className="flex flex-col gap-4">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
									Cartão de Visitas
								</label>
								<div
									className="bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-700 aspect-video flex items-center justify-center overflow-hidden group relative cursor-zoom-in"
									onClick={() =>
										selectedLead.business_card_url &&
										setZoomImage(
											selectedLead.business_card_url,
										)
									}
								>
									{selectedLead.business_card_url ? (
										<img
											src={selectedLead.business_card_url}
											alt="Cartão"
											className="w-full h-full object-contain p-6 transition-transform group-hover:scale-110"
											crossOrigin="anonymous"
										/>
									) : (
										<div className="text-center opacity-20">
											<FileText
												size={64}
												className="mx-auto mb-4"
											/>
											<p className="text-[10px] font-black uppercase">
												Imagem não disponível
											</p>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="p-8 bg-slate-900/80 border-t border-slate-700 flex justify-end gap-4">
							<button
								onClick={() =>
									navigate(`/edit-lead/${selectedLead.id}`)
								}
								className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
							>
								Editar Cadastro
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
