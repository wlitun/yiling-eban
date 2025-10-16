const axios = require('axios');

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // 模拟回复（在没有API密钥时使用）
    const mockReplies = [
      "老人家，今天天气不错，适合出去散散步呢。",
      "我理解您的感受，很多人都有类似的经历。",
      "保持积极心态对健康很重要，您平时有什么兴趣爱好？",
      "您的家人最近怎么样？",
      "适当的运动对老年人很重要，您平时做什么运动？",
      "您喜欢听什么类型的音乐？我可以为您推荐一些。",
      "记住，我随时在这里陪伴您，您可以和我分享任何事情。",
      "听起来很有趣，能多告诉我一些吗？",
      "今天心情怎么样？有什么想和我分享的吗？",
      "注意休息，保持充足的睡眠对健康很重要。"
    ];
    
    // 如果没有API密钥，使用模拟回复
    const apiKey = process.env.ALIYUN_API_KEY;
    if (!apiKey) {
      // 模拟AI思考时间
      await new Promise(resolve => setTimeout(resolve, 1000));
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      return res.status(200).json({ 
        success: true, 
        reply: randomReply,
        note: "当前使用模拟回复，配置API密钥后可体验真实AI对话"
      });
    }
    
    // 调用真实的通义千问API
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'system',
              content: '你是一个专门为老年人提供陪伴和关怀的AI助手。你说话要温柔、耐心、富有同理心。回答要简洁明了，避免使用复杂词汇。专注于提供情感支持和简单的生活建议。'
            },
            {
              role: 'user',
              content: message
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const aiReply = response.data.output.choices[0].message.content;
    res.status(200).json({ 
      success: true, 
      reply: aiReply 
    });
    
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    // 返回友好的错误信息
    res.status(500).json({
      success: false,
      error: '抱歉，服务暂时不可用，请稍后再试。',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};