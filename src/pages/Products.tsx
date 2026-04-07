import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Package,
	Plus,
	Trash2,
	Edit,
	ArrowLeft,
	Loader2,
	Tag,
} from "lucide-react";
import { api } from "../services/api";

interface Produto {
	id: string;
	name: string;
	description: string;
}

export function Products() {
	const navigate = useNavigate();
	const [produtos, setProdutos] = useState<Produto[]>([]);
	const [loading, setLoading] = useState(true);

	const user = JSON.parse(localStorage.getItem("@rpg:user") || "{}");
	const isAdmin = user.role === "ADMIN";

	async function loadProducts() {
		try {
			const response = await api.get("/products");
			setProdutos(response.data.data || response.data);
		} catch (err) {
			console.error("Erro ao carregar produtos:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadProducts();
	}, []);

	const handleDelete = async (id: string, name: string) => {
		if (confirm(`Deseja remover o produto: ${name}?`)) {
			try {
				await api.delete(`/products/${id}`);
				setProdutos((prev) => prev.filter((p) => p.id !== id));
			} catch (err: any) {
				alert(
					err.response?.data?.message || "Erro ao deletar produto.",
				);
			}
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white">
			<header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft size={20} /> Voltar
				</button>
				{isAdmin && (
					<button
						onClick={() => navigate("/new-product")}
						className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
					>
						<Plus size={18} /> Novo Produto
					</button>
				)}
			</header>

			<main className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{produtos.map((prod) => (
					<div
						key={prod.id}
						className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative group"
					>
						{isAdmin && (
							<div className="absolute top-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
								<button
									onClick={() =>
										navigate(`/edit-product/${prod.id}`)
									}
									className="p-2 bg-slate-700 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white"
								>
									<Edit size={16} />
								</button>
								<button
									onClick={() =>
										handleDelete(prod.id, prod.name)
									}
									className="p-2 bg-slate-700 text-red-400 rounded-md hover:bg-red-500 hover:text-white"
								>
									<Trash2 size={16} />
								</button>
							</div>
						)}
						<Tag className="text-blue-500 mb-4" size={24} />
						<h3 className="text-xl font-bold mb-2">{prod.name}</h3>
						<p className="text-slate-400 text-sm line-clamp-3">
							{prod.description || "Sem descrição disponível."}
						</p>
					</div>
				))}
			</main>
		</div>
	);
}
