import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowLeft, Loader2 } from "lucide-react";
import { api } from "../services/api";

export function NewProduct() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({ name: "", description: "" });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.post("/products", formData);
			alert("Produto cadastrado!");
			navigate("/products");
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao cadastrar.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
			<div className="w-full max-w-xl">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-slate-400 mb-8"
				>
					<ArrowLeft size={20} /> Voltar
				</button>
				<form
					onSubmit={handleSubmit}
					className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-6"
				>
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<Package className="text-blue-500" /> Novo Produto
					</h2>
					<div>
						<label className="block text-sm text-slate-400 mb-2">
							Nome do Produto
						</label>
						<input
							required
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5"
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
						/>
					</div>
					<div>
						<label className="block text-sm text-slate-400 mb-2">
							Descrição / Detalhes
						</label>
						<textarea
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 h-32"
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
						/>
					</div>
					<button
						disabled={loading}
						className="w-full bg-blue-600 py-3 rounded-lg font-bold"
					>
						{loading ? (
							<Loader2 className="animate-spin mx-auto" />
						) : (
							"Salvar Produto"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
