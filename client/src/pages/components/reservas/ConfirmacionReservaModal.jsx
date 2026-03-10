// client/src/pages/components/reservas/ConfirmacionReservaModal.jsx
import { motion } from "framer-motion";
import { formatearFechaDDMMAAAA } from "../../utils/dateUtils"; // ✅ Importar utilidad

export default function ConfirmacionReservaModal({
  pisoSeleccionado,
  fechaSeleccionada,
  puestoAsignado,
  onConfirmar,
  onVerMapa,
  onCancelar,
  feedback,
  isConfirmando,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={isConfirmando ? undefined : onCancelar}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Confirmar Reserva
                </h3>
                <p className="text-sm text-gray-600">
                  Revisa los detalles antes de confirmar
                </p>
              </div>
            </div>
            <button
              onClick={isConfirmando ? undefined : onCancelar}
              disabled={isConfirmando}
              className="w-10 h-10 rounded-full hover:bg-white/80 flex items-center justify-center transition text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Mensaje de resultado/progreso */}

          {feedback?.texto && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                feedback.tipo === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : feedback.tipo === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              {feedback.texto}
            </div>
          )}

          {/* Información del puesto */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">🪑</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Puesto Asignado</p>
                <p className="text-2xl font-bold text-blue-900">
                  #{puestoAsignado?.NoPuesto || "N/A"}
                </p>
              </div>
            </div>

            {puestoAsignado?.IDClasificacionPuesto && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>💻</span>
                <span>
                  Clasificación: {puestoAsignado.Clasificacion || "Estándar"}
                </span>
              </div>
            )}
          </div>

          {/* Detalles de la reserva */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📅</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Fecha</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatearFechaDDMMAAAA(fechaSeleccionada)}{" "}
                  {/* ✅ Usar formato DD/MM/AAAA */}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🏢</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Ubicación</p>
                <p className="text-base font-semibold text-gray-900">
                  Piso {pisoSeleccionado?.NumeroPiso} • Bodega{" "}
                  {pisoSeleccionado?.Bodega}
                </p>
              </div>
            </div>

            {puestoAsignado?.UbicacionX != null &&
              puestoAsignado?.UbicacionY != null && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📍</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Coordenadas
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        ({puestoAsignado.UbicacionX},{" "}
                        {puestoAsignado.UbicacionY})
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onVerMapa}
                    disabled={isConfirmando}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    🗺️ Ver Ubicación en el Mapa
                  </motion.button>
                </>
              )}
          </div>

          {/* Nota informativa */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Importante
                </p>
                <p className="text-xs text-yellow-700">
                  El puesto ha sido asignado automáticamente por el sistema
                  según disponibilidad. Podrás cancelar esta reserva desde "Mis
                  Reservas" si es necesario.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirmar}
            disabled={isConfirmando}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isConfirmando ? "⏳ Confirmando reserva..." : "✅ Confirmar Reserva"}
          </motion.button>
          <motion.button
            whileHover={{ scale: isConfirmando ? 1 : 1.02 }}
            whileTap={{ scale: isConfirmando ? 1 : 0.98 }}
            onClick={isConfirmando ? undefined : onCancelar}
            disabled={isConfirmando}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            ✕ Cancelar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
