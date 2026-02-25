// 1.《 ======== 鼠标样式 ========= 》
// 获取body元素，让鼠标样式只在body范围内生效
const body = document.querySelector("body");
// 获取鼠标指针元素
const mousePointer = document.getElementById("mousePointer");
// 获取鼠标指针元素的宽度的一半，即：半径'
// console.log(mousePointer.offsetWidth);
const half_width = mousePointer.offsetWidth / 2;
// 鼠标移动事件，将原来的鼠标指针位置匹配到新的指针元素（园）的圆心上
// 这里的 x 和 y 是鼠标指针的位置，减去半径是为了让圆心对齐鼠标指针的位置,+1代表微调，避免圆心偏移
function updateMousePointerPosition(x,y){
    mousePointer.style.transform=`translate(${x-half_width+1}px, ${y-half_width+1}px)`
}
// 监听鼠标移动事件，用addEventListener
// 匿名函数传入事件对象 e，获取鼠标位置，并调用 updateMousePointerPosition 更新指针位置
// body.addEventListener("mousemove", (e) => {
//     // 使用 requestAnimationFrame 来优化性能，避免过多的重绘和回流
//     window.requestAnimationFrame(() => {
//         updateMousePointerPosition(e.clientX, e.clientY);
//     });
// });

// 监听整个document文档，新写一个鼠标移除页面时的事件，隐藏鼠标指针元素
// 不要监听 body 的 mouseleave 事件，因为当鼠标移出 body 时，可能会进入其他元素，导致指针元素的显示状态不正确
document.addEventListener("mousemove", (e) => {
    // 使用 requestAnimationFrame 来优化性能，避免过多的重绘和回流
    window.requestAnimationFrame(() => {
        updateMousePointerPosition(e.clientX, e.clientY);
    });
});

// 鼠标移出页面时，隐藏鼠标指针元素
document.addEventListener("mouseleave", () => {
    // console.log("鼠标离开页面");
    mousePointer.classList.add("hidden");
});

// 鼠标进入页面时，显示鼠标指针元素
document.addEventListener("mouseenter", () => {
    // console.log("鼠标进入页面");
    mousePointer.classList.remove("hidden");
});

// 鼠标悬停在页面时，显示鼠标指针元素。
// 对鼠标在加载页面时可能没有触发 mouseenter 事件的情况进行补充，确保鼠标指针元素在页面加载后能够正确显示
document.addEventListener("mouseover", (e) => {
    // 如果鼠标指针元素当前是隐藏的，说明可能是页面加载时没有触发 mouseenter 事件，此时更新指针位置并显示它
    if (mousePointer.classList.contains("hidden")) {
        // 更新一次鼠标指针位置，确保它出现在正确的位置
        updateMousePointerPosition(e.clientX, e.clientY);
        mousePointer.classList.remove("hidden");
    }
});


// 2.《 ======== 搜索框样式 ========= 》
// 获取搜索按钮元素
const Input = document.getElementById("input");
const searchButton = document.getElementById("search_button");
// 监听搜索按钮的点击事件，获取输入框的值，并进行搜索
searchButton.addEventListener("click", () => {
    Search();
});
// 监听输入框的回车事件，获取输入框的值，并进行搜索
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter"&&!e.shiftKey) {
        Search();
    }
    if(e.key == "Enter" && e.shiftKey){
        // 延迟 200 毫秒，等待松开 Shift 键，否则会导致直接打开新窗口而不是新标签页
        setTimeout(() => {
            hotKey_Search();
        }, 200);
    }
});

// 搜索函数，获取输入框的值，并进行搜索
function Search() {
    const bing_url="https://cn.bing.com/search?q=";
    if(Input.value.trim() === ""){
        console.log("搜索内容为空");
    }
    else{
        saveHistory(Input.value.trim());        // 保存历史记录
        const query_url=bing_url+Input.value;
        window.open(query_url, "_blank");
    }
}

// 快捷键搜索函数，根据输入的内容进行不同的跳转
function hotKey_Search() {
    const hotkey_value=Input.value.trim().toLowerCase();
    const originalVal = Input.value.trim();     // 保存用户输入的原始大小写

    if(hotkey_value === ""){
        console.log("搜索内容为空");
    }

    // 无论用户输入的是什么内容，都先保存到历史记录中（保持大小写原样），然后再根据小写版本进行快捷键判断
    saveHistory(originalVal);

    // b站、抖音、YouTube、Google、Gemini、ChatGPT、GitHub等常用网站的快捷键示例
    if(hotkey_value === "bilibili"||hotkey_value === "bl"){
        window.open("https://www.bilibili.com/", "_blank");
    }
    else if(hotkey_value === "抖音"||hotkey_value === "douyin"||hotkey_value === "dy"){
        window.open("https://www.douyin.com/", "_blank");
    }
    else if(hotkey_value === "youtube"){
        window.open("https://www.youtube.com/", "_blank");
    }
    else if(hotkey_value === "google"){
        window.open("https://www.google.com/", "_blank");
    }
    else if(hotkey_value === "gemini"){
        window.open("https://gemini.google.com/", "_blank");
    }
    else if(hotkey_value === "chatgpt"){
        window.open("https://chat.openai.com/", "_blank");
    }
    else if(hotkey_value === "github"){
        window.open("https://github.com/", "_blank");
    }
    else{
        // 如果输入的内容不匹配任何快捷键，则执行正常的搜索
        Search();
    }
}


// 3.《 ======== 历史搜索记录 ========= 》

// 获取HistoryBox元素，用于显示历史记录列表。这样下面才可以定义History-item的样式和绑定事件
const HistoryBox = document.getElementById("history_box");

// 监听整个历史记录框的 mousedown 事件，阻止浏览器的默认行为
HistoryBox.addEventListener("mousedown", function(e) {
    // 阻止默认行为，即阻止点击时输入框失去焦点，从而避免历史记录框关闭
    e.preventDefault(); 
});

// 保存搜索词到浏览器自带的 localStorage
function saveHistory(keyword) {
    if (!keyword){
        return;     // 如果输入的关键词是空的，就不存储
    }

    // 从 localStorage 中把以前存的字符串读取出来，转化为真正的 JS 数组
    // JSON.parse：把从localStorage提取出的字符串转化为数组
    // localStorage.getItem("mySearchHistory")：从 localStorage 中获取之前存储的历史记录字符串
    // ||[]：如果之前没存过，就给一个空数组 []
    let historyArray = JSON.parse(localStorage.getItem("mySearchHistory")) || [];

    // 去重操作：如果用户之前搜过这个词，把它从旧位置删掉，一会放到最前面
    // filter 方法(过滤)：创建一个新数组，筛选出为真的元素。item !== keyword，即保留那些未被搜索过的元素，去除已搜索过的元素，最后返回建立的新数组。
    historyArray = historyArray.filter(item => item !== keyword);

    // 把新搜的词放到数组的最前面
    historyArray.unshift(keyword);

    // 限制条数：最多只存 6 条历史记录
    if (historyArray.length > 6) {
        historyArray.pop();     // 把最老的一条踢掉
    }

    // 把数组转化回字符串，存进浏览器的小仓库里
    localStorage.setItem("mySearchHistory", JSON.stringify(historyArray));
}

// 渲染：把数据显示到页面上
function renderHistory() {
    let historyArray = JSON.parse(localStorage.getItem("mySearchHistory")) || [];
    
    if (historyArray.length === 0) {
        HistoryBox.innerHTML = "<div style='padding: 10px 20px; color: #999; font-size: 14px;'>暂无搜索历史</div>";
        return;
    }

    // 生成 HTML 列表
    let htmlStr = "";
    historyArray.forEach(item => {
        htmlStr += `
        <div class="history-item">
            <div class="history-item-left" data-keyword="${item}">
                <i class="fas fa-history"></i>
                <span>${item}</span>
            </div>
            <i class="fas fa-times history-delete" data-keyword="${item}"></i>
        </div>`;
    });
    
    htmlStr += `<div class="history-clear" id="clear_btn">清空全部历史</div>`;
    HistoryBox.innerHTML = htmlStr;

    // 给历史记录绑定点击搜索事件（注意：绑定在 history-item-left 上，防止和删除冲突）
    document.querySelectorAll(".history-item-left").forEach(item => {
        item.addEventListener("click", function(e) {
            // 获取存储在 data-keyword 里的词
            Input.value = this.getAttribute("data-keyword"); 
            Search(); 
        });

    });

    // 给所有的“单条删除”按钮绑定点击事件
    document.querySelectorAll(".history-delete").forEach(btn => {
        btn.addEventListener("click", function(e) {
            // 阻止事件冒泡，防止点击删除时失焦导致下拉框关闭
            // 但是单单只做这个还不够，因为按下删除按钮（mousedown）的瞬间会让输入框失去焦点，历史记录框关闭，
            // 点击事件是 mousedown + mouseup 两个阶段，因此mousedown后会导致失去焦点，在mouseup后完成整个click事件才可以获得焦点
            // 因此会导致出现点击删除按钮后，历史记录框关闭，随后重新出现
            // 解决方案：监听整个历史记录框的 mousedown 事件，阻止浏览器的默认行为
            e.stopPropagation();    
            
            // 获取当前点击按钮对应的词
            let wordToDelete = this.getAttribute("data-keyword");
            
            // 从本地存储里拿出数组
            let currentHistory = JSON.parse(localStorage.getItem("mySearchHistory")) || [];
            
            // 用 filter 方法过滤掉这个词，保留那些不等于这个词的元素
            let newHistory = currentHistory.filter(item => item !== wordToDelete);
            
            // 把新数组存回 localStorage
            localStorage.setItem("mySearchHistory", JSON.stringify(newHistory));
            
            // 重新渲染列表（让删除的条目瞬间消失）
            renderHistory(); 
            
            // 保持输入框获取焦点，防止历史记录框因为失去焦点而关闭
            Input.focus();
        });
    });

    // 全部清空按钮绑定事件
    document.getElementById("clear_btn").addEventListener("click", function(e) {
        e.stopPropagation();    
        localStorage.removeItem("mySearchHistory"); 
        renderHistory();    
        Input.focus();      
    });
    // 每次重新渲染完毕后，根据新的高度调整下方列表位置
    // 即当点击删除某一条历史记录时，下方的网站列表会跟着“缩”上来
    adjustNavPosition();
}

// 历史搜索记录框触发时机
const isWindowSwitched = false;     // 定义一个变量来跟踪窗口是否切换过
// 当用户点击输入框准备打字时，显示历史记录
Input.addEventListener("focus", function() {
    if (isWindowSwitched) {
        return; // 如果窗口已经切换过了，就不执行显示历史记录的操作
    }
    setTimeout(() => {
        renderHistory();        // 每次显示之前先渲染，确保历史记录是最新的
        HistoryBox.classList.remove("hidden");
        // 展开后推挤列表
        adjustNavPosition();
    }, 500);        // 用setTimeout函数延迟 500 毫秒。没必要快速显示，有的时候很快就搜索完了，显示出来没意义
});
// 当用户点击网页其他地方，输入框失去焦点时，隐藏历史记录
Input.addEventListener("blur", function() {
    setTimeout(() => {
    // 如果 document.hasFocus() 是 false，说明当前切到了别的标签页
    // hasFocus解决了切屏时导致的闪烁问题
    // 此时直接 return 退出，不执行 hidden 操作，避免出现切换页面时历史记录框消失又出现的问题
    // 只有当用户真正点击了页面其他地方导致输入框失去焦点时，才隐藏历史记录框
    if (!document.hasFocus()) {
        return; 
    }

    // 以上注释代码是为了优化切屏体验，但是做不到软件切屏消除闪烁，因此注释
    // 现改为监听整个窗口的blur事件来隐藏历史记录框。监听到切屏事件则直接令input失去焦点，触发输入框的blur事件，隐藏历史记录框
    // 不写了，我不改了。虽然我不知道为什么可以运行，但是它就是可以运行！

    HistoryBox.classList.add("hidden");
    // 历史搜索记录框收起后将网站图标恢复原位
    adjustNavPosition();
    }, 150);        // 延迟 150 毫秒，防止点击历史条目时，还没点下去框就消失了。
});
// 针对切换软件
window.addEventListener("blur", function() {
    isWindowSwitched = true;   // 当窗口失去焦点时，说明用户切换了标签页或应用程序，设置变量为 true
});
window.addEventListener("focus", function() {
    isWindowSwitched = false;  // 当窗口重新获得焦点时，说明用户回到了这个标签页，重置变量为 false
});

// 4.《 ======== 网站快捷图标 ========= 》

// 获取在HTML中的容器
const navContainer = document.getElementById("nav_container");

// 配置你想展示的网站数据字典（数组里面嵌套对象）
// name: 网站名字 | url: 网站链接 | icon: font-awesome对应的图标类名 | color: 图标的专属背景色
const websites = [
    { name: "Google", url: "https://www.google.com/", icon: "fa-brands fa-google", color: "#4285F4" },
    { name: "GitHub", url: "https://github.com/", icon: "fa-brands fa-github", color: "#24292e" },
    { name: "Gemini", url: "https://gemini.google.com/", icon: "si si-googlegemini", color: "#4285F4" },
    // { name: "抖音", url: "https://www.douyin.com/", icon: "fa-brands fa-tiktok", color: "#000000" },
    // { name: "YouTube", url: "https://www.youtube.com/", icon: "fa-brands fa-youtube", color: "#ff0000" },
    { name: "ChatGPT", url: "https://chat.openai.com/", icon: "si si-openai", color: "#10a37f" },
    { name:"Grok", url:"https://grok.com/", icon:"fa-solid fa-slash fa-flip-horizontal", color:"#000000"},
    { name: "Bilibili", url: "https://www.bilibili.com/", icon: "fa-brands fa-bilibili", color: "#fb7299" }, 
    { name:"163Email", url:"https://mail.163.com/", icon:"fa-solid fa-envelope", color:"#dd3d4f"},
    { name:"Translate", url:"https://translate.google.com/", icon:"fa-solid fa-language", color:"#4285F4"},
    // { name:"Henu", url:"https://xk.henu.edu.cn/cas/login.action", icon:"fa-solid fa-h", color:"#1381ca"},
    // { name: "知乎", url: "https://www.zhihu.com/", icon: "fa-brands fa-zhihu", color: "#0066ff" },
    // { name: "微博", url: "https://weibo.com/", icon: "fa-brands fa-weibo", color: "#e6162d" },
    
    
];

// 定义渲染函数：把数据变成实实在在的 HTML 塞进网页里
function renderWebsites() {
    let htmlStr = "";   // 初始化一个空字符串，用于拼接HTML片段

    // forEach() 方法会遍历数组里的每一个对象
    websites.forEach(site => {
        // 使用 ES6 的模板字符串（反引号 ``）拼接HTML变量
        // target="_blank" 代表在新标签页打开链接
        htmlStr += `
            <a href="${site.url}" target="_blank" class="nav-item">
                <div class="nav-icon" style="background-color: ${site.color};">
                    <i class="${site.icon}"></i>
                </div>
                <span class="nav-text">${site.name}</span>
            </a>
        `;
    });

    // 最后，把拼接好的长长一串 HTML 塞入到页面的容器中
    navContainer.innerHTML = htmlStr;
}

// 脚本加载完毕后，立刻执行渲染函数
renderWebsites();

// 5.《 ======== 网站图标动态排版 ========= 》
function adjustNavPosition() {
    // 获取网站列表容器
    const navContainer = document.getElementById("nav_container");
    
    // 如果没有找到容器，直接退出，防止报错
    if (!navContainer) {
        return;
    }

    // 判断历史记录框是否处于显示状态
    if (!HistoryBox.classList.contains("hidden")) {
        // 获取历史记录框当前的实际高度
        const historyHeight = HistoryBox.offsetHeight;
        
        // 动态修改 translateY 向下偏移：历史记录的高度 + 20px 额外留白间距
        navContainer.style.transform = `translate(-50%, ${historyHeight + 15}px)`;
    } 
    else {
        // 如果历史记录隐藏，网站列表恢复原位
        navContainer.style.transform = `translate(-50%, 0)`;
    }
}
