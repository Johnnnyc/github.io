import React from 'react';
import { motion } from 'framer-motion';

/**
 * 关于我组件
 * 展示个人详细信息、技能和经验
 */
const About: React.FC = () => {
  // 技能数据
  const skills = [
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'JavaScript', level: 95 },
    { name: 'HTML/CSS', level: 90 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'Git', level: 85 },
    { name: 'UI/UX Design', level: 70 }
  ];

  // 经验数据
  const experiences = [
    {
      year: '2023 - 至今',
      title: '前端开发工程师',
      company: '科技公司',
      description: '负责公司核心产品的前端开发，使用 React、TypeScript 等技术栈，优化用户体验和页面性能。'
    },
    {
      year: '2021 - 2023',
      title: '全栈开发工程师',
      company: '互联网企业',
      description: '参与前后端开发，使用 Node.js 构建后端服务，React 开发前端界面，负责项目的整体架构设计。'
    },
    {
      year: '2019 - 2021',
      title: '初级前端工程师',
      company: '初创公司',
      description: '学习并应用现代前端技术，参与公司网站和应用的开发与维护。'
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
          <h2>关于我</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            我是一名热爱技术的前端开发工程师，专注于构建现代化、高性能的 web 应用。
            拥有多年的开发经验，热衷于学习新技术并将其应用到实际项目中。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 个人信息 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="mb-6">个人简介</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-24 text-gray-400">姓名</div>
                <div>开发者</div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-gray-400">职业</div>
                <div>前端开发工程师</div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-gray-400">邮箱</div>
                <div>developer@example.com</div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-gray-400">所在地</div>
                <div>中国</div>
              </div>
              <div className="flex items-start">
                <div className="w-24 text-gray-400">兴趣</div>
                <div>编程、阅读、旅行、摄影</div>
              </div>
            </div>
          </motion.div>

          {/* 技能 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="mb-6">技能</h3>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-[#00f0ff] h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 经验 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl mb-8">工作经验</h3>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-4"
              >
                <div className="md:w-1/4 text-[#00f0ff] font-medium">{exp.year}</div>
                <div className="md:w-3/4">
                  <h4 className="text-xl font-semibold mb-2">{exp.title}</h4>
                  <p className="text-gray-400 mb-2">{exp.company}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;