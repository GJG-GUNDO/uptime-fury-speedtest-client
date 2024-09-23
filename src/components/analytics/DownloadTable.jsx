import { motion } from "framer-motion";
import { useState } from "react";
import { FaDownload, FaUpload, FaSignal, FaBolt, FaWifi, FaDesktop, FaMicrochip, FaGamepad, FaTv, FaHeadphones } from 'react-icons/fa'; // Import icons from react-icons

const DownloadTable = ({ data, average, max, min, dataSize, title }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>
        {title}
      </h2>

      <div className='overflow-x-auto mt-4'>
        <table className='min-w-full divide-y divide-gray-700'>
          <tbody className='divide-y divide-gray-700'>
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className='cursor-pointer'
              onClick={toggleDetails}
            >
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex items-center'>
                <span className={`transform ${showDetails ? "rotate-90" : ""}`}>
                  ➔
                </span>
                <span className='ml-2'>Show Detailed Results</span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'></td>
            </motion.tr>
            {showDetails && (
              <>
                <motion.tr>
                  <td colSpan={2} className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                    <table className='min-w-full divide-y divide-gray-700 mt-2'>
                      <thead>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Test Number
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Speed (Mbps)
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-700'>
                        {data.map((test) => (
                          <motion.tr
                            key={test.testNumber}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                              {test.testNumber}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                              {test.speed}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </motion.tr>
              </>
            )}
            {/* Display Average, Max, Min */}
            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                Average:
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                {average} Mbps
              </td>
            </motion.tr>
            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                Max:
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                {max} Mbps
              </td>
            </motion.tr>
            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                Min:
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                {min} Mbps
              </td>
            </motion.tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DownloadTable;
