import React, { useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import { IoLogoJavascript } from "react-icons/io5";
import { SiTypescript } from "react-icons/si";
import { FaHtml5, FaCss3Alt, FaNode, FaReact } from "react-icons/fa";
import { TbBrandMinecraft, TbBrandCarbon } from "react-icons/tb";
import { Header } from "./About";
import { Link } from "react-router-dom";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      title: "A-3 US Army Website",
      description: "Website for an Arma-3 Unit im in!",
      longDescription: "A comprehensive website built for an Arma-3 military simulation unit. Features include staff information, social media accounts, and unit information.",
      tech: ["React", "HTML", "CSS"],
      category: "web",
      liveUrl: "https://cag-ussof.org",
      githubUrl: "https://github.com/a3-us-army/US-Army-WebsiteA3",
    },
    {
      title: "USA Core",
      description: "Utility Bot for an Arma-3 Unit",
      longDescription: "A feature-rich Discord bot developed specifically for managing and enhancing the Arma-3 unit's operations.",
      tech: ["TypeScript", "Carbon", "Kiai API"],
      category: "bot",
      liveUrl: "https://github.com/a3-us-army/USA-Core",
      githubUrl: "https://github.com/a3-us-army/USA-Core",
    },
    {
      title: "That One Friend",
      description: "Discord bot I made for a compitition.",
      longDescription: "A competitive entry Discord bot showcasing advanced features and unique functionality. Built using TypeScript and Buape's Carbon.",
      tech: ["TypeScript", "Carbon"],
      category: "bot",
      liveUrl: "https://github.com/Xanderxx46/that-one-friend",
      githubUrl: "https://github.com/Xanderxx46/that-one-friend",
    },
    {
      title: "Emberisles",
      description: "Minecraft server I helped make.",
      longDescription: "A custom Minecraft server featuring unique plugins and gameplay mechanics. I contributed to server development and management.",
      tech: ["MC Plugins"],
      category: "minecraft",
      liveUrl: "https://discord.gg/hbSPbxnkH9",
      githubUrl: "https://discord.gg/hbSPbxnkH9",
    },
    {
      title: "Portfolio Site",
      description: "I made this site as a little about myself.",
      longDescription: "Personal portfolio website built with React and TailwindCSS, featuring a clean and modern design with interactive elements and responsive layout.",
      tech: ["React", "HTML", "JavaScript", "TailwindCSS"],
      category: "web",
      liveUrl: "https://xanderxx.xyz",
      githubUrl: "https://github.com/Xanderxx46/about-me-page",
    },
    {
      title: "Xan Utils",
      description: "Discord bot i made for fun.",
      longDescription: "A multipurpose Discord utility bot with various features.",
      tech: ["TypeScript", "Carbon"],
      category: "bot",
      liveUrl: "https://github.com/Xanderxx46/Xan-Utils",
      githubUrl: "https://github.com/Xanderxx46/Xan-Utils",
    },
  ];

  const TechIcon = ({ name }) => {
    const icons = {
      JavaScript: <IoLogoJavascript className="text-yellow-400" size="20" />,
      TypeScript: <SiTypescript className="text-blue-400" size="20" />,
      NodeJS: <FaNode className="text-green-400" size="20" />,
      HTML: <FaHtml5 className="text-orange-400" size="20" />,
      CSS: <FaCss3Alt className="text-blue-500" size="20" />,
      "MC Plugins": <TbBrandMinecraft className="text-purple-400" size="20" />,
      Carbon: <TbBrandCarbon className="text-blue-200" size="20" />,
      React: <FaReact className="text-blue-600" size="20" />,
    };

    return icons[name] || null;
  };

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <header className="bg-gray-900 shadow-lg border-b border-purple-700/30 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-4xl font-bold text-white mb-4">
            My Projects
          </h1>
          <p className="text-center text-purple-300 text-lg">
            A collection of my work across web development, Discord bots, and
            Minecraft servers.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-purple-300 hover:bg-gray-700"
            } border border-purple-700/30`}
          >
            All Projects
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={() => setFilter("web")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "web"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-purple-300 hover:bg-gray-700"
            } border border-purple-700/30`}
          >
            Web Development
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={() => setFilter("bot")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "bot"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-purple-300 hover:bg-gray-700"
            } border border-purple-700/30`}
          >
            Discord Bots
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={() => setFilter("minecraft")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "minecraft"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-purple-300 hover:bg-gray-700"
            } border border-purple-700/30`}
          >
            Minecraft
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <div key={project.title}>
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-purple-700/30 hover:border-purple-500 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {project.title}
                    </h2>
                    <div className="flex gap-3">
                      <a
                        href={project.githubUrl}
                        className="text-purple-300 hover:text-purple-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={24} />
                      </a>
                      <a
                        href={project.liveUrl}
                        className="text-purple-300 hover:text-purple-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={24} />
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {project.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {project.tech.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full"
                      >
                        <TechIcon name={tech} />
                        <span className="text-purple-300 text-sm">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 shadow-lg mt-8 border-t border-purple-700/30">
        <div className="max-w-6xl mx-auto p-8 text-center text-purple-300">
          © 2025 Xander Hogan. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Projects; 