同行 · CFA 会员社区 Demo
导出日期：2026-10-23
来源：现有 CFA 社区 Demo 源码，Sites 最新版本编号 8。

一、在电脑上直接查看
1. 将整个 ZIP 压缩包解压到同一个文件夹。
2. 用 Chrome 或 Edge 打开 index.html。
3. 请保留全部 JS 和 CSS 文件，不要只复制 index.html。
本版本所有网页资源均为本地文件，不需要登录 ChatGPT，也不需要安装 Node.js 或运行构建命令。

二、通过 GitHub Pages 发布
1. 新建 GitHub 仓库，例如 cfa-community-demo。GitHub Free 可使用公开仓库发布 Pages。
2. 将解压文件夹中的 index.html、所有 .js/.css 文件，以及 .nojekyll 上传到仓库根目录。
   注意：上传的是文件夹内的文件，不能只上传 ZIP，也不要把 index.html 再套一层目录。
3. 打开仓库 Settings → Pages。
4. 在 Build and deployment 下，将 Source 设为 Deploy from a branch。
5. Branch 选 main，文件夹选 / (root)，点击 Save。
6. 等待 GitHub 显示发布成功，从 Pages 页面复制最终网站链接。
   项目网址通常为：https://你的用户名.github.io/cfa-community-demo/
7. 用国内手机流量、Wi-Fi 及微信内置浏览器测试页面是否完整加载。
GitHub Pages 国内可达性需要实测，导出或发布本身不代表访问稳定。
GitHub 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

三、交给开发商部署
将整个 ZIP 发给开发商，说明这是无需构建的静态网站。
以 index.html 为入口，所有 JS/CSS 与它保持同级。可部署到现有静态网站托管环境。
所有资源使用相对路径，可放在网站根目录或子目录。

四、演示范围
这是交互原型，会员资料、活动、聊天、群聊、附近同行等均用于演示。
导出文件不提供真实身份核验、即时通讯服务器、会员数据库或实时定位服务。
演示操作不代表真实报名或发送消息；页面刷新后可能恢复初始演示状态。
公开发布后，访问者可以查看网页资源及其中的示例数据，请继续仅使用虚构资料。

五、文件说明
index.html：网页入口
style.css、cfa-brand.css：样式文件
app.js、community-v2.js、friend-invitation.js、connections.js：交互源码
.nojekyll：GitHub Pages 静态文件标记（部分系统会隐藏此文件）
README_部署说明.txt：本说明

六、本次验证
已检查 JavaScript 语法、HTML 引用的本地资源是否齐全、资源相对路径及打包完整性。
本次导出保留原有网页文件，不改动线上 Demo；未执行 GitHub 部署或国内网络实测，也未进行浏览器交互回归测试。
