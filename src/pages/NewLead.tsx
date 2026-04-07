import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	User,
	Phone,
	Mail,
	Building2,
	Map,
	Camera,
	ArrowLeft,
	Loader2,
	CheckCircle,
	MapPin,
} from "lucide-react";
import { api } from "../services/api";

export function NewLead() {
	const navigate = useNavigate();
	const location = useLocation();

	// Recupera dados do evento passados pela URL
	const eventId = new URLSearchParams(location.search).get("eventId");
	const eventName = new URLSearchParams(location.search).get("eventName");

	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<any[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		city: "",
		state: "",
		observation: "",
	});

	// MÁSCARA DE TELEFONE CORRIGIDA (45) 91234-5678
	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, ""); // Remove letras

		if (value.length <= 11) {
			// Formatação progressiva
			if (value.length > 2 && value.length <= 6) {
				value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
			} else if (value.length > 6) {
				value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
			} else if (value.length > 0) {
				value = `(${value}`;
			}
			setFormData({ ...formData, phone: value });
		}
	};

	useEffect(() => {
		async function loadProducts() {
			try {
				const response = await api.get("/products");
				setProducts(response.data.data || response.data);
			} catch (err) {
				console.error("Erro ao carregar produtos:", err);
			}
		}
		loadProducts();
	}, []);

	const toggleProduct = (id: string) => {
		setSelectedProducts((prev) =>
			prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedProducts.length === 0)
			return alert("Selecione pelo menos um produto de interesse.");

		setLoading(true);
		try {
			const response = await api.post("/leads", {
				...formData,
				eventId,
				interests: selectedProducts,
			});

			const leadId = response.data.data.id;
			// Próximo passo: Upload da Foto do Cartão
			navigate(`/upload-card/${leadId}`);
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao salvar lead.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-4 md:p-6 text-white">
			<div className="max-w-3xl mx-auto">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition-colors cursor-pointer"
				>
					<ArrowLeft size={20} /> Voltar
				</button>

				<div className="mb-8">
					<h2 className="text-3xl font-bold">Novo Lead</h2>
					<p className="text-blue-400 font-medium flex items-center gap-2">
						<MapPin size={18} /> Evento:{" "}
						{eventName || "Selecionado"}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6 pb-24">
					{/* SEÇÃO: DADOS DO CONTATO */}
					<div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
						<h3 className="flex items-center gap-2 text-lg font-semibold border-b border-slate-700 pb-3 mb-2">
							<User size={20} className="text-blue-500" />{" "}
							Informações do Contato
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1">
								<label className="text-xs text-slate-400 uppercase font-bold">
									Nome Completo *
								</label>
								<input
									required
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none transition-all"
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
									Telefone *
								</label>
								<input
									required
									placeholder="(00) 00000-0000"
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none transition-all"
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
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none"
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
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none"
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
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none"
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
									placeholder="Ex: PR"
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none uppercase"
									onChange={(e) =>
										setFormData({
											...formData,
											state: e.target.value,
										})
									}
								/>
							</div>
						</div>

						<div className="space-y-1 pt-2">
							<label className="text-xs text-slate-400 uppercase font-bold">
								Observações
							</label>
							<textarea
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 h-24 resize-none focus:border-blue-500 outline-none"
								onChange={(e) =>
									setFormData({
										...formData,
										observation: e.target.value,
									})
								}
							/>
						</div>
					</div>

					{/* SEÇÃO: PRODUTOS */}
					<div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
						<h3 className="flex items-center gap-2 text-lg font-semibold border-b border-slate-700 pb-3 mb-4">
							<CheckCircle size={20} className="text-blue-500" />{" "}
							Produtos de Interesse *
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{products.map((product) => (
								<button
									key={product.id}
									type="button"
									onClick={() => toggleProduct(product.id)}
									className={`p-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
										selectedProducts.includes(product.id)
											? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20"
											: "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500"
									}`}
								>
									{product.name}
								</button>
							))}
						</div>
					</div>

					{/* BOTÃO SALVAR */}
					<button
						disabled={loading}
						className="fixed bottom-6 left-6 right-6 md:relative md:bottom-0 md:left-0 md:right-0 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold text-lg shadow-2xl cursor-pointer flex justify-center items-center gap-3 transition-all active:scale-95 disabled:bg-slate-700"
					>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<>
								Próximo: Foto do Cartão <Camera size={22} />
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
