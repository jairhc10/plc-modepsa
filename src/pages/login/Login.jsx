import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const result = login(email, password);
      
      if (result.success) {
        toast.success('¡Bienvenido a MODEPSA!', {
          description: 'Inicio de sesión exitoso',
          duration: 3000,
        });
        
        // Redirigir después de 500ms
        setTimeout(() => {
          navigate('/home');
        }, 500);
      } else {
        toast.error('Credenciales incorrectas', {
          description: 'Por favor verifica tu usuario y contraseña',
          duration: 3000,
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-lighten blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400/30 rounded-full mix-blend-lighten blur-3xl opacity-50 animate-pulse" style={{animationDelay: '700ms'}}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:bg-white/15 hover:border-blue-400/40">
          
          {/* Logo animado */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl opacity-50 animate-spin-slow"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg 
                viewBox="0 0 24 24" 
                className="w-11 h-11 stroke-white fill-blue-200/20 animate-spin-reverse"
                strokeWidth="2"
              >
                <path d="M12 2l2 2.5 3.2-.2 1.1 3 3 1.1-.2 3.2L22 12l-2.5 2 .2 3.2-3 1.1-1.1 3-3.2-.2L12 22l-2-2.5-3.2.2-1.1-3-3-1.1.2-3.2L2 12l2.5-2-.2-3.2 3-1.1 1.1-3 3.2.2L12 2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">MODEPSA</h2>
            <p className="text-blue-200 text-sm">Bienvenido de vuelta</p>
          </div>

          {/* Inputs */}
          <div className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white block pl-1">Usuario</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" />
                  <input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="relative w-full pl-12 pr-4 py-3.5 bg-slate-900/60 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 transition-all duration-300 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white block pl-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="relative w-full pl-12 pr-14 py-3.5 bg-slate-900/60 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-900/80 transition-all duration-300 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-blue-200 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-blue-300/50 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="group-hover:text-white transition-colors">Recordarme</span>
              </label>
              <button type="button" className="text-blue-200 hover:text-white transition-colors font-medium">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-blue-300/60 text-xs mt-6">
            Acceso interno • Sistema seguro
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 8s linear infinite;
        }
      `}</style>
    </div>
  );
}