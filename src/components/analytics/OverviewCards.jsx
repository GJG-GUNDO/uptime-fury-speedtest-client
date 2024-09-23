import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { FaDownload, FaUpload, FaSignal, FaBolt, FaWifi, FaDesktop, FaMicrochip, FaGamepad, FaTv, FaHeadphones } from 'react-icons/fa'; // Import icons from react-icons


const OverviewCards = ({ speedTestData }) => {
	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
			{speedTestData.map((item, index) => (
				<motion.div
					key={item.name}
					className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<div className='flex items-center'>
						<div className={`p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}`}>
							<item.icon className={`size-6 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`} />
						</div>
						<div className='ml-4'> {/* Add margin-left for spacing */}
							<h3 className='text-sm font-medium text-gray-400'>{item.name}</h3>
							<p className='mt-1 text-xl font-semibold text-gray-100'>{item.value}</p>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default OverviewCards;
