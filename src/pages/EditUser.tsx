import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	User,
	Mail,
	Shield,
	ArrowLeft,
	Loader2,
	Save,
	Camera,
} from "lucide-react";
import { api } from "../services/api";

export function EditUser() {
	const navigate = useNavigate();
	const { id } = useParams();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "VENDEDOR",
	});

	useEffect(() => {
		async function loadUser() {
			try {
				const response = await api.get(`/users/${id}`);
				const user = response.data.data || response.data;

				setFormData({
					name: user.name || "",
					email: user.email || "",
					role: user.role || "VENDEDOR",
				});

				if (user.avatar_url) {
					setPreview(user.avatar_url);
				}
			} catch (err) {
				console.error("Erro @rpg:", err);
				alert("Erro ao carregar usuário.");
				navigate("/users");
			} finally {
				setLoading(false);
			}
		}
		loadUser();
	}, [id, navigate]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const data = new FormData();
			data.append("name", formData.name);
			data.append("role", formData.role);
			if (avatarFile) {
				data.append("avatar", avatarFile);
			}

			await api.put(`/users/${id}`, data);
			alert("Usuário atualizado com sucesso! 🏆");
			navigate("/users");
		} catch (err: any) {
			alert(err.response?.data?.message || "Erro ao salvar.");
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
			<div className="w-full max-w-md">
				<button
					onClick={() => navigate("/users")}
					className="flex items-center gap-2 text-slate-400 mb-8 hover:text-white transition-colors"
				>
					<ArrowLeft size={20} /> Voltar para equipe
				</button>

				<form
					onSubmit={handleSubmit}
					className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6"
				>
					<div className="flex flex-col items-center gap-4">
						<div className="relative group">
							<div className="w-28 h-28 rounded-full bg-slate-900 border-2 border-blue-500/50 overflow-hidden flex items-center justify-center shadow-inner">
								{preview ? (
									<img
										src={preview}
										alt="Avatar"
										className="w-full h-full object-cover"
										referrerPolicy="no-referrer"
										crossOrigin="anonymous"
									/>
								) : (
									<User
										size={48}
										className="text-slate-700"
									/>
								)}
							</div>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="absolute bottom-1 right-1 p-2.5 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"
							>
								<Camera size={18} />
							</button>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={handleFileChange}
							/>
						</div>
						<h2 className="text-2xl font-bold">Editar Perfil</h2>
					</div>

					<div className="space-y-4">
						<div className="space-y-1">
							<label className="text-xs font-bold text-slate-500 uppercase">
								Nome
							</label>
							<input
								required
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
							/>
						</div>

						<div className="space-y-1 opacity-60">
							<label className="text-xs font-bold text-slate-500 uppercase">
								E-mail
							</label>
							<input
								disabled
								className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 cursor-not-allowed"
								value={formData.email}
							/>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-bold text-slate-500 uppercase">
								Nível de Acesso
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
								<option value="VENDEDOR">Vendedor</option>
								<option value="ADMIN">Administrador</option>
							</select>
						</div>
					</div>

					<button
						disabled={saving}
						className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg"
					>
						{saving ? (
							<Loader2 className="animate-spin" />
						) : (
							<>
								<Save size={20} /> Atualizar
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
