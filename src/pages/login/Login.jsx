import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    console.log({ email, password });
    // Aquí irían las validaciones y llamada al backend
  };

  return (
    <div className="login-root">
      {/* Card */}
      <div className="login-card glass-card">
        <div className="logo-box">
          <div className="logo-bg"></div>
          <div className="logo">
            <svg viewBox="0 0 24 24">
              <path d="M12 2l2 2.5 3.2-.2 1.1 3 3 1.1-.2 3.2L22 12l-2.5 2 .2 3.2-3 1.1-1.1 3-3.2-.2L12 22l-2-2.5-3.2.2-1.1-3-3-1.1.2-3.2L2 12l2.5-2-.2-3.2 3-1.1 1.1-3 3.2.2L12 2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>

        <h2 className="brand">MODEPSA</h2>
        <h1 className="title">Login</h1>

        <div>
          <label>Usuario</label>
          <div className="input-box">
            <input
              type="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label>Contraseña</label>
          <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="login-btn" onClick={handleSubmit}>
            Ingresar
          </button>
        </div>

        <p className="footer">Acceso interno</p>
      </div>
    </div>
  );
}