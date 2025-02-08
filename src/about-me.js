import React from "react";
import { Github, Mail, ExternalLink } from "lucide-react";

import { BsDiscord } from "react-icons/bs";

import { IoLogoJavascript } from "react-icons/io5";

import { SiTypescript } from "react-icons/si";

import { FaHtml5, FaCss3Alt, FaNode, FaReact } from "react-icons/fa";

import { TbBrandMinecraft, TbBrandCarbon } from "react-icons/tb";

import { VscBlank } from "react-icons/vsc";

// Mock data for preview with added URLs
const previewData = {
	skills: [
		{
			name: "JavaScript",
			iconName: "JavaScript",
			url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
		},
		{
			name: "TypeScript",
			iconName: "TypeScript",
			url: "https://www.typescriptlang.org/",
		},
		{ name: "Node.js", iconName: "NodeJS", url: "https://nodejs.org/" },
		{
			name: "HTML",
			iconName: "HTML",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
		},
		{
			name: "CSS",
			iconName: "CSS",
			url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
		},
		{
			name: "MC Plugins",
			iconName: "Server",
			url: "https://www.minecraft.net/en-us/download/server",
		},
		{
			name: "Carbon",
			iconName: "Carbon",
			url: "https://carbon.buape.com",
		},
		{
			name: "React",
			iconName: "React",
			url: "https://react.dev",
		},
	],
	projects: [
		{
			title: "A-3 US Army Website",
			description: "Website for an Arma-3 Unit im in!",
			tech: "React, HTML, CSS",
			liveUrl: "https://cag-ussof.org",
			githubUrl: "https://github.com/a3-us-army/US-Army-WebsiteA3",
		},
		{
			title: "USA Core",
			description: "Utility Bot for an Arma-3 Unit",
			tech: "Typescript, Carbon, Kiai API",
			liveUrl: "https://github.com/a3-us-army/USA-Core",
			githubUrl: "https://github.com/a3-us-army/USA-Core",
		},
		{
			title: "That One Friend",
			description: "Discord bot I made for a compitition.",
			tech: "Typescript, Carbon",
			liveUrl: "https://github.com/Xanderxx46/that-one-friend",
			githubUrl: "https://github.com/Xanderxx46/that-one-friend",
		},
		{
			title: "Emberisles",
			description: "Minecraft server I helped make.",
			tech: "MC Plugins",
			liveUrl: "https://discord.gg/hbSPbxnkH9",
			githubUrl: "https://discord.gg/hbSPbxnkH9",
		},
		{
			title: "This Site",
			description: "I made this site as a little about myself.",
			tech: "React, HTML, JavaScript, TailwindCSS",
			liveUrl: "https://xanderxx.xyz",
			githubUrl: "https://github.com/Xanderxx46/about-me-page",
		},
		{
			title: "Xan Utils",
			description: "Discord bot i made for fun.",
			tech: "Typescript, Carbon",
			liveUrl: "https://github.com/Xanderxx46/Xan-Utils",
			githubUrl: "https://github.com/Xanderxx46/Xan-Utils",
		},
	],
};

const TechIcon = ({ name }) => {
	const icons = {
		JavaScript: <IoLogoJavascript className="text-yellow-400" size="28" />,
		TypeScript: <SiTypescript className="text-blue-400" size="28" />,
		NodeJS: <FaNode className="text-green-400" size="28" />,
		HTML: <FaHtml5 className="text-orange-400" size="28" />,
		CSS: <FaCss3Alt className="text-blue-500" size="28" />,
		Server: <TbBrandMinecraft className="text-purple-400" size="28" />,
		Carbon: <TbBrandCarbon className="text-blue-200" size="28" />,
		React: <FaReact className="text-blue-600" size="28" />,
	};

	return icons[name] || <VscBlank className="text-gray-400" />;
};

const ProjectCard = ({ project }) => {
	return (
		<div className="group relative">
			<a href={project.liveUrl} className="block">
				<div className="border border-purple-700/30 rounded-lg p-4 bg-gray-800 hover:bg-gray-700 transition-all duration-300 h-full hover:border-purple-500">
					<div className="flex justify-between items-start mb-2">
						<h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
							{project.title}
						</h3>
						<div className="flex gap-2">
							<ExternalLink size={20} className="text-purple-300" />
						</div>
					</div>
					<p className="text-gray-300 mb-2">{project.description}</p>
					<p className="text-sm text-purple-300">{project.tech}</p>
				</div>
			</a>
			<a
				href={project.githubUrl}
				className="absolute top-4 right-12 text-purple-300 hover:text-purple-400 transition-colors"
			>
				<Github size={20} />
			</a>
		</div>
	);
};

const SkillCard = ({ skill, iconName, url }) => (
	<a
		href={url}
		target="_blank"
		rel="noopener noreferrer"
		className="bg-gray-800 rounded-lg p-4 text-center text-gray-200 font-medium hover:bg-gray-700 transition-all flex flex-col items-center gap-2 border border-purple-700/30 hover:border-purple-500 hover:text-purple-300 group cursor-pointer"
	>
		<div className="transform group-hover:scale-110 transition-transform">
			<TechIcon name={iconName} />
		</div>
		<span>{skill}</span>
		<ExternalLink
			size={14}
			className="text-purple-400/0 group-hover:text-purple-400/100 transition-all"
		/>
	</a>
);

const Header = () => {
	return (
		<header className="relative bg-gray-800 shadow-lg border-b border-purple-700/30 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-gray-900/20">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `url('https://cdn.discordapp.com/banners/829909201262084096/a_d7a1cd5e8f3c842cb1fd388d0fcfdb53.gif')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						opacity: 0.2,
					}}
				/>
			</div>
			<div className="relative max-w-6xl mx-auto p-8">
				<div className="flex items-center gap-6">
					<img
						src="https://avatars.githubusercontent.com/u/112892597?s=400&u=4e2129e0757e95c27e39e873f7a8c21688024dc3&v=4"
						alt="Profile"
						className="rounded-full w-32 h-32 object-cover shadow-lg ring-2 ring-purple-500 z-10"
					/>
					<div className="z-10">
						<h1 className="text-4xl font-bold text-white">Xander</h1>
						<p className="text-xl text-purple-300">
							Discord Bot Dev & MC/Discord Server Manager
						</p>
					</div>
				</div>
			</div>
		</header>
	);
};

const AboutMePreview = () => {
	return (
		<div className="min-h-screen bg-gray-900">
			<Header />

			<main className="max-w-6xl mx-auto p-8">
				<section className="bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-purple-700/30">
					<h2 className="text-center text-2xl font-bold text-white mb-4">
						About Me
					</h2>
					<p className="text-center text-gray-300 leading-relaxed">
						Hey! Im Xander! I like to create discord bots in my free time. Its
						pretty fun lol. When im not working on some random project, im
						probably playing games with friends! I've done a few different
						projects, including a couple dead ones (RIP).
					</p>
				</section>

				<section className="bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-purple-700/30">
					<h2 className="text-center text-2xl font-bold text-white mb-4">
						Skills
					</h2>
					<div className="justify-center grid grid-cols-2	 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{previewData.skills.map((skill) => (
							<SkillCard
								key={skill.name}
								skill={skill.name}
								iconName={skill.iconName}
								url={skill.url}
							/>
						))}
					</div>
				</section>

				<section className="bg-gray-800 rounded-lg shadow-md p-8 mb-8 border border-purple-700/30">
					<h2 className="text-center text-2xl font-bold text-white mb-4">
						Featured Projects
					</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{previewData.projects.map((project) => (
							<ProjectCard key={project.title} project={project} />
						))}
					</div>
				</section>

				<section className="bg-gray-800 rounded-lg shadow-md p-8 border border-purple-700/30 text-center items-center">
					<h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
					<div className="items-center justify-center gap-4 flex text-center">
						<a
							href="https://github.com/Xanderxx46"
							className="text-purple-300 hover:text-purple-400 transition-colors"
						>
							<Github size={24} />
						</a>
						<a
							href="https://discord.com/users/829909201262084096"
							className="text-purple-300 hover:text-purple-400 transition-colors"
						>
							<BsDiscord size={24} />
						</a>
						<a
							href="mailto:main@xanderxx.xyz"
							className="text-purple-300 hover:text-purple-400 transition-colors text-center"
						>
							<Mail size={24} />
						</a>
					</div>
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

export default AboutMePreview;
