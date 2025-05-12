
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface PopUpModalProps {
    title: string;
    message: string;
    icon: React.ReactNode;
    actions: React.ReactNode;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ title, message, icon, actions }) => {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-4xl">{icon}</div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <p className="text-center text-gray-600">{message}</p>
                        <div className="flex space-x-4">{actions}</div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PopUpModal;
