import { useState } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTANTE: Hook para navegação
import { Lock, Mail, Loader2 } from "lucide-react";

interface LoginProps {
	onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
	const navigate = useNavigate(); // Inicializa o navegador
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Por favor, preencha todos os campos da @rpg Sistemas.");
			return;
		}

		setIsLoading(true);

		// Simulando a chamada de API
		setTimeout(() => {
			setIsLoading(false);

			// 1. Muda o estado global no App.tsx para "true"
			onLoginSuccess();

			// 2. MANDA O USUÁRIO PARA O DASHBOARD (Faltava isso!)
			navigate("/dashboard");
		}, 1500);
	};

	return (
		<div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
				<h2 className="text-3xl font-bold text-white text-center mb-8">
					@rpg Sistemas
				</h2>

				{error && (
					<div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-6 text-center italic">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label className="block text-slate-400 text-sm mb-2">
							E-mail
						</label>
						<div className="relative">
							<Mail
								className="absolute left-3 top-3 text-slate-500"
								size={20}
							/>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
								placeholder="seu@email.com"
							/>
						</div>
					</div>

					<div>
						<label className="block text-slate-400 text-sm mb-2">
							Senha
						</label>
						<div className="relative">
							<Lock
								className="absolute left-3 top-3 text-slate-500"
								size={20}
							/>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<button
						disabled={isLoading}
						className={`w-full font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2
              ${isLoading ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"}`}
					>
						{isLoading ? (
							<Loader2 className="animate-spin" size={20} />
						) : (
							"Entrar no Sistema"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
