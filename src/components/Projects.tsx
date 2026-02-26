import React from 'react';
import { motion } from 'framer-motion';

/**
 * 项目展示组件
 * 展示个人项目、技术栈和项目链接
 */
const Projects: React.FC = () => {
  // 项目数据
  const projects = [
    {
      id: 1,
      title: '智能仪表盘',
      description: '基于 React 和 TypeScript 开发的实时数据可视化仪表盘，支持多种图表类型和数据交互。',
      techStack: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS'],
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20dashboard%20with%20data%20visualization%20charts%20and%20metrics%20in%20blue%20and%20black%20color%20scheme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 2,
      title: '电商网站',
      description: '使用 Next.js 构建的现代化电商平台，包含产品展示、购物车、支付等功能。',
      techStack: ['Next.js', 'React', 'Redux', 'Stripe'],
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20e-commerce%20website%20with%20product%20cards%20and%20shopping%20cart%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 3,
      title: '个人博客',
      description: '使用 Gatsby 构建的静态博客网站，支持 Markdown 写作和语法高亮。',
      techStack: ['Gatsby', 'React', 'GraphQL', 'MDX'],
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20personal%20blog%20website%20with%20articles%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 4,
      title: '任务管理应用',
      description: '基于 React 和 Firebase 的实时任务管理应用，支持团队协作和任务分配。',
      techStack: ['React', 'Firebase', 'Material-UI', 'Redux'],
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=task%20management%20application%20with%20kanban%20board%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 5,
      title: '天气应用',
      description: '使用 React 和 OpenWeather API 开发的天气查询应用，支持实时天气和预报。',
      techStack: ['React', 'TypeScript', 'OpenWeather API', 'Tailwind CSS'],
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=weather%20application%20with%20temperature%20display%20and%20forecast%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    },
    {
      id: 6,
      title: '在线编辑器',
      description: '基于 Monaco Editor 的在线代码编辑器，支持多种编程语言和实时预览。',
      techStack: ['React', 'Monaco Editor', 'TypeScript', 'Express'],
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20code%20editor%20with%20syntax%20highlighting%20in%20dark%20theme&image_size=landscape_16_9',
      link: '#'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2>项目</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            这里展示了我开发的一些项目，涵盖了不同的技术栈和应用场景。
            每个项目都体现了我的技术能力和解决问题的思路。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="card overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="px-3 py-1 text-xs bg-gray-800 rounded-full text-[#00f0ff]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a href={project.link} className="btn w-full justify-center">
                  查看详情
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;