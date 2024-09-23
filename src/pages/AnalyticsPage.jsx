import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import DownloadTable from '../components/analytics/DownloadTable';
import { FaDownload, FaUpload, FaSignal, FaBolt, FaWifi, FaDesktop, FaMicrochip, FaGamepad, FaTv, FaHeadphones } from 'react-icons/fa'; // Import icons from react-icons
import SpeedTest from '@cloudflare/speedtest';
import PulseBeams from "../components/analytics/PulseBeams";
import Footer from "../components/common/Footer";


// Custom function to format numbers without using toFixed()
const formatNumber = (num, decimals) => {
	if (num == null || isNaN(num)) return "0";
	return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

const bpsToMbps = (bps) => formatNumber(bps / 1e6, 2);

const calculateAverage = (results) => {
	if (!results || results.length === 0) return 0;
	const sum = results.reduce((acc, point) => acc + point.bps, 0);
	return sum / results.length / 1e6; // Convert to Mbps
};


const AnalyticsPage = () => {
	const [testStarted, setTestStarted] = useState(false);
	const [showRabbit, setShowRabbit] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [showSpeedData, setShowSpeedData] = useState(false);
	const [dots, setDots] = useState("");



	const [results, setResults] = useState({
		download: [],
		upload: [],
		unloadedLatency: null,
		unloadedJitter: null,
		unloadedLatencyPoints: [],
		unloadedJitterPoints: [],
		downloadedLatency: null,
		downloadedJitter: null,
		downloadedLatencyPoints: [],
		downloadedJitterPoints: [],
		uploadedLatency: null,
		uploadedJitter: null,
		uploadedLatencyPoints: [],
		uploadedJitterPoints: [],
		packetLoss: null,
		packetLossDetails: null,
		scores: null,
	});
	const [isRunning, setIsRunning] = useState(false);
	const [error, setError] = useState(null);




	const startTest = () => {
		setIsRunning(true);
		setError(null);
		setTestStarted(true);
		setShowRabbit(true);

		// setTimeout(() => {
		// 	setShowRabbit(false);
		// 	setShowResults(true);
		// }, 10000);
		const speedtest = new SpeedTest({
			autoStart: true,
			measurements: [
				{ type: 'latency', numPackets: 10 },
				{ type: 'download', bytes: 1e5, count: 10 }, // 100 KB
				{ type: 'download', bytes: 1e6, count: 10 }, // 1 MB
				{ type: 'download', bytes: 1e7, count: 10 }, // 10 MB
				{ type: 'download', bytes: 2.5e7, count: 10 }, // 25 MB
				{ type: 'download', bytes: 1e8, count: 10 }, // 100 MB
				{ type: 'upload', bytes: 1e5, count: 10 },   // 100 KB
				{ type: 'upload', bytes: 1e6, count: 10 },   // 1 MB
				{ type: 'upload', bytes: 1e7, count: 10 },   // 10 MB
				{ type: 'upload', bytes: 2.5e7, count: 10 }, // 25 MB
				{ type: 'upload', bytes: 5e7, count: 10 },   // 50 MB
			],
		});

		speedtest.onFinish = (results) => {
			console.log('SpeedTest results:', results); // Log results for debugging

			const downloadPoints = results.getDownloadBandwidthPoints();
			const uploadPoints = results.getUploadBandwidthPoints();
			const unloadedLatency = results.getUnloadedLatency();
			const unloadedJitter = results.getUnloadedJitter();
			const unloadedLatencyPoints = results.getUnloadedLatencyPoints ? results.getUnloadedLatencyPoints() : [];
			const unloadedJitterPoints = results.getUnloadedJitterPoints ? results.getUnloadedJitterPoints() : [];
			const downloadedLatency = results.getDownLoadedLatency();
			const downloadedJitter = results.getDownLoadedJitter();
			const downloadedLatencyPoints = results.getDownloadedLatencyPoints ? results.getDownloadedLatencyPoints() : [];
			const downloadedJitterPoints = results.getDownloadedJitterPoints ? results.getDownloadedJitterPoints() : [];
			const uploadedLatency = results.getUpLoadedLatency();
			const uploadedJitter = results.getUpLoadedJitter();
			const uploadedLatencyPoints = results.getUpLoadedLatencyPoints ? results.getUpLoadedLatencyPoints() : [];
			const uploadedJitterPoints = results.getUpLoadedJitterPoints ? results.getUpLoadedJitterPoints() : [];
			const packetLoss = results.getPacketLoss ? results.getPacketLoss() : 'No data'; // Get packet loss ratio
			const packetLossDetails = results.getPacketLossDetails ? results.getPacketLossDetails() : 'No details available'; // Get packet loss details
			const scores = results.getScores();

			// console.log('Packet Loss:', results.getPacketLoss);
			// console.log('Packet Loss Details:', results.getPacketLossDetails);

			setShowRabbit(false);
			setShowResults(true);
			setShowSpeedData(true);
			setDots(""); // Reset dots when stopping

			setResults({
				download: downloadPoints,
				upload: uploadPoints,
				unloadedLatency,
				unloadedJitter,
				unloadedLatencyPoints,
				unloadedJitterPoints,
				downloadedLatency,
				downloadedJitter,
				downloadedLatencyPoints,
				downloadedJitterPoints,
				uploadedLatency,
				uploadedJitter,
				uploadedLatencyPoints,
				uploadedJitterPoints,
				packetLoss,
				packetLossDetails,
				scores,
			});
			setIsRunning(false);
		};

		speedtest.onError = (err) => {
			console.error("Cloudflare SpeedTest error:", err);
			setError(`Cloudflare SpeedTest error: ${err.message}`);
			setIsRunning(false);
		};

		speedtest.play();
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (isRunning) {
				console.log('Test timed out');
				setError('Test timed out. Please try again.');
				setIsRunning(false);
			}
		}, 300000); // Increased timeout to 300 seconds

		return () => clearTimeout(timeout);
	}, [isRunning]);

	const testResults = (type, size) => {
		const points = results[type].filter((p) => p.bytes === size);
		// console.log(`${type} ${size} results:`, points); // Log test results for debugging
		const average = calculateAverage(points);
		return {
			count: points.length,
			average: formatNumber(average, 2),
			max: points.length ? bpsToMbps(Math.max(...points.map((p) => p.bps))) : 'No data',
			min: points.length ? bpsToMbps(Math.min(...points.map((p) => p.bps))) : 'No data',
		};
	};

	const formatTableRows = (points) => {
		if (!points || points.length === 0) return <tr><td colSpan="4">No data available</td></tr>;

		return points.map((point, index) => (
			<tr key={index}>
				<td>{index + 1}</td>
				<td>{bpsToMbps(point.bps)}</td>
			</tr>
		));
	};

	const renderMetrics = (type, sizes) => {
		return sizes.map((size) => {
			const { count, average, max, min } = testResults(type, size);
			const points = results[type].filter((p) => p.bytes === size);

			// Prepare data in the specified format
			const formattedData = points.map((point, index) => ({
				testNumber: index + 1, // Customize test number if needed
				speed: bpsToMbps(point.bps),
			}));

			// Create an object to hold the data and metrics
			return {
				data: formattedData,
				average: average,
				max: max,
				min: min,
				dataSize: sizeToLabel(size), // Include size label for table rendering
				title: `${sizeToLabel(size)} Test Results`,
				count: count > 0 ? count : 'No tests performed', // Add count message
			};
		});
	};



	const sizeToLabel = (size) => {
		switch (size) {
			case 1e5:
				return '100kB';
			case 1e6:
				return '1MB';
			case 1e7:
				return '10MB';
			case 2.5e7:
				return '25MB';
			case 1e8:
				return '100MB';
			case 5e7:
				return '50MB';
			default:
				return '';
		}
	};



	const speedTestData = [
		{
			name: "Overall Download Speed",
			value: `${formatNumber(calculateAverage(results.download), 2)} Mbps`,
			change: 10.5,
			icon: FaDownload // Icon from react-icons
		},
		{
			name: "Overall Upload Speed",
			value: `${formatNumber(calculateAverage(results.upload), 2)} Mbps`,
			change: 10.5,
			icon: FaUpload
		},
		{
			name: "Unloaded Latency",
			value: `${results.unloadedLatency ? results.unloadedLatency.toFixed(2) : 'N/A'} ms`,
			change: 5.0,
			icon: FaSignal
		},
		{
			name: "Unloaded Jitter",
			value: `${results.unloadedJitter ? results.unloadedJitter.toFixed(2) : 'N/A'} ms`,
			change: 0.0,
			icon: FaBolt
		},
		{
			name: "Download Latency",
			value: `${results.downloadedLatency ? results.downloadedLatency.toFixed(2) : 'N/A'} ms`,
			change: 0.0,
			icon: FaWifi
		},
		{
			name: "Download Jitter",
			value: `${results.downloadedJitter ? results.downloadedJitter.toFixed(2) : 'N/A'} ms`,
			change: 0.0,
			icon: FaMicrochip
		},
		{
			name: "Upload Latency",
			value: `${results.uploadedLatency ? results.uploadedLatency.toFixed(2) : 'N/A'} ms`,
			change: 0.0,
			icon: FaDesktop
		},
		{
			name: "Upload Jitter",
			value: `${results.uploadedJitter ? results.uploadedJitter.toFixed(2) : 'N/A'} ms`,
			change: 0.0,
			icon: FaMicrochip
		},
		...(results.scores ? [
			{
				name: "Gaming Classification",
				value: `${results.scores.gaming.classificationName} (points: ${results.scores.gaming.points})`,
				change: 0.0,
				icon: FaGamepad
			},
			{
				name: "Streaming Classification",
				value: `${results.scores.streaming.classificationName} (points: ${results.scores.streaming.points})`,
				change: 0.0,
				icon: FaTv
			},
			{
				name: "RTC Classification",
				value: `${results.scores.rtc.classificationName} (points: ${results.scores.rtc.points})`,
				change: 0.0,
				icon: FaHeadphones
			},
		] : []),
	];




	const DownloadmetricsData = renderMetrics('download', [1e5, 1e6, 1e7, 2.5e7, 1e8]);
	const UploadmetricsData = renderMetrics('upload', [1e5, 1e6, 1e7, 2.5e7, 5e7]);

	// console.log('Metrics Data:', metricsData);


	useEffect(() => {
		if (showRabbit) {
			const timer = setTimeout(() => {
				// You can manually stop the animation if needed
				// setShowRabbit(false);
				// setShowSpeedData(true);
			}, 7000); // Adjust time as needed

			return () => clearTimeout(timer);
		}
	}, [showRabbit]);

	useEffect(() => {
		let dotTimer;
		if (showRabbit) {
			dotTimer = setInterval(() => {
				setDots((prev) => (prev.length < 3 ? prev + "." : ""));
			}, 500);
		}

		return () => clearInterval(dotTimer);
	}, [showRabbit]);

	// const stopTest = () => {
	// 	setShowRabbit(false);
	// 	setShowSpeedData(true);
	// 	setDots(""); // Reset dots when stopping
	// };

	const startSpeedTest = () => {
		setShowRabbit(true);
		setShowSpeedData(false);
		setDots(""); // Reset dots on each start
	};

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-[#121212]'>
			<Header title={"UptimeFury Speed Test"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* Show Start button if the test hasn't started */}
				{!testStarted && (
					<PulseBeams startTest={startTest} />
				)}

				{/* Show the rabbit animation */}
				{showRabbit && (
					<div className="flex flex-col min-h-96 justify-center items-center h-96">
						<div className="relative w-full h-10 mb-5">
							{/* Line for the rabbit to walk on */}
							<div className="absolute top-40 w-full h-1 bg-gray-300"></div>
							<div className="absolute w-full flex justify-center">

								{/* Rabbit SVG */}
								<svg
									className="absolute w-24 h-96 animate-rabbit" // Increased size for visibility
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 110 120 120" // Adjusted viewBox for better visibility
									fill="none"
									stroke="currentColor"
								>
									<title>bunny-rabbit</title><path d="M66,38.09q.06.9.18,1.71v.05c1,7.08,4.63,11.39,9.59,13.81,5.18,2.53,11.83,3.09,18.48,2.61,1.49-.11,3-.27,4.39-.47l1.59-.2c4.78-.61,11.47-1.48,13.35-5.06,1.16-2.2,1-5,0-8a38.85,38.85,0,0,0-6.89-11.73A32.24,32.24,0,0,0,95,21.46,21.2,21.2,0,0,0,82.3,20a23.53,23.53,0,0,0-12.75,7,15.66,15.66,0,0,0-2.35,3.46h0a20.83,20.83,0,0,0-1,2.83l-.06.2,0,.12A12,12,0,0,0,66,37.9l0,.19Zm26.9-3.63a5.51,5.51,0,0,1,2.53-4.39,14.19,14.19,0,0,0-5.77-.59h-.16l.06.51a5.57,5.57,0,0,0,2.89,4.22,4.92,4.92,0,0,0,.45.24ZM88.62,28l.94-.09a13.8,13.8,0,0,1,8,1.43,7.88,7.88,0,0,1,3.92,6.19l0,.43a.78.78,0,0,1-.66.84A19.23,19.23,0,0,1,98,37a12.92,12.92,0,0,1-6.31-1.44A7.08,7.08,0,0,1,88,30.23a10.85,10.85,0,0,1-.1-1.44.8.8,0,0,1,.69-.78ZM14.15,10c-.06-5.86,3.44-8.49,8-9.49C26.26-.44,31.24.16,34.73.7A111.14,111.14,0,0,1,56.55,6.4a130.26,130.26,0,0,1,22,10.8,26.25,26.25,0,0,1,3-.78,24.72,24.72,0,0,1,14.83,1.69,36,36,0,0,1,13.09,10.42,42.42,42.42,0,0,1,7.54,12.92c1.25,3.81,1.45,7.6-.23,10.79-2.77,5.25-10.56,6.27-16.12,7l-1.23.16a54.53,54.53,0,0,1-2.81,12.06A108.62,108.62,0,0,1,91.3,84v25.29a9.67,9.67,0,0,1,9.25,10.49c0,.41,0,.81,0,1.18a1.84,1.84,0,0,1-1.84,1.81H86.12a8.8,8.8,0,0,1-5.1-1.56,10.82,10.82,0,0,1-3.35-4,2.13,2.13,0,0,1-.2-.46L73.53,103q-2.73,2.13-5.76,4.16c-1.2.8-2.43,1.59-3.69,2.35l.6.16a8.28,8.28,0,0,1,5.07,4,15.38,15.38,0,0,1,1.71,7.11V121a1.83,1.83,0,0,1-1.83,1.83h-53c-2.58.09-4.47-.52-5.75-1.73A6.49,6.49,0,0,1,9.11,116v-11.2a42.61,42.61,0,0,1-6.34-11A38.79,38.79,0,0,1,1.11,70.29,37,37,0,0,1,13.6,50.54l.1-.09a41.08,41.08,0,0,1,11-6.38c7.39-2.9,17.93-2.77,26-2.68,5.21.06,9.34.11,10.19-.49a4.8,4.8,0,0,0,1-.91,5.11,5.11,0,0,0,.56-.84c0-.26,0-.52-.07-.78a16,16,0,0,1-.06-4.2,98.51,98.51,0,0,0-18.76-3.68c-7.48-.83-15.44-1.19-23.47-1.41l-1.35,0c-2.59,0-4.86,0-7.46-1.67A9,9,0,0,1,8,23.68a9.67,9.67,0,0,1-.91-5A10.91,10.91,0,0,1,8.49,14a8.74,8.74,0,0,1,3.37-3.29A8.2,8.2,0,0,1,14.15,10ZM69.14,22a54.75,54.75,0,0,1,4.94-3.24,124.88,124.88,0,0,0-18.8-9A106.89,106.89,0,0,0,34.17,4.31C31,3.81,26.44,3.25,22.89,4c-2.55.56-4.59,1.92-5,4.79a134.49,134.49,0,0,1,26.3,3.8,115.69,115.69,0,0,1,25,9.4ZM64,28.65c.21-.44.42-.86.66-1.28a15.26,15.26,0,0,1,1.73-2.47,146.24,146.24,0,0,0-14.92-6.2,97.69,97.69,0,0,0-15.34-4A123.57,123.57,0,0,0,21.07,13.2c-3.39-.08-6.3.08-7.47.72a5.21,5.21,0,0,0-2,1.94,7.3,7.3,0,0,0-1,3.12,6.1,6.1,0,0,0,.55,3.11,5.43,5.43,0,0,0,2,2.21c1.73,1.09,3.5,1.1,5.51,1.12h1.43c8.16.23,16.23.59,23.78,1.42a103.41,103.41,0,0,1,19.22,3.76,17.84,17.84,0,0,1,.85-2Zm-.76,15.06-.21.16c-1.82,1.3-6.48,1.24-12.35,1.17C42.91,45,32.79,44.83,26,47.47a37.41,37.41,0,0,0-10,5.81l-.1.08A33.44,33.44,0,0,0,4.66,71.17a35.14,35.14,0,0,0,1.5,21.32A39.47,39.47,0,0,0,12.35,103a1.82,1.82,0,0,1,.42,1.16v12a3.05,3.05,0,0,0,.68,2.37,4.28,4.28,0,0,0,3.16.73H67.68a10,10,0,0,0-1.11-3.69,4.7,4.7,0,0,0-2.87-2.32,15.08,15.08,0,0,0-4.4-.38h-26a1.83,1.83,0,0,1-.15-3.65c5.73-.72,10.35-2.74,13.57-6.25,3.06-3.34,4.91-8.1,5.33-14.45v-.13A18.88,18.88,0,0,0,46.35,75a20.22,20.22,0,0,0-7.41-4.42,23.54,23.54,0,0,0-8.52-1.25c-4.7.19-9.11,1.83-12,4.83a1.83,1.83,0,0,1-2.65-2.52c3.53-3.71,8.86-5.73,14.47-6a27.05,27.05,0,0,1,9.85,1.44,24,24,0,0,1,8.74,5.23,22.48,22.48,0,0,1,6.85,15.82v.08a2.17,2.17,0,0,1,0,.36c-.47,7.25-2.66,12.77-6.3,16.75a21.24,21.24,0,0,1-4.62,3.77H57.35q4.44-2.39,8.39-5c2.68-1.79,5.22-3.69,7.63-5.67a1.82,1.82,0,0,1,2.57.24,1.69,1.69,0,0,1,.35.66L81,115.62a7,7,0,0,0,2.16,2.62,5.06,5.06,0,0,0,3,.9H96.88a6.56,6.56,0,0,0-1.68-4.38,7.19,7.19,0,0,0-4.74-1.83c-.36,0-.69,0-1,0a1.83,1.83,0,0,1-1.83-1.83V83.6a1.75,1.75,0,0,1,.23-.88,105.11,105.11,0,0,0,5.34-12.46,52,52,0,0,0,2.55-10.44l-1.23.1c-7.23.52-14.52-.12-20.34-3A20,20,0,0,1,63.26,43.71Z" /></svg>
								{/* Add more rabbit shapes as needed */}

							</div>
						</div>

						{/* Animated text */}
						<p className="text-white pt-40 text-xl">Testing Internet Speeds{dots}</p>
					</div>
				)}


				{/* Show results after the animation */}
				{showResults && (
					<>
						<OverviewCards speedTestData={speedTestData} />
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>
							{DownloadmetricsData.map((metric, index) => (
								<section key={index}>
									<DownloadTable
										data={metric.data}
										average={metric.average}
										max={metric.max}
										min={metric.min}
										dataSize={metric.dataSize}
										title={metric.title}
									/>
								</section>
							))}
							{UploadmetricsData.map((metric, index) => (
								<section key={index}>
									<DownloadTable
										data={metric.data}
										average={metric.average}
										max={metric.max}
										min={metric.min}
										dataSize={metric.dataSize}
										title={metric.title}
									/>
								</section>
							))}
						</div>
						{/* <AIPoweredInsights /> */}
					</>
				)}
			</main>
			<style>
				{`
    @keyframes moveRabbit {
      0% {
        left: 0;
      }
      100% {
        left: 85%;
      }
    }

    .animate-rabbit {
      position: absolute;
      animation: moveRabbit 10s linear infinite; /* Change 'forwards' to 'infinite' */
    }
  `}
			</style>
			<Footer />
		</div>

	);

};

export default AnalyticsPage;

