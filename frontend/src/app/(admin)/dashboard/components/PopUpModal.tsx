import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";

const PopUpModal = ({
    title,
    message,
    actions,
    icon,
}: {
    title: string;
    message: string;
    actions: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {icon && <div className="flex justify-center mb-4 text-4xl">{icon}</div>}
            <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
            <p className="text-sm text-gray-700 mb-4 text-center">{message}</p>
            <div className="flex justify-end gap-2">
                {actions}
            </div>
        </div>
    </div>
);

export default PopUpModal;