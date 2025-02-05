import Image from "next/image";

const Footer = () => {
    return (
        <div className="absolute bottom-0 w-full bg-gray-400 z-20 p-2 border-t-[#202B51] border-t-2">
            <div className="flex justify-center items-center">
                <Image
                    src="/image002.png"  
                    width={52}
                    height={52} 
                    alt="Logo"
                    className="mx-2"
                />
                <Image
                    src="/image001.png"  
                    width={52}
                    height={52} 
                    alt="Logo"
                    className="mx-2"
                />
                <Image
                    src="/image000.png"  
                    width={52}
                    height={52} 
                    alt="Logo"
                />
            </div>
        </div>
    )
}

export default Footer;