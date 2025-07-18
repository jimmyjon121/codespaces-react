import React from 'react';
import { X } from 'lucide-react';

export const MobileMenu = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 md:hidden">
			<div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
			<div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-xl shadow-2xl max-h-[80vh] overflow-y-auto">
				<div className="sticky top-0 flex items-center justify-between p-4 border-b dark:border-slate-700 bg-white dark:bg-slate-800">
					<h3 className="font-semibold text-slate-900 dark:text-white">Menu</h3>
					<button 
						onClick={onClose}
						className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<div className="p-4">
					{children}
				</div>
			</div>
		</div>
	);
};
