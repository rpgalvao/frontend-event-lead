import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Camera,
	ArrowLeft,
	Loader2,
	Upload,
	Image as ImageIcon,
} from "lucide-react";
import { api } from "../services/api";

export function UploadCard() {
	const navigate = useNavigate();
	const { id } = useParams(); // Pega o ID do Lead da URL
	const [loading, setLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	// 1. Captura o arquivo e gera o preview visual
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setImagePreview(URL.createObjectURL(selectedFile));
		}
	};

	// 2. Realiza o upload para o Backend
	const handleUpload = async () => {
		if (!file)
			return alert("Por favor, tire uma foto ou selecione um arquivo.");

		setLoading(true);

		// Criando o corpo da requisição multipart
		const formData = new FormData();

		/** * CORREÇÃO AQUI:
		 * O seu lead.routes.ts define: upload.single('card')
		 * Por isso, a chave obrigatoriamente deve ser 'card'
		 */
		formData.append("card", file);

		try {
			/**
			 * CORREÇÃO DA ROTA:
			 * De acordo com seu lead.routes.ts, o endpoint é /leads/:id/card
			 */
			await api.patch(`/leads/${id}/card`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			alert("Cartão de visita salvo com sucesso! 🏆");
			navigate("/dashboard");
		} catch (err: any) {
			console.error(
				"Erro no upload @rpg:",
				err.response?.data || err.message,
			);

			// Se o erro vier do fileFilter do multer.ts (Tipo de arquivo inválido)
			const errorMessage =
				err.response?.data?.message ||
				"Erro ao processar imagem. Verifique o formato.";
			alert(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-900 p-6 text-white flex flex-col items-center">
			<div className="w-full max-w-md">
				<button
					onClick={() => navigate("/dashboard")}
					className="flex items-center gap-2 text-slate-400 mb-8 hover:text-white transition-colors cursor-pointer"
				>
					<ArrowLeft size={20} /> Pular / Finalizar
				</button>

				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold">Foto do Cartão</h2>
					<p className="text-slate-400 mt-2">
						Vincule uma imagem ao lead capturado
					</p>
				</div>

				{/* Área de Preview / Dropzone */}
				<div className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden transition-all hover:border-blue-500/50">
					{imagePreview ? (
						<div className="w-full h-full flex flex-col items-center">
							<img
								src={imagePreview}
								alt="Preview"
								className="rounded-2xl max-h-[350px] object-contain shadow-2xl"
							/>
							<button
								onClick={() => {
									setImagePreview(null);
									setFile(null);
								}}
								className="mt-4 text-red-400 text-sm font-semibold hover:text-red-300 transition-colors cursor-pointer"
							>
								Remover e tirar outra
							</button>
						</div>
					) : (
						<label className="flex flex-col items-center cursor-pointer group w-full py-12">
							<div className="p-6 bg-slate-900 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
								<Camera size={48} className="text-blue-500" />
							</div>
							<span className="text-slate-300 font-medium">
								Abrir Câmera
							</span>
							<span className="text-slate-500 text-xs mt-2">
								Formatos aceitos: JPG, JPEG ou PNG
							</span>

							<input
								type="file"
								accept="image/*"
								capture="environment"
								className="hidden"
								onChange={handleFileChange}
							/>
						</label>
					)}
				</div>

				{/* Ações */}
				<div className="mt-10 space-y-4">
					<button
						disabled={!file || loading}
						onClick={handleUpload}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 flex justify-center items-center gap-3 transition-all cursor-pointer active:scale-95"
					>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<>
								<Upload size={22} /> Confirmar e Enviar
							</>
						)}
					</button>

					<button
						onClick={() => navigate("/dashboard")}
						className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors cursor-pointer text-center"
					>
						Finalizar sem foto
					</button>
				</div>
			</div>
		</div>
	);
}
