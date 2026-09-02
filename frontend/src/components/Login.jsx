// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@hotel.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, getDefaultRoute } = useAuth();
  const navigate = useNavigate();

  // Estado para registro
  const [registerData, setRegisterData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: 'CLIENTE'
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      const userRole = JSON.parse(localStorage.getItem('user'))?.rol || 'CLIENTE';
      navigate(getDefaultRoute(userRole));
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register({
      nombres: registerData.nombres,
      apellidos: registerData.apellidos,
      tipoDocumento: registerData.tipoDocumento,
      numeroDocumento: registerData.numeroDocumento,
      email: registerData.email,
      telefono: registerData.telefono,
      password: registerData.password,
      rol: registerData.rol
    });

    if (result.success) {
      setSuccess('✅ Registro exitoso. Ahora inicia sesión.');
      setSuccess('✅ Usuario registrado correctamente. Ahora inicia sesión.');
      setTimeout(() => {
        setIsLogin(true);
        setEmail(registerData.email);
        setPassword(registerData.password);
      }, 1500);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏨 Sistema de Reservas</h2>
        <p style={styles.subtitle}>{isLogin ? 'Iniciar Sesión' : 'Registrar Usuario'}</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {isLogin ? (
          // ========== FORMULARIO LOGIN ==========
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="email@hotel.com"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="********"
                required
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>

            <p style={styles.switchText}>
              ¿No tienes cuenta?{' '}
              <span style={styles.switchLink} onClick={() => setIsLogin(false)}>
                Regístrate aquí
              </span>
            </p>

            <div style={styles.credentials}>
              <p>📋 Credenciales de prueba:</p>
              <p><strong>Admin:</strong> admin@hotel.com / admin123</p>
              <p><strong>Gerente:</strong> gerente@hotel.com / gerente123</p>
              <p><strong>Cliente:</strong> cliente@hotel.com / cliente123</p>
            </div>
          </form>
        ) : (
          // ========== FORMULARIO REGISTRO ==========
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Nombres *</label>
                <input
                  type="text"
                  name="nombres"
                  value={registerData.nombres}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  placeholder="Juan"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Apellidos *</label>
                <input
                  type="text"
                  name="apellidos"
                  value={registerData.apellidos}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  placeholder="Perez"
                  required
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Tipo Documento *</label>
                <select
                  name="tipoDocumento"
                  value={registerData.tipoDocumento}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  required
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Número Documento *</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={registerData.numeroDocumento}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  placeholder="12345678"
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                style={styles.input}
                placeholder="cliente@hotel.com"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={registerData.telefono}
                onChange={handleRegisterChange}
                style={styles.input}
                placeholder="999999999"
              />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  placeholder="********"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  style={styles.input}
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Rol</label>
              <select
                name="rol"
                value={registerData.rol}
                onChange={handleRegisterChange}
                style={styles.input}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="RECEPCIONISTA">Recepcionista</option>
                <option value="GERENTE">Gerente</option>
              </select>
              <span style={styles.helpText}>Solo administradores pueden asignar roles.</span>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <p style={styles.switchText}>
              ¿Ya tienes cuenta?{' '}
              <span style={styles.switchLink} onClick={() => setIsLogin(true)}>
                Inicia sesión aquí
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '480px',
    maxWidth: '100%',
  },
  title: {
    textAlign: 'center',
    color: '#1a365d',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4a5568',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  switchText: {
    textAlign: 'center',
    color: '#4a5568',
    fontSize: '14px',
    marginTop: '12px',
  },
  switchLink: {
    color: '#4299e1',
    fontWeight: '600',
    cursor: 'pointer',
  },
  credentials: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#4a5568',
  },
  helpText: {
    fontSize: '11px',
    color: '#718096',
    marginTop: '2px',
  },
};

export default Login;