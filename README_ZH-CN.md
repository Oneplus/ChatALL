<div align="center">
   <img src="src/assets/logo-cover.png" width=256></img>
   <p><strong>同时与所有 AI 机器人聊天，发现最佳选择</strong></p>
</div>

## 屏幕截图

![Screenshot](screenshots/screenshot-2.png?raw=true)
![Screenshot](screenshots/screenshot-1.png?raw=true)

## 功能

基于大型语言模型（LLMs）的 AI 机器人非常神奇。然而，它们的行为可能是随机的，不同的机器人在不同的任务上表现也有差异。如果你想获得最佳体验，不要一个一个尝试。ChatALL（中文名：齐叨）可以把一条指令同时发给多个 AI，帮助您发现最好的回答。

### 支持的 AI

| AI 机器人                            | 网页访问 | API     |
|-------------------------------------|----------|---------|
| [ChatGPT](https://chat.openai.com)  | 支持     | 支持    |
| [Bing Chat](https://www.bing.com/new)| 支持     | 无 API  |
| [文心一言](https://yiyan.baidu.com/) | 否       | 支持    |
| [Bard](https://bard.google.com/)    | 支持     | 无 API  |
| [Poe](https://poe.com/)             | 即将推出 | 即将推出|
| [MOSS](https://moss.fastnlp.top/)   | 支持     | 无 API  |
| [通义千问](http://tongyi.aliyun.com/)| 即将推出 | 即将推出|
| [得到学习助手](https://ai.dedao.cn/) | 即将推出 | 无 API |
| [讯飞星火](http://xinghuo.xfyun.cn/) | 支持     | 即将推出|

更多...

### 其他功能

* 使用您自己的 AI 机器人帐号登录，或您自己的 API token
* 自动保持 ChatGPT 不掉线
* 批处理模式，不需要等待前面的请求完成，就可以发下一条指令
* 随时启用/禁用任何机器人
* 在一列、两列或三列视图之间切换
* 支持多种语言（中文，英文）
* [TODO] 推荐最佳答案

## 先决条件

ChatALL 是一个客户端，而不是代理。因此，您必须：

1. 拥有有效帐号或 API token。
2. 与 AI 网站有可靠的网络连接。
3. 如果是通过 VPN 访问，那么必须设置为系统/全局代理。

## 下载 / 安装

从 https://github.com/sunner/ChatALL/releases 下载

### Windows 系统

直接下载 *-win-x64.exe （多数情况下） 或 *-win-arm64.exe 安装文件并运行之。

### macOS 系统

对于苹果硅芯片 Mac（M1，M2 CPU），请下载 *-mac-arm64.dmg 文件。

对于其他 Mac，下载 *-mac-x64.dmg 文件。

### Linux 系统

下载 .AppImage 文件，将其设置为可执行，然后双击就可运行。

## 给开发者

### Run

```bash
npm install
npm run electron:serve
```

### Build

为您当前的平台构建：
```bash
npm run electron:build
```

为所有平台构建：
```bash
npm run electron:build -- -wml --x64 --arm64
```

###  致谢

* GPT-4 贡献了大部分代码
* ChatGPT，Bing Chat 和 Google 提供了许多解决方案（排名分先后）
* 受 [ChatHub](https://github.com/chathub-dev/chathub) 启发。致敬！
