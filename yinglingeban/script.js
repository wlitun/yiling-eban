// 页面导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航切换
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新导航激活状态
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应页面
            const targetPage = this.getAttribute('data-page');
            pageSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetPage) {
                    section.classList.add('active');
                }
            });
            
            // 特殊页面初始化
            if (targetPage === 'recipe') {
                generateSampleRecipes();
            } else if (targetPage === 'nursing-home') {
                generateSampleNursingHomes();
            }
        });
    });
    
    // 首页按钮导航
    document.querySelectorAll('button[data-page]').forEach(button => {
        button.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            document.querySelector(`.nav-link[data-page="${targetPage}"]`).click();
        });
    });
    
    // AI聊天功能
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const voiceSwitch = document.getElementById('voiceSwitch');
    
    // 预定义AI回复
    const aiResponses = [
        "听起来很有趣，能多告诉我一些吗？",
        "我理解您的感受，很多人都有类似的经历。",
        "今天天气不错，您出去散步了吗？",
        "保持积极心态对健康很重要，您平时有什么兴趣爱好？",
        "您的家人最近怎么样？",
        "随着年龄增长，保持社交活动对身心健康很有帮助。",
        "您喜欢听什么类型的音乐？我可以为您推荐一些。",
        "记住，我随时在这里陪伴您，您可以和我分享任何事情。",
        "适当的运动对老年人很重要，您平时做什么运动？",
        "您有什么特别喜欢的电视节目或电影吗？"
    ];
    
    // 发送消息功能
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;
        
        // 添加用户消息
        addMessage(message, 'user');
        messageInput.value = '';
        
        // 模拟AI思考时间
        setTimeout(() => {
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            addMessage(randomResponse, 'ai');
            
            // 如果语音朗读开启，朗读AI回复
            if (voiceSwitch.checked) {
                speakText(randomResponse);
            }
        }, 1000);
    }
    
    // 添加消息到聊天窗口
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 发送消息事件
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 语音朗读功能
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.9; // 稍慢的语速，适合老年人
            speechSynthesis.speak(utterance);
        }
    }
    
    // 语音输入功能
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN';
        
        recognition.onstart = function() {
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = '正在聆听...';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            voiceStatus.textContent = '已识别: ' + transcript;
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onerror = function() {
            voiceStatus.textContent = '语音识别错误，请重试';
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onend = function() {
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = '点击麦克风开始语音输入';
        };
        
        voiceBtn.addEventListener('click', function() {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        voiceStatus.textContent = '您的浏览器不支持语音识别';
        voiceBtn.style.opacity = '0.5';
        voiceBtn.style.cursor = 'not-allowed';
    }
    
    // 食谱生成功能
    const generateRecipeBtn = document.getElementById('generateRecipe');
    const recipeResults = document.getElementById('recipeResults');
    
    // 示例食谱数据
    const sampleRecipes = [
        {
            name: "燕麦蔬菜粥",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "富含膳食纤维，易于消化，适合早餐食用。",
            ingredients: ["燕麦片", "胡萝卜", "青菜", "香菇", "少量盐"],
            healthBenefits: "降血压、促进消化"
        },
        {
            name: "清蒸鲈鱼",
            image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "高蛋白低脂肪，富含不饱和脂肪酸，有益心血管健康。",
            ingredients: ["新鲜鲈鱼", "姜片", "葱段", "少量生抽"],
            healthBenefits: "保护心脏、补充优质蛋白"
        },
        {
            name: "豆腐蔬菜汤",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            description: "清淡易消化，富含植物蛋白和多种维生素。",
            ingredients: ["嫩豆腐", "西红柿", "菠菜", "金针菇", "少量盐"],
            healthBenefits: "补钙、增强免疫力"
        }
    ];
    
    // 生成示例食谱
    function generateSampleRecipes() {
        recipeResults.innerHTML = '';
        
        sampleRecipes.forEach(recipe => {
            const recipeCol = document.createElement('div');
            recipeCol.className = 'col-md-4';
            
            recipeCol.innerHTML = `
                <div class="recipe-card">
                    <div class="recipe-image" style="background-image: url('${recipe.image}')"></div>
                    <div class="recipe-content">
                        <h4>${recipe.name}</h4>
                        <p>${recipe.description}</p>
                        <h6>主要食材:</h6>
                        <p>${recipe.ingredients.join('、')}</p>
                        <h6>健康益处:</h6>
                        <p>${recipe.healthBenefits}</p>
                        <button class="btn btn-sm btn-outline-primary">查看详细做法</button>
                    </div>
                </div>
            `;
            
            recipeResults.appendChild(recipeCol);
        });
    }
    
    // 食谱生成按钮事件
    generateRecipeBtn.addEventListener('click', generateSampleRecipes);
    
    // 养老院推荐功能
    const searchNursingHomeBtn = document.getElementById('searchNursingHome');
    const nursingHomeResults = document.getElementById('nursingHomeResults');
    
    // 示例养老院数据
    const sampleNursingHomes = [
        {
            name: "康乐老年公寓",
            location: "北京市朝阳区",
            price: "4500元/月起",
            rating: 4,
            features: ["24小时护理", "医疗团队", "营养餐食", "文娱活动"],
            description: "位于市区，交通便利，环境优雅，专业护理团队。"
        },
        {
            name: "幸福家园养老院",
            location: "上海市浦东新区",
            price: "5200元/月起",
            rating: 5,
            features: ["康复训练", "心理疏导", "户外花园", "家属探视方便"],
            description: "现代化设施，专业康复服务，注重老年人心理健康。"
        },
        {
            name: "安康养老中心",
            location: "广州市天河区",
            price: "3800元/月起",
            rating: 4,
            features: ["中医养生", "理疗服务", "文化活动", "交通便利"],
            description: "结合传统中医养生理念，提供全面的健康管理服务。"
        }
    ];
    
    // 生成示例养老院
    function generateSampleNursingHomes() {
        nursingHomeResults.innerHTML = '';
        
        sampleNursingHomes.forEach(home => {
            const homeCol = document.createElement('div');
            homeCol.className = 'col-md-6';
            
            // 生成星级评分
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < home.rating ? 
                    '<i class="fas fa-star rating"></i>' : 
                    '<i class="far fa-star"></i>';
            }
            
            homeCol.innerHTML = `
                <div class="nursing-home-card">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h4>${home.name}</h4>
                        <div>${stars}</div>
                    </div>
                    <p><i class="fas fa-map-marker-alt me-2"></i> ${home.location}</p>
                    <p><i class="fas fa-tag me-2"></i> ${home.price}</p>
                    <p>${home.description}</p>
                    <div class="mb-3">
                        ${home.features.map(feature => 
                            `<span class="badge bg-light text-dark me-1">${feature}</span>`
                        ).join('')}
                    </div>
                    <div class="d-grid gap-2 d-md-flex">
                        <button class="btn btn-primary me-md-2">查看详情</button>
                        <button class="btn btn-outline-primary">联系咨询</button>
                    </div>
                </div>
            `;
            
            nursingHomeResults.appendChild(homeCol);
        });
    }
    
    // 养老院搜索按钮事件
    searchNursingHomeBtn.addEventListener('click', generateSampleNursingHomes);
    
    // 初始化显示一些内容
    generateSampleRecipes();
    generateSampleNursingHomes();
});