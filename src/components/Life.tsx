import React from 'react';
import { motion } from 'framer-motion';

/**
 * 日常生活组件
 * 展示个人生活照片和分享
 */
const Life: React.FC = () => {
  // 生活照片数据
  const lifePhotos = [
    {
      id: 1,
      title: '旅行 - 山川湖海',
      description: '探索大自然的美丽，感受山川湖海的壮丽景色。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20mountain%20landscape%20with%20lake%20and%20clear%20sky&image_size=landscape_16_9',
      date: '2023-12-01'
    },
    {
      id: 2,
      title: '美食 - 烹饪乐趣',
      description: '尝试制作各种美食，享受烹饪的乐趣和美食的美味。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20home-cooked%20meal%20with%20various%20dishes&image_size=landscape_16_9',
      date: '2023-11-15'
    },
    {
      id: 3,
      title: '阅读 - 知识之旅',
      description: '沉浸在书的世界中，不断学习和成长。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=person%20reading%20book%20in%20cozy%20library%20with%20warm%20lighting&image_size=landscape_16_9',
      date: '2023-10-20'
    },
    {
      id: 4,
      title: '运动 - 健康生活',
      description: '坚持运动，保持健康的生活方式。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=person%20running%20in%20park%20with%20green%20trees&image_size=landscape_16_9',
      date: '2023-09-10'
    },
    {
      id: 5,
      title: '科技 - 前沿探索',
      description: '关注科技发展，探索前沿技术的应用。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20technology%20gadgets%20and%20devices%20on%20desk&image_size=landscape_16_9',
      date: '2023-08-05'
    },
    {
      id: 6,
      title: '聚会 - 朋友相聚',
      description: '与朋友相聚，分享快乐时光。',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=group%20of%20friends%20hanging%20out%20in%20cafe&image_size=landscape_16_9',
      date: '2023-07-20'
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
          <h2>日常生活</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            分享我的日常生活点滴，包括旅行、美食、阅读、运动等方面的经历。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lifePhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="card overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={photo.image} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white">{photo.title}</h3>
                  <p className="text-sm text-gray-200">{photo.date}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400">{photo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Life;