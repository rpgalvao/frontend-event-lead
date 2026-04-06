import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft, Loader2, Save } from "lucide-react";
import { api } from "../services/api";

export function EditEvent() {
	const navigate = useNavigate();
	const { id } = useParams(); // Pega o ID do evento da URL
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		location: "",
		start_date: "",
		end_date: "",
	});

	// 1. BUSCA OS DADOS ATUAIS DO EVENTO AO CARREGAR
	useEffect(() => {
		async function loadEvent() {
			try {
				const response = await api.get(`/events/${id}`);
				const evento = response.data.data || response.data;

				// Formatamos a data para o input datetime-local (YYYY-MM-DDTHH:mm)
				const start = new Date(evento.start_date)
					.toISOString()
					.slice(0, 16);
				const end = new Date(evento.end_date)
					.toISOString()
					.slice(0, 16);

				setFormData({
					name: evento.name,
					location: evento.location || "",
					start_date: start,
					end_date: end,
				});
			} catch (err) {
				console.error("Erro ao carregar evento:", err);
				alert("Erro ao buscar dados do evento.");
				navigate("/dashboard");
			} finally {
				setIsLoading(false);
			}
		}
		loadEvent();
	}, [id, navigate]);

	// 2. ENVIA AS ALTERAÇÕES (PUT)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			await api.put(`/events/${id}`, {
				name: formData.name,
				location: formData.location,
				start_date: new Date(formData.start_date).toISOString(),
				end_date: new Date(formData.end_date).toISOString(),
			});

			alert("Evento atualizado com sucesso! 🚀");
			navigate("/dashboard");
		} catch (err: any) {
			console.error("Erro ao atualizar:", err);
			alert(err.response?.data?.message || "Erro ao atualizar evento.");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
				<Loader2 className="animate-spin mr-2" /> Carregando dados...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-slate-100">
			<div className="max-w-2xl mx-auto">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
				>
					<ArrowLeft size={20} /> Cancelar Edição
				</button>

				<div className="mb-8">
					<h2 className="text-3xl font-bold">Editar Evento</h2>
					<p className="text-slate-400 mt-2 text-sm uppercase tracking-wider">
						ID: {id}
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl"
				>
					<div>
						<label className="block text-slate-400 mb-2 text-sm font-medium">
							Nome do Evento
						</label>
						<input
							required
							value={formData.name}
							className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 text-white"
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label className="block text-slate-400 mb-2 text-sm font-medium">
							Localização / Estande
						</label>
						<div className="relative">
							<MapPin
								className="absolute left-3 top-3 text-slate-500"
								size={18}
							/>
							<input
								value={formData.location}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white"
								onChange={(e) =>
									setFormData({
										...formData,
										location: e.target.value,
									})
								}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-slate-400 mb-2 text-sm font-medium">
								Data Início
							</label>
							<input
								type="datetime-local"
								required
								value={formData.start_date}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 text-white scheme-dark"
								onChange={(e) =>
									setFormData({
										...formData,
										start_date: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="block text-slate-400 mb-2 text-sm font-medium">
								Data Fim
							</label>
							<input
								type="datetime-local"
								required
								value={formData.end_date}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 text-white scheme-dark"
								onChange={(e) =>
									setFormData({
										...formData,
										end_date: e.target.value,
									})
								}
							/>
						</div>
					</div>

					<button
						disabled={isSaving}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all mt-4"
					>
						{isSaving ? (
							<Loader2 className="animate-spin" />
						) : (
							<>
								<Save size={20} /> Salvar Alterações
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
