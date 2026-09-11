# 🎮 PX Scripts - FiveM Server Website Template

A modern, responsive, and feature-rich FiveM server website template designed for professional servers. This template provides everything you need to showcase your FiveM server with live player statistics, comprehensive information pages, and a sleek user interface.

## ✨ Features

### 🎯 **Core Functionality**
- **Live Server Status**: Real-time player count and player list from FiveM API
- **Dynamic Server ID**: Configurable via URL parameters or server configuration
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Cross-Browser Compatible**: Works on all modern browsers

### 🎨 **Design & Styling**
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Custom Animations**: Smooth hover effects and page transitions
- **Dark Theme**: Professional dark color scheme optimized for gaming
- **Font Awesome Icons**: Comprehensive icon library for enhanced UI
- **Animate.css**: CSS animation library for engaging interactions

### 📱 **Pages & Sections**
- **Homepage**: Hero section, server stats, and quick navigation
- **About Us**: Server story, mission, vision, and team information
- **Rules**: Server rules and guidelines with detailed rulebook
- **Join Us**: Connection instructions and requirements
- **Membership**: Premium pass options and benefits
- **404 Error**: Custom error page with navigation

### 🔧 **Technical Features**
- **FiveM API Integration**: Live server data from `servers-frontend.fivem.net`
- **Express.js Server**: Simple Node.js server for local development
- **Static File Serving**: Optimized for deployment on any hosting platform
- **SEO Optimized**: Meta tags and semantic HTML structure
- **Performance Optimized**: Fast loading times and efficient resource usage

## 📁 File Structure

```
fivem-web-template/
├── 📄 index.html                 # Main homepage
├── 📄 404.html                   # Custom error page
├── 📄 server.js                  # Express.js development server
├── 📄 .htaccess                  # Apache configuration for production
├── 📄 _redirects                 # Netlify redirects configuration
├── 📄 logo (transparent).png     # Main logo
├── 📄 logo with text (transparent).png  # Logo with text
├── 📄 styles.css                 # Custom CSS styles and animations
├── 📄 script.js                  # General JavaScript functionality
├── 📄 server-status.js           # FiveM server status integration
└── 📁 pages/                     # Additional website pages
    ├── 📄 about.html             # About Us page
    ├── 📄 join.html              # Join/Connect page
    ├── 📄 rules.html             # Server rules overview
    ├── 📄 rulebook.html          # Detailed rulebook
    └── 📄 membership.html        # Membership passes page
```

## 🚀 Quick Start

### **1. Basic Setup**
1. **Clone or Download** the template files
2. **Upload** to your web hosting provider
3. **Configure** your server ID (see configuration section)
4. **Customize** content and branding
5. **Deploy** and share your website

### **2. Local Development**
```bash
# Navigate to project directory
cd fivem-web-template


# Start local development server
open the index.html on Browser   

# Open browser to http://localhost:3000
```

### **3. Production Deployment**
- **Traditional Hosting**: Upload all files via FTP/SFTP
- **GitHub Pages**: Push to repository and enable Pages
- **Netlify**: Drag and drop folder or connect Git repository
- **Vercel**: Import project and deploy automatically

## ⚙️ Configuration

### **Server ID Setup**

#### **Method : Edit server-status.js**
```javascript
// In server-status.js, line 3
const SERVER_ID = 'your-server-id-here';
```

### **Customization Options**

#### **Branding Changes**
- **Logo**: Replace `logo (transparent).png` with your own
- **Server Name**: Update titles in all HTML files
- **Colors**: Modify CSS variables in `styles.css`
- **Content**: Edit text content in HTML files

#### **Server Information**
- **Server IP**: Update connection links
- **Discord**: Add your Discord server invite
- **Social Media**: Update social media links
- **Rules**: Customize server rules and guidelines

## 🎨 Customization Guide

### **Changing Colors**
The template uses a blue color scheme. To change colors:

1. **Primary Colors**: Edit `styles.css` color variables
2. **Tailwind Classes**: Replace `blue-` classes with your preferred colors
3. **Custom CSS**: Modify gradient and shadow colors

### **Adding New Pages**
1. **Create HTML file** in `pages/` directory
2. **Copy header/footer** from existing pages
3. **Update navigation** in all page headers
4. **Add page link** to mobile menu

### **Modifying Server Status**
- **API Endpoint**: Change in `server-status.js`
- **Update Frequency**: Modify refresh intervals
- **Data Display**: Customize player information shown

## 🌐 Deployment Options

### **GitHub Pages**
1. **Create Repository** on GitHub
2. **Upload Files** to repository
3. **Enable Pages** in repository settings
4. **Set Source** to main branch
5. **Access** via `username.github.io/repository-name`

### **Netlify**
1. **Drag & Drop** project folder to Netlify
2. **Set Build Command** (leave empty for static sites)
3. **Set Publish Directory** (leave as root)
4. **Deploy** and get live URL

### **Traditional Hosting**
1. **Upload Files** via FTP/SFTP
2. **Ensure** `.htaccess` is uploaded
3. **Test** all pages and functionality
4. **Configure** domain and SSL

## 🔧 Troubleshooting

### **Common Issues**

#### **Server Status Not Loading**
- Check if server ID is correct
- Verify FiveM server is online
- Check browser console for errors
- Ensure CORS is not blocking requests

#### **Images Not Displaying**
- Verify image file paths are correct
- Check file permissions on server
- Ensure image files are uploaded

#### **Mobile Menu Not Working**
- Check if `script.js` is loaded
- Verify JavaScript console for errors
- Test on different mobile devices

#### **Connect Link Not Working**
- Ensure server ID is properly configured
- Check if FiveM client is installed
- Verify URL parameter format

### **Browser Compatibility**
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## 📱 Mobile Optimization

### **Responsive Features**
- **Mobile-First Design**: Optimized for small screens
- **Touch-Friendly**: Large touch targets and gestures
- **Fast Loading**: Optimized images and resources
- **Mobile Menu**: Collapsible navigation for mobile devices

### **Performance Tips**
- **Optimize Images**: Use WebP format when possible
- **Minimize CSS/JS**: Remove unused styles and scripts
- **Enable Compression**: Use Gzip compression on server
- **CDN Usage**: Serve static assets from CDN


## 🤝 Support & Contributing

### **Getting Help**
- **Check Issues**: Look for similar problems in repository
- **Documentation**: Review this README thoroughly
- **Community**: Ask questions in FiveM community forums

### **Contributing**
1. **Fork** the repository
2. **Create** feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** pull request

## 📄 License

This template is provided by **PX Scripts** for free use and modification. You are free to:

- ✅ Use for personal and commercial projects
- ✅ Modify and customize as needed
- ✅ Distribute modified versions
- ✅ Use for client projects

**Attribution**: While not required, credit to PX Scripts is appreciated.

## 🔗 Useful Links

- **FiveM Official**: https://fivem.net
- **FiveM API Documentation**: https://docs.fivem.net
- **Tailwind CSS**: https://tailwindcss.com
- **Font Awesome**: https://fontawesome.com
- **Animate.css**: https://animate.style

## 📞 Contact

- **Developer**: PX Scripts
- **Template**: FiveM Server Website Template
- **Version**: 1.0.0
- **Last Updated**: Aug 2025
- Discord: [PX Scripts](https://discord.gg/EvnYVr4S7Y)
- Tebex Store: [Tebex](https://px-scripts.tebex.io/)

---

**Made with ❤️ by PX Scripts for the FiveM community**

*This template provides a solid foundation for your FiveM server website. Customize it to match your server's unique identity and requirements.*

---

## 🚧 Coming Soon: React.js Version!

A modern FiveM website template built with **React.js** is in the works. Stay connected for updates and feel free to share your suggestions or feature requests!

- **React.js template coming soon**
- **Your feedback is welcome!**

Follow this repository or join our Discord to stay updated.