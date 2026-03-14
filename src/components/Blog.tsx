import React from 'react';
import { motion } from 'framer-motion';

/**
 * 博客组件
 * 展示博客文章列表和相关信息
 */
const Blog: React.FC = () => {
  // 博客文章数据
  const blogPosts = [
    {
      id: 1,
      title: 'React 18 新特性详解',
      summary: '深入探讨 React 18 带来的并发渲染、自动批处理等新特性，以及如何在项目中应用这些特性。',
      date: '2023-10-15',
      category: '前端开发',
      readTime: '10 分钟',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=React%2018%20features%20illustration%20with%20modern%20UI%20elements%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 2,
      title: 'TypeScript 最佳实践',
      summary: '分享 TypeScript 开发中的最佳实践，包括类型定义、接口设计、泛型使用等方面的技巧。',
      date: '2023-09-20',
      category: '前端开发',
      readTime: '8 分钟',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20code%20with%20type%20annotations%20in%20dark%20theme%20editor&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 3,
      title: '性能优化实战指南',
      summary: '从网络加载、渲染性能、JavaScript 执行等方面，详细介绍前端性能优化的方法和技巧。',
      date: '2023-08-10',
      category: '性能优化',
      readTime: '12 分钟',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=website%20performance%20optimization%20dashboard%20with%20metrics%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 4,
      title: 'CSS Grid 布局完全指南',
      summary: '全面介绍 CSS Grid 布局的使用方法，包括网格定义、响应式设计、复杂布局实现等。',
      date: '2023-07-05',
      category: '前端开发',
      readTime: '9 分钟',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSS%20Grid%20layout%20visualization%20with%20grid%20lines%20and%20areas%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 5,
      title: '如何构建可维护的前端项目',
      summary: '探讨前端项目的代码组织、命名规范、模块划分等方面，分享构建可维护项目的经验。',
      date: '2023-06-15',
      category: '项目管理',
      readTime: '11 分钟',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=frontend%20project%20structure%20diagram%20with%20modules%20and%20components%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 6,
      title: 'WebAssembly 入门教程',
      summary: '介绍 WebAssembly 的基本概念、使用方法以及如何将其应用到前端项目中提升性能。',
      date: '2023-05-20',
      category: '前端开发',
      readTime: '13 分钟',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=WebAssembly%20logo%20with%20code%20snippets%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    }
  ];

  return (
    <section className="py-20 bg-black bg-opacity-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2>博客</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            分享我的技术见解、开发经验和学习心得，希望能对你有所帮助。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="card overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs bg-[#00f0ff] text-black rounded-full font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-gray-400 mb-6">{post.summary}</p>
                <a href={post.link} className="btn w-full justify-center">
                  阅读全文
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;