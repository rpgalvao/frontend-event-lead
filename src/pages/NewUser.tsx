import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Mail,
	Lock,
	ShieldCheck,
	ArrowLeft,
	Loader2,
	Save,
} from "lucide-react";
import { api } from "../services/api";

export function NewUser() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "USER",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.post("/users", formData);
			alert("Usuário cadastrado com sucesso! 🚀");
			navigate("/users");
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao cadastrar.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
			<div className="w-full max-w-md">
				<button
					onClick={() => navigate("/users")}
					className="flex items-center gap-2 text-slate-400 mb-8 cursor-pointer hover:text-white"
				>
					<ArrowLeft size={20} /> Voltar
				</button>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6"
				>
					<div className="text-center">
						<h2 className="text-2xl font-bold">Novo Integrante</h2>
						<p className="text-slate-400 text-sm mt-1">
							Defina o acesso para a equipe
						</p>
					</div>

					<div className="space-y-4">
						<div className="space-y-1">
							<label className="text-xs font-bold text-slate-500 uppercase">
								Nome Completo
							</label>
							<input
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-bold text-slate-500 uppercase">
								E-mail de Acesso
							</label>
							<input
								type="email"
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-bold text-slate-500 uppercase">
								Senha Temporária
							</label>
							<input
								type="password"
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
								onChange={(e) =>
									setFormData({
										...formData,
										password: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-bold text-slate-500 uppercase">
								Nível de Permissão
							</label>
							<select
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
								value={formData.role}
								onChange={(e) =>
									setFormData({
										...formData,
										role: e.target.value,
									})
								}
							>
								<option value="USER">
									Vendedor (Captura Leads)
								</option>
								<option value="ADMIN">
									Administrador (Gestão Total)
								</option>
							</select>
						</div>
					</div>

					<button
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
					>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<>
								<Save size={20} /> Cadastrar Membro
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
