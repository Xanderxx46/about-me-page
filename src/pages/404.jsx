import React from "react";
import { Link } from "react-router-dom";
import { Header } from "./About"; // Assuming Header is in a separate file

const NotFound = () => {
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />

			<main className="max-w-6xl mx-auto p-8">
				<section
					className="bg-gray-800 rounded-lg shadow-md p-12 mb-8 border border-purple-700/30 text-center flex flex-col items-center justify-center"
					style={{ minHeight: "60vh" }}
				>
					<h1 className="text-6xl font-bold text-purple-400 mb-4">404</h1>
					<h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
					<p className="text-gray-300 leading-relaxed mb-8 max-w-lg">
						Oops! The page you're looking for doesn't exist or has been moved to
						another URL.
					</p>
					<Link
						to="/"
						className="px-8 py-3 bg-purple-700 hover:bg-purple-600 transition-colors rounded-lg text-white font-medium"
					>
						Return Home
					</Link>
				</section>
			</main>

			<footer className="bg-gray-800 shadow-lg mt-8 border-t border-purple-700/30">
				<div className="max-w-6xl mx-auto p-8 text-center text-purple-300">
					© 2025 Xander Hogan. All rights reserved.
				</div>
			</footer>
		</div>
	);
};

export default NotFound;
