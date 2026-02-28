import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Thermometer, Droplets, Clock } from 'lucide-react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Life from './components/Life';
import Footer from './components/Footer';

/**
 * 主应用组件
 * 包含网站的整体结构和导航功能
 */
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  
  // 传感器数据状态
  const [sensorData, setSensorData] = useState({
    temperature: null as number | string | null,
    humidity: null as number | string | null,
    datetime: null as string | null
  });
  
  // 后端API地址（Replit服务器）
  const API_URL = 'https://githubio-425512895.replit.app/api';
  
  // 获取最新传感器数据
  const fetchSensorData = async () => {
    try {
      const response = await fetch(`${API_URL}/sensor-data`);
      if (!response.ok) {
        throw new Error('网络响应错误');
      }
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error('获取传感器数据失败:', error);
      // 显示错误信息
      setSensorData({
        temperature: '错误',
        humidity: '错误',
        datetime: new Date().toLocaleString()
      });
    }
  };
  
  // 手动触发获取温湿度命令
  const sendGetSensorData = async () => {
    try {
      const response = await fetch(`${API_URL}/get-sensor-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('网络响应错误');
      }
      const data = await response.json();
      console.log(data.message);
      // 发送命令后，等待一段时间再获取数据
      setTimeout(fetchSensorData, 1000);
    } catch (error) {
      console.error('发送获取温湿度命令失败:', error);
    }
  };
  
  // 页面加载时获取一次数据
  useEffect(() => {
    fetchSensorData();
    // 每5分钟获取一次数据
    const interval = setInterval(fetchSensorData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // 检测当前滚动位置对应的section
      const sections = ['home', 'about', 'projects', 'blog', 'life'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滚动到指定section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="App">
      {/* 导航栏 */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-opacity-90 backdrop-blur-md bg-black' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            <span className="text-[#00f0ff]">Tech</span>Portfolio
          </motion.div>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {['home', 'about', 'projects', 'blog', 'life'].map((section) => (
              <motion.button
                key={section}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium transition-colors ${activeSection === section ? 'text-[#00f0ff]' : 'text-gray-400 hover:text-white'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
          </nav>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* 移动端导航菜单 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black bg-opacity-95 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {['home', 'about', 'projects', 'blog', 'life'].map((section) => (
                  <motion.button
                    key={section}
                    whileHover={{ x: 10 }}
                    onClick={() => scrollToSection(section)}
                    className={`text-left py-2 text-sm font-medium transition-colors ${activeSection === section ? 'text-[#00f0ff]' : 'text-gray-400'}`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 主要内容 */}
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="sensor-data" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2>传感器数据</h2>
              <p className="max-w-2xl mx-auto text-gray-400">
                实时展示来自ESP32的温湿度数据
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Thermometer size={48} className="text-[#00f0ff]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">温度</h3>
                  <p className="text-3xl font-bold text-center text-[#00f0ff]">
                    {sensorData.temperature !== null ? `${sensorData.temperature} °C` : '加载中...'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Droplets size={48} className="text-[#00f0ff]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">湿度</h3>
                  <p className="text-3xl font-bold text-center text-[#00f0ff]">
                    {sensorData.humidity !== null ? `${sensorData.humidity} %` : '加载中...'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Clock size={48} className="text-[#00f0ff]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">更新时间</h3>
                  <p className="text-center text-gray-300">
                    {sensorData.datetime || '加载中...'}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button
                onClick={sendGetSensorData}
                className="btn bg-[#00f0ff] text-black hover:bg-white"
              >
                🔄 获取最新数据
              </button>
            </motion.div>
          </div>
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="blog">
          <Blog />
        </section>
        <section id="life">
          <Life />
        </section>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
};

export default App;