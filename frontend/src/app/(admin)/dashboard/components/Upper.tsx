import Path from "./Path";

const Upper = ({ title }: { title: string }) => {
    return (
        <div className="flex h-20 justify-between">
            <div className="w-1/2 font-sans text-[#171F39] font-bold text-xl">
                {title}
            </div>
            <div className="w-1/2 flex justify-end">
                <Path />
            </div>
        </div>
    );
};

export default Upper;
