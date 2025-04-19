import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // importa o hook aqui também
import Login from "./pages/Login";
import AdminLayout from "./AdminLayout";
import DashboardAdmin from "./pages/DashboardAdmin";
import Usuarios from "./pages/Usuarios";
import Modalidades from "./pages/Modalidades";
import Escalões from "./pages/Equipas";
import Treinadores from "./pages/Treinadores";
import PrivateRoute from "./routes/PrivateRoute";
import AtletaBasquetebol from "./pages/AtletaBasquetebol";
import AtletaHoqueiJogador from "./pages/AtletaHoqueiJogador";
import AtletaHoqueiGR from "./pages/AtletaHoqueiGR";
import TreinadorHoquei from "./pages/TreinadorHoquei";
import TreinadorBasquetebol from "./pages/TreinadorBasquetebol";
import Analistas from "./pages/Analistas";
import Coordenadores from "./pages/Coordenadores";
import Fisioterapia from "./pages/Fisioterapia";
import AnalistasADMIN from "./pages/AnalistasADMIN";
import Competicoes from "./pages/Competicoes";
import Preparadores from "./pages/Preparadores";

function RotasProtegidas() {
  const { loading } = useAuth();

  if (loading) return null; // ou <Spinner /> se quiseres mostrar algo

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["Administrador"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="modalidades" element={<Modalidades />} />
        <Route path="escaloes" element={<Escalões />} />
        <Route path="treinadores" element={<Treinadores />} />
        <Route path="coordenadores" element={<Coordenadores />} />
        <Route path="fisioterapia" element={<Fisioterapia />} />
        <Route path="analistas" element={<AnalistasADMIN />} />
        <Route path="competicoes" element={<Competicoes />} />
      </Route>

      <Route
        path="/atleta/basquetebol"
        element={
          <PrivateRoute allowedRoles={["Atleta Basquetebol"]}>
            <AtletaBasquetebol />
          </PrivateRoute>
        }
      />

      <Route path="/atleta/hoquei/jogador" element={<AtletaHoqueiJogador />} />
      <Route path="/atleta/hoquei/guarda-redes" element={<AtletaHoqueiGR />} />

      <Route
  path="/treinador/hoquei-em-patins"
  element={
    <PrivateRoute allowedRoles={["Treinador Hóquei em Patins"]}> {/* ✅ Agora está certo */}
      <TreinadorHoquei />
    </PrivateRoute>
  }
/>
      <Route
        path="/treinador/basquetebol"
        element={
          <PrivateRoute allowedRoles={["Treinador Basquetebol"]}>
            <TreinadorBasquetebol />
          </PrivateRoute>
        }
      />

      <Route
        path="/analistas"
        element={
          <PrivateRoute allowedRoles={["Analista"]}>
            <Analistas />
          </PrivateRoute>
        }
      />

<Route
  path="/fisioterapia"
  element={
    <PrivateRoute allowedRoles={["Fisioterapeuta"]}>
      <Fisioterapia />
    </PrivateRoute>
  }
/>

<Route
  path="/preparador-fisico"
  element={
    <PrivateRoute allowedRoles={["Preparador Físico"]}>
      <Preparadores />
    </PrivateRoute>
  }
/>

<Route
  path="/coordenadores"
  element={
    <PrivateRoute allowedRoles={["Coordenador Hóquei"]}>
      <Coordenadores />
    </PrivateRoute>
  }
/>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <RotasProtegidas />
    </AuthProvider>
  );
}

export default App;
