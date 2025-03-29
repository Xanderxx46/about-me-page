import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Projects from "./pages/Projects";
import NotFound from "./pages/404";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<About />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default App;
