import { motion } from "framer-motion";

export function MetricCard({ title, value, icon, iconBg, iconColor, children }) {
  return (
    <motion.div
      className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`rounded-full p-3 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      {children && (
        <div className="mt-3 text-xs text-gray-500">
          {children}
        </div>
      )}
    </motion.div>
  );
}
