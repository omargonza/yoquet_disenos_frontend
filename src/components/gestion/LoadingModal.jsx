import { motion } from "framer-motion";

export default function LoadingModal({ visible, progreso }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-xl w-80 text-center shadow-xl"
            >
                <h2 className="text-xl font-bold mb-3">Procesando</h2>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>

                <p className="mt-3">{progreso}%</p>
            </motion.div>
        </div>
    );
}
