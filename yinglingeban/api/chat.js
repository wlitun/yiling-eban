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
    
    // 这里使用模拟回复，实际使用时替换为通义千问API调用
    const mockReplies = [
      "老人家，今天天气不错，适合出去散散步呢。",
      "我理解您的感受，很多人都有类似的经历。",
      "保持积极心态对健康很重要，您平时有什么兴趣爱好？",
      "您的家人最近怎么样？",
      "适当的运动对老年人很重要，您平时做什么运动？",
      "您喜欢听什么类型的音乐？我可以为您推荐一些。",
      "记住，我随时在这里陪伴您，您可以和我分享任何事情。"
    ];
    
    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
    
    res.status(200).json({
      success: true,
      reply: randomReply
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: '抱歉，服务暂时不可用，请稍后再试。'
    });
  }
};