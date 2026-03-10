import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import LD_Dashboard from "./pages/leader/Dashboard";
import CM_Dashboard from "./pages/custom/Dashboard";
import Mapa from "./pages/Mapa";
import Areas from "./pages/Areas";
import { isAuthed } from "./auth";
import { pageVariants, pageTransition } from "./animations/pageTransitions";
import DashboardLayout from "./layouts/DashboardLayout";
import L_DashboardLayout from "./layouts/DashboardLayoutLeader";
import C_DashboardLayout from "./layouts/DashboardLayoutCustom";
import Puestos from "./pages/Puestos";
import MisReservas from "./pages/MisReservas";
import ListaReservas from "./pages/admin/ListaReservas";
import ReasignacionesConstruccion from "./pages/admin/ReasignacionesConstruccion";

const roleHomeMap = {
  admin: "/dashboard",
  jefe: "/l_dashboard",
  empleado: "/c_dashboard",
};

function getUserRole() {
  return localStorage.getItem("userRole") || "empleado";
}

function getRoleHome(role = getUserRole()) {
  return roleHomeMap[role] || roleHomeMap.empleado;
}

function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function RequireRole({ allowedRoles, children }) {
  if (!isAuthed()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  return allowedRoles.includes(userRole)
    ? children
    : <Navigate to={getRoleHome(userRole)} replace />;
}

function RoleHomeRedirect() {
  if (!isAuthed()) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleHome()} replace />;
}

function RoleBasedLayout({ children }) {
  const userRole = getUserRole();

  if (userRole === "admin") {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  if (userRole === "jefe") {
    return <L_DashboardLayout>{children}</L_DashboardLayout>;
  }

  return <C_DashboardLayout>{children}</C_DashboardLayout>;
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <Login />
            </AnimatedPage>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </RequireRole>
          }
        />

        <Route
          path="/l_dashboard"
          element={
            <RequireRole allowedRoles={["jefe"]}>
              <L_DashboardLayout>
                <LD_Dashboard />
              </L_DashboardLayout>
            </RequireRole>
          }
        />

        <Route
          path="/c_dashboard"
          element={
            <RequireRole allowedRoles={["empleado"]}>
              <C_DashboardLayout>
                <CM_Dashboard />
              </C_DashboardLayout>
            </RequireRole>
          }
        />

        <Route
          path="/admin/mapa"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <DashboardLayout>
                <Mapa />
              </DashboardLayout>
            </RequireRole>
          }
        />

        <Route
          path="/mapa"
          element={
            <PrivateRoute>
              <RoleBasedLayout>
                <Mapa />
              </RoleBasedLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/areas"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <AnimatedPage>
                <Areas />
              </AnimatedPage>
            </RequireRole>
          }
        />

        <Route
          path="/puestos"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <AnimatedPage>
                <Puestos />
              </AnimatedPage>
            </RequireRole>
          }
        />

        <Route
          path="/admin/mis-reservas"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <DashboardLayout>
                <MisReservas />
              </DashboardLayout>
            </RequireRole>
          }
        />

        <Route
          path="/mis-reservas"
          element={
            <PrivateRoute>
              <RoleBasedLayout>
                <MisReservas />
              </RoleBasedLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/asignaciones"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <DashboardLayout>
                <ReasignacionesConstruccion />
              </DashboardLayout>
            </RequireRole>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <RequireRole allowedRoles={["admin"]}>
              <DashboardLayout>
                <ListaReservas />
              </DashboardLayout>
            </RequireRole>
          }
        />

        <Route path="/" element={<RoleHomeRedirect />} />
        <Route path="*" element={<RoleHomeRedirect />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
