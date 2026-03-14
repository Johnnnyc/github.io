import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

/**
 * 页脚组件
 * 展示版权信息、联系方式和社交链接
 */
const Footer: React.FC = () => {
  return (
    <footer className="py-16 bg-black bg-opacity-80 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 个人信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">
              <span className="text-[#00f0ff]">Tech</span>Portfolio
            </h3>
            <p className="text-gray-400 mb-6">
              专注于前端开发和技术创新的工程师，致力于构建现代化、高性能的 web 应用。
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Github size={20} />, href: "#", label: "Github" },
                { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
                { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
                { icon: <Mail size={20} />, href: "#", label: "Email" }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* 快速链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              {['首页', '关于我', '项目', '博客', '日常生活'].map((item, index) => (
                <li key={index}>
                  <a 
                    href={`#${['home', 'about', 'projects', 'blog', 'life'][index]}`} 
                    className="text-gray-400 hover:text-[#00f0ff] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 联系方式 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-4">联系方式</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>developer@example.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>中国</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* 版权信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
        >
          <p>© {new Date().getFullYear()} TechPortfolio. 保留所有权利。</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;