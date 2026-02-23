# Security Best Practices for Production

## 🔒 Environment Variables

### Never Commit These to Git
- `.env` files are in `.gitignore`
- Use platform-specific environment variable management
- Rotate secrets regularly

### Generate Strong Secrets

#### JWT Secret (Backend)
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use openssl
openssl rand -base64 32
```

Example output: `aB3kL9mP2qW5xZ8yR6tN4jH7vC1dF0sG`

---

## 🛡️ MongoDB Security

### 1. Use Strong Passwords
```
Username: stockapp
Password: Use a strong 20+ character password
```

### 2. Network Access
**Development:** Allow all (0.0.0.0/0)  
**Production:** Restrict to your server IPs

```
Render IP ranges: 
- 3.128.0.0/9
- 35.156.0.0/14
(Or use 0.0.0.0/0 and rely on strong password)
```

### 3. Enable Monitoring
- Go to MongoDB Atlas → Metrics
- Set up alerts for unusual activity

---

## 🔐 Backend Security

### Recommended Additions

Add these packages to `backend/package.json`:

```json
{
  "dependencies": {
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-mongo-sanitize": "^2.2.0"
  }
}
```

### Update `backend/server.js`:

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Security middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Stricter rate limit for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

---

## 🌐 CORS Configuration

### Development (Allow All)
```javascript
app.use(cors({
  origin: '*',
  credentials: true
}));
```

### Production (Restrict Origins)
```javascript
const allowedOrigins = [
  'https://your-app.vercel.app',
  'https://www.your-domain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 🔑 JWT Token Security

### Current Implementation (Good)
```javascript
// Token expires in 30 days
jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
```

### Enhanced Security (Better)
```javascript
// Shorter expiration
jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // 7 days
)
```

### Add Refresh Tokens (Best)
Implement refresh token mechanism for longer sessions

---

## 🚫 Don't Expose Sensitive Data

### Current Response (Check)
```javascript
// Don't send password in responses
const user = await User.findOne({ email }).select('-password');
```

### Error Messages
Don't reveal detailed errors in production:

```javascript
// backend/server.js
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Internal server error' });
  } else {
    res.status(500).json({ 
      message: err.message,
      stack: err.stack 
    });
  }
});
```

---

## 📝 Environment Variable Checklist

### Backend
- [ ] `MONGO_URI` - Uses MongoDB Atlas, not localhost
- [ ] `JWT_SECRET` - Strong random string (32+ chars)
- [ ] `ML_SERVICE_URL` - HTTPS URL (not http)
- [ ] `FRONTEND_URL` - Exact Vercel URL
- [ ] `NODE_ENV` - Set to `production`

### Frontend
- [ ] `VITE_API_URL` - HTTPS backend URL

### ML Service
- [ ] `PORT` - Set by platform
- [ ] No sensitive data stored

---

## 🔍 Security Audit Checklist

Before going live:

### Authentication
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens expire
- [ ] JWT secret is strong and unique
- [ ] Login rate limiting enabled

### Database
- [ ] MongoDB uses authentication
- [ ] Connection string is in environment variables
- [ ] Network access is restricted (or uses strong password)
- [ ] Data sanitization enabled (mongo-sanitize)

### API
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak information

### Frontend
- [ ] Environment variables don't contain secrets
- [ ] API calls use HTTPS
- [ ] Tokens stored securely (localStorage)
- [ ] Logout clears all user data

### HTTPS
- [ ] All services use HTTPS (automatic on Vercel/Render)
- [ ] No mixed content warnings
- [ ] Cookies use secure flag (if using cookies)

---

## 🚨 Common Security Mistakes

### ❌ Don't Do This
```javascript
// Hardcoded secrets
const JWT_SECRET = 'mysecret123';

// Allow all origins in production
app.use(cors({ origin: '*' }));

// No rate limiting
// No input validation
// Detailed error messages in production
```

### ✅ Do This
```javascript
// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Restricted CORS
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Rate limiting
app.use('/api/', limiter);

// Generic errors in production
if (process.env.NODE_ENV === 'production') {
  res.status(500).json({ message: 'Error' });
}
```

---

## 📊 Monitoring & Logging

### Set Up Monitoring
1. **Render Metrics** - Built-in on Render dashboard
2. **MongoDB Atlas Monitoring** - Check database metrics
3. **Vercel Analytics** - Track frontend performance

### Error Tracking
Use Sentry or similar:
```bash
npm install @sentry/node @sentry/react
```

---

## 🔄 Regular Maintenance

### Security Updates
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Rotate Secrets
- Change JWT_SECRET every 6 months
- Update MongoDB password regularly
- Rotate API keys

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Remember:** Security is an ongoing process, not a one-time setup!
