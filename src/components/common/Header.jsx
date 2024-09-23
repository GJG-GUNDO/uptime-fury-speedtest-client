import companyLogo from './logo.png'; // Adjust the path as necessary

const Header = ({ title }) => {
	return (
		<header className='bg-[#121212] bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
			<div className='flex items-center justify-between max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center'>
					<img src={companyLogo} alt="Company Logo" className='h-14 mr-4' /> {/* Adjust size as needed */}
					<h1 className='lg:text-2xl  sm:text-xl font-semibold text-gray-100'>{title}</h1>
				</div>
				<a href="/" className='lg:text-lg sm:text-md font-medium text-gray-100 hover:text-white'>
					Home
				</a>
			</div>
		</header>
	);
};

export default Header;
