import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ArrowLeft,
	Save,
	Camera,
	Loader2,
	User,
	Phone,
	Mail,
	Building,
	MessageSquare,
	CheckCircle,
	RefreshCcw,
} from "lucide-react";
import { api } from "../services/api";

export function EditLead() {
	const { id } = useParams();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const [products, setProducts] = useState<any[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		observation: "",
		status: "NEW", // ADICIONADO STATUS
	});

	useEffect(() => {
		async function loadData() {
			try {
				const [leadRes, productsRes] = await Promise.all([
					api.get(`/leads/${id}`),
					api.get("/products"),
				]);

				const lead = leadRes.data.data || leadRes.data;
				const availableProducts =
					productsRes.data.data || productsRes.data;

				setFormData({
					name: lead.name,
					email: lead.email || "",
					phone: lead.phone,
					company: lead.company || "",
					observation: lead.observation || "",
					status: lead.status || "NEW",
				});

				if (lead.business_card_url) setPreview(lead.business_card_url);
				setProducts(availableProducts);
				setSelectedProducts(
					lead.interests?.map((i: any) => i.id) || [],
				);
			} catch (err) {
				alert("Lead não encontrado");
				navigate("/leads");
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, [id, navigate]);

	const toggleProduct = (productId: string) => {
		setSelectedProducts((prev) =>
			prev.includes(productId)
				? prev.filter((id) => id !== productId)
				: [...prev, productId],
		);
	};

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		try {
			await api.put(`/leads/${id}`, {
				...formData,
				interests: selectedProducts,
			});
			navigate("/leads");
		} catch (err) {
			alert("Erro ao salvar alterações");
		} finally {
			setSaving(false);
		}
	}

	if (loading)
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<Loader2 className="animate-spin text-blue-500" size={48} />
			</div>
		);

	return (
		<div className="min-h-screen bg-slate-900 text-white p-6">
			<form
				onSubmit={handleSubmit}
				className="max-w-4xl mx-auto space-y-8"
			>
				<header className="flex items-center justify-between">
					<button
						type="button"
						onClick={() => navigate("/leads")}
						className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
					>
						<ArrowLeft size={16} /> Voltar
					</button>
					<h1 className="text-2xl font-black uppercase tracking-tighter italic">
						Editar <span className="text-blue-500">Lead</span>
					</h1>
				</header>

				<div className="grid md:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4 shadow-xl">
							{/* CAMPO DE STATUS NA EDIÇÃO */}
							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
									<RefreshCcw
										size={14}
										className="text-blue-500"
									/>{" "}
									Status do Processo
								</label>
								<select
									className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 font-bold text-sm uppercase"
									value={formData.status}
									onChange={(e) =>
										setFormData({
											...formData,
											status: e.target.value,
										})
									}
								>
									<option value="NEW">Novo</option>
									<option value="QUALIFIED">
										Qualificado
									</option>
									<option value="NEGOTIATION">
										Em Negociação
									</option>
									<option value="ARCHIVED">Arquivado</option>
								</select>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
									Nome Completo
								</label>
								<div className="relative">
									<User
										className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
										size={16}
									/>
									<input
										className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-blue-500"
										value={formData.name}
										onChange={(e) =>
											setFormData({
												...formData,
												name: e.target.value,
											})
										}
										required
									/>
								</div>
							</div>

							<div className="space-y-1">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
									E-mail
								</label>
								<div className="relative">
									<Mail
										className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
										size={16}
									/>
									<input
										className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-blue-500"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({
												...formData,
												email: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="flex gap-4">
								<div className="flex-1 space-y-1">
									<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
										WhatsApp
									</label>
									<input
										className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500"
										value={formData.phone}
										onChange={(e) =>
											setFormData({
												...formData,
												phone: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="flex-1 space-y-1">
									<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
										Empresa
									</label>
									<input
										className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500"
										value={formData.company}
										onChange={(e) =>
											setFormData({
												...formData,
												company: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="space-y-1 pt-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
									<MessageSquare
										size={14}
										className="text-blue-500"
									/>{" "}
									Observações
								</label>
								<textarea
									className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 outline-none focus:border-blue-500 min-h-[120px] resize-none text-sm text-slate-300"
									value={formData.observation}
									onChange={(e) =>
										setFormData({
											...formData,
											observation: e.target.value,
										})
									}
								/>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						{/* Upload de cartão e produtos mantidos igual ao seu EditLead original */}
						<div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
							<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">
								Cartão de Visitas
							</label>
							<div
								className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-blue-500 transition-all"
								onClick={() => fileInputRef.current?.click()}
							>
								{preview ? (
									<img
										src={preview}
										className="w-full h-full object-contain p-4"
										crossOrigin="anonymous"
									/>
								) : (
									<Camera size={48} className="opacity-20" />
								)}
								<input
									type="file"
									hidden
									ref={fileInputRef}
									accept="image/*"
									onChange={(e) => {
										/* lógica de upload */
									}}
								/>
							</div>
						</div>

						<div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
							<h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-slate-700 pb-3 mb-4 text-blue-500">
								<CheckCircle size={16} /> Interesses
							</h3>
							<div className="grid grid-cols-2 gap-2">
								{products.map((product) => (
									<button
										key={product.id}
										type="button"
										onClick={() =>
											toggleProduct(product.id)
										}
										className={`p-3 rounded-xl border-2 text-[9px] font-black uppercase transition-all ${selectedProducts.includes(product.id) ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30" : "bg-slate-900 border-slate-700 text-slate-500"}`}
									>
										{product.name}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				<button
					disabled={saving}
					className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-3xl font-black uppercase tracking-[0.2em] flex justify-center items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
				>
					{saving ? (
						<Loader2 className="animate-spin" />
					) : (
						<Save size={20} />
					)}{" "}
					Confirmar Alterações
				</button>
			</form>
		</div>
	);
}
