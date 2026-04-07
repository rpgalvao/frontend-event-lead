import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	User,
	Phone,
	Mail,
	Building2,
	ArrowLeft,
	Loader2,
	Save,
} from "lucide-react";
import { api } from "../services/api";

export function EditLead() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		city: "",
		state: "",
		observation: "",
	});

	// FUNÇÃO DE MÁSCARA IDENTICA AO CADASTRO
	const applyPhoneMask = (value: string) => {
		let rawValue = value.replace(/\D/g, ""); // Remove tudo que não é número

		if (rawValue.length <= 11) {
			if (rawValue.length > 2 && rawValue.length <= 6) {
				return `(${rawValue.slice(0, 2)}) ${rawValue.slice(2)}`;
			} else if (rawValue.length > 6) {
				return `(${rawValue.slice(0, 2)}) ${rawValue.slice(2, 7)}-${rawValue.slice(7)}`;
			} else if (rawValue.length > 0) {
				return `(${rawValue}`;
			}
		}
		return rawValue.slice(0, 15); // Limite de caracteres da máscara
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const maskedValue = applyPhoneMask(e.target.value);
		setFormData({ ...formData, phone: maskedValue });
	};

	useEffect(() => {
		async function loadLead() {
			try {
				const response = await api.get(`/leads/${id}`);
				const lead = response.data.data || response.data;

				setFormData({
					name: lead.name || "",
					email: lead.email || "",
					// Aplicamos a máscara logo no carregamento dos dados
					phone: applyPhoneMask(lead.phone || ""),
					company: lead.company || "",
					city: lead.city || "",
					state: lead.state || "",
					observation: lead.observation || "",
				});
			} catch (err: any) {
				console.error("Erro @rpg:", err);
				alert("Erro ao carregar dados do lead.");
				navigate("/leads");
			} finally {
				setLoading(false);
			}
		}
		if (id) loadLead();
	}, [id, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await api.put(`/leads/${id}`, formData);
			alert("Lead atualizado com sucesso! 🏆");
			navigate("/leads");
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao salvar alterações.");
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={40} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
			<div className="w-full max-w-2xl">
				<button
					onClick={() => navigate("/leads")}
					className="flex items-center gap-2 text-slate-400 mb-8 cursor-pointer hover:text-white transition-colors"
				>
					<ArrowLeft size={20} /> Voltar para lista
				</button>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6"
				>
					<h2 className="text-2xl font-bold flex items-center gap-3 border-b border-slate-700 pb-4">
						<User className="text-blue-500" /> Editar Lead
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-1">
							<label className="text-xs text-slate-400 uppercase font-bold">
								Nome Completo
							</label>
							<input
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs text-slate-400 uppercase font-bold">
								Telefone
							</label>
							<input
								required
								placeholder="(45) 91234-5678"
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all"
								value={formData.phone}
								onChange={handlePhoneChange}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs text-slate-400 uppercase font-bold">
								E-mail
							</label>
							<input
								type="email"
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all"
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs text-slate-400 uppercase font-bold">
								Empresa
							</label>
							<input
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all"
								value={formData.company}
								onChange={(e) =>
									setFormData({
										...formData,
										company: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs text-slate-400 uppercase font-bold">
								Cidade
							</label>
							<input
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all"
								value={formData.city}
								onChange={(e) =>
									setFormData({
										...formData,
										city: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs text-slate-400 uppercase font-bold">
								Estado (UF)
							</label>
							<input
								maxLength={2}
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500 uppercase transition-all"
								value={formData.state}
								onChange={(e) =>
									setFormData({
										...formData,
										state: e.target.value,
									})
								}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<label className="text-xs text-slate-400 uppercase font-bold">
							Observações
						</label>
						<textarea
							className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-32 resize-none outline-none focus:border-blue-500 transition-all"
							value={formData.observation}
							onChange={(e) =>
								setFormData({
									...formData,
									observation: e.target.value,
								})
							}
						/>
					</div>

					<button
						disabled={saving}
						className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-blue-600/20 disabled:bg-slate-700"
					>
						{saving ? (
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
