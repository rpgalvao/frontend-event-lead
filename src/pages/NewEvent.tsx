import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft, Loader2, Info } from "lucide-react";
import { api } from "../services/api";

export function NewEvent() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		location: "", // Novo campo
		start_date: "",
		end_date: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// Enviando para o seu backend @rpg
			await api.post("/events", {
				name: formData.name,
				location: formData.location,
				// O Prisma espera formato ISO-8601 (Ex: 2026-05-20T09:00:00Z)
				start_date: new Date(formData.start_date).toISOString(),
				end_date: new Date(formData.end_date).toISOString(),
			});

			alert("Evento cadastrado com sucesso! 🚀");
			navigate("/dashboard");
		} catch (err: any) {
			console.error("Erro ao criar evento:", err);
			alert(
				err.response?.data?.message ||
					"Erro ao criar evento. Verifique sua permissão.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-slate-100">
			<div className="max-w-2xl mx-auto">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
				>
					<ArrowLeft size={20} /> Voltar ao Painel
				</button>

				<div className="mb-8">
					<h2 className="text-3xl font-bold">Cadastrar Evento</h2>
					<p className="text-slate-400 mt-2">
						Preencha os dados para iniciar a captação de leads.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl"
				>
					{/* NOME DO EVENTO */}
					<div>
						<label className="block text-slate-400 mb-2 text-sm font-medium">
							Nome do Evento
						</label>
						<div className="relative">
							<Info
								className="absolute left-3 top-3 text-slate-500"
								size={18}
							/>
							<input
								required
								placeholder="Ex: Feira Hospitalar 2026"
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all"
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
							/>
						</div>
					</div>

					{/* LOCALIZAÇÃO (O campo que você pediu) */}
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
								placeholder="Ex: São Paulo Expo - Estande 45"
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all"
								onChange={(e) =>
									setFormData({
										...formData,
										location: e.target.value,
									})
								}
							/>
						</div>
					</div>

					{/* CALENDÁRIOS (Início e Fim) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-slate-400 mb-2 text-sm font-medium">
								Data e Hora de Início
							</label>
							<div className="relative">
								<Calendar
									className="absolute left-3 top-3 text-slate-500"
									size={18}
								/>
								<input
									type="datetime-local" // AQUI ESTÁ O CALENDÁRIO MÁGICO
									required
									className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white scheme-dark"
									onChange={(e) =>
										setFormData({
											...formData,
											start_date: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div>
							<label className="block text-slate-400 mb-2 text-sm font-medium">
								Data e Hora de Término
							</label>
							<div className="relative">
								<Calendar
									className="absolute left-3 top-3 text-slate-500"
									size={18}
								/>
								<input
									type="datetime-local" // AQUI ESTÁ O CALENDÁRIO MÁGICO
									required
									className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 text-white scheme-dark"
									onChange={(e) =>
										setFormData({
											...formData,
											end_date: e.target.value,
										})
									}
								/>
							</div>
						</div>
					</div>

					<button
						disabled={isLoading}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all mt-4"
					>
						{isLoading ? (
							<Loader2 className="animate-spin" />
						) : (
							"Confirmar Cadastro"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
