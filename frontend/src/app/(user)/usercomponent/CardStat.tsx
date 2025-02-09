const CardStat = () => {
    return (
        <div className="absolute top-[100%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl md:max-w-5xl lg:max-w-7xl bg-white shadow-lg rounded-xl p-6 flex justify-between items-center z-5">
            <div className="text-center px-5 hover:scale-110 transition duration-300 ease-in-out hover:bg-gray-100 py-5 rounded-lg lg:ml-10">
                <h2 className="text-4xl font-bold text-gray-800">76</h2>
                <p className="text-gray-600">Asset Inbound</p>
            </div>
            <div className="text-center px-5 hover:scale-110 transition duration-300 ease-in-out hover:bg-gray-100 py-5 rounded-lg">
                <h2 className="text-4xl font-bold text-gray-800">76</h2>
                <p className="text-gray-600">Asset Inbound</p>
            </div>
            <div className="text-center px-5 hover:scale-110 transition duration-300 ease-in-out hover:bg-gray-100 py-5 rounded-lg lg:mr-10 ">
                <h2 className="text-4xl font-bold text-gray-800">76</h2>
                <p className="text-gray-600">Asset Inbound</p>
            </div>
        </div>
    );
}

export default CardStat;
