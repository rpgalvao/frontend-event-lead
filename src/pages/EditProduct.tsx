import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft, Loader2, Save } from "lucide-react";
import { api } from "../services/api";

export function EditProduct() {
	const navigate = useNavigate();
	const { id } = useParams(); // Captura o ID do produto da URL
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	// 1. BUSCA OS DADOS DO PRODUTO PARA PREENCHER O FORMULÁRIO
	useEffect(() => {
		async function loadProduct() {
			try {
				const response = await api.get(`/products/${id}`);
				const produto = response.data.data || response.data;

				setFormData({
					name: produto.name,
					description: produto.description || "",
				});
			} catch (err) {
				console.error("Erro @rpg ao carregar produto:", err);
				alert("Não foi possível carregar os dados do produto.");
				navigate("/products");
			} finally {
				setIsLoading(false);
			}
		}
		loadProduct();
	}, [id, navigate]);

	// 2. ENVIA A ATUALIZAÇÃO (PUT)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		try {
			await api.put(`/products/${id}`, formData);

			alert("Produto atualizado com sucesso! 🏆");
			navigate("/products");
		} catch (err: any) {
			console.error("Erro ao atualizar:", err);
			alert(err.response?.data?.message || "Erro ao atualizar produto.");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
				<Loader2 className="animate-spin text-blue-500 mr-2" />{" "}
				Carregando produto...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
			<div className="w-full max-w-xl">
				<button
					onClick={() => navigate("/products")}
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
				>
					<ArrowLeft size={20} /> Cancelar e Voltar
				</button>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6"
				>
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-blue-500/10 rounded-lg">
							<Package className="text-blue-500" size={24} />
						</div>
						<h2 className="text-2xl font-bold">Editar Produto</h2>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-2 font-medium">
							Nome do Produto
						</label>
						<input
							required
							value={formData.name}
							className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 transition-all"
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
						/>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-2 font-medium">
							Descrição / Detalhes Técnicos
						</label>
						<textarea
							value={formData.description}
							className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-4 h-40 focus:outline-none focus:border-blue-500 transition-all resize-none"
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
						/>
					</div>

					<button
						disabled={isSaving}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
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
