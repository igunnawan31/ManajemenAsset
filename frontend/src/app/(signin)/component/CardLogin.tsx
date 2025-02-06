import Image from "next/image";

const CardLogin = () => {
    return (
        <div className="w-full md:w-[500px] bg-white shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-4">
                <Image 
                    src="/image002.png"
                    width={120} 
                    height={40} 
                    alt="Astra International"
                />
                <span className="text-xl font-semibold text-[#202B51] font-sans">Welcome to Login Page</span>
            </div>

            <div className="w-full mt-6">
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text"
                    placeholder="Enter your username"
                    className="mt-2 w-full h-12 px-4 border-b-[#202B51] border-b-2 bg-[#F5F9FF] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1C2C5B]"
                />
            </div>
            
            <div className="flex justify-between">
                <div className="flex items-center mt-6 space-x-4">
                    <Image 
                        src="/image000.png"
                        width={50} 
                        height={50} 
                        alt="Undip Logo"
                    />
                    <Image 
                        src="/image001.png"
                        width={50} 
                        height={50} 
                        alt="Agit Logo"
                    />
                </div>
                <div className="flex justify-end mt-6">
                <button 
                    className="bg-[#1C2C5B] text-white px-6 py-3 rounded-lg text-sm  hover:bg-[#152142] transition"
                >
                    Sign In
                </button>
            </div>
            </div>

            <div className="mt-6 relative top-[1.6rem] right-[1.6rem]">
                <Image 
                    src="/style1.png"
                    width={500}
                    height={80}
                    alt="Decorative Wave"
                />
            </div>
        </div>
    );
}

export default CardLogin;
