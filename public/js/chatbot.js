!function (w, d, s, ...args) {
    var div = d.createElement('div');
    div.id = 'aichatbot';
    
    // 스타일 요소 생성 및 추가
    var style = d.createElement('style');
    style.textContent = `
        #aichatbot > div > button {
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2),
                        inset 4px 4px 8px rgba(255, 255, 255, 0.9),
                        inset -4px -4px 8px rgba(0, 0, 0, 0.15) !important;
            border-radius: 50% !important;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            background: linear-gradient(145deg, #ffffff, #e6e6e6) !important;
            transform: perspective(1000px) translateZ(0);
            border: none !important;
            padding: 15px !important;
            position: relative;
        }

        #aichatbot > div > button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            background: linear-gradient(145deg, rgba(255,255,255,0.4), rgba(255,255,255,0)) !important;
            z-index: 2;
        }

        #aichatbot > div > button:hover {
            transform: perspective(1000px) translateY(-5px) translateZ(10px) !important;
            box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3),
                        inset 6px 6px 10px rgba(255, 255, 255, 0.9),
                        inset -6px -6px 10px rgba(0, 0, 0, 0.15) !important;
        }

        #aichatbot > div > button:active {
            transform: perspective(1000px) translateY(-2px) translateZ(5px) !important;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2),
                        inset 3px 3px 6px rgba(255, 255, 255, 0.9),
                        inset -3px -3px 6px rgba(0, 0, 0, 0.15) !important;
        }
    `;
    d.head.appendChild(style);
    d.body.appendChild(div);
    w.chatbotConfig = args;
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s);
    j.defer = true;
    j.type = 'module';
    j.src = 'https://aichatbot.sendbird.com/index.js';
    f.parentNode.insertBefore(j, f);
}(window, document, 'script', '0E5022AC-84D7-4E1D-8EEB-B02CD3184B70', 'J7GWLByl_ttj0lCP-YIXC', {
    apiHost: 'https://api-cf-ap-2.sendbird.com',
});