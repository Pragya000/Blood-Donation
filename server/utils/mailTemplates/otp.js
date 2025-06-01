/* eslint-disable no-undef */
export default function otpTemplate(otp, type) {
    const title = type === "signup" ? "Welcome to Blood Connect" : "Reset Password";
    const message =
      type === "signup" ? "OTP for Signup" : "OTP for Reset Password";
    const bodyMessage =
      type === "signup"
        ? `Thank you for registering with Blood Connect. To complete your registration, please use the following OTP
      (One-Time Password) to verify your account:`
        : "Please use the following OTP (One-Time Password) to reset your password:";
    const url = process.env.NODE_ENV === "production" ? "https://bloodconnectmain.vercel.app" : "http://localhost:5173";
  
    return `<!DOCTYPE html>
      <html>
      
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
              body {
                  background-color: #ffffff;
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.4;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  text-align: center;
              }
      
              .logo {
                  max-width: 200px;
                  margin-bottom: 20px;
              }
      
              .message {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 20px;
              }
      
              .body {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
      
              .support {
                  font-size: 14px;
                  color: #999999;
                  margin-top: 20px;
              }
      
              .highlight {
                  font-weight: bold;
              }
          </style>
      
      </head>
      <body>
          <div class="container">
              <a href=${url}><img class="logo"
                      src="https://res.cloudinary.com/dmavhhdac/image/upload/v1701079210/blood-connect/logo_mcyl3t.png" alt="Blood Connect"></a>
              <div class="message">${message}</div>
              <div class="body">
                  <p>Dear User,</p>
                  <p>${bodyMessage}</p>
                  <h2 class="highlight">${otp}</h2>
                  <p>This OTP is valid for 5 minutes. If you did not request this, please disregard this email.</p>
              </div>
              <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                      href="mailto:soumyabanerjeedev@gmail.com">soumyabanerjeedev@gmail.com</a>. We are here to help!</div>
          </div>
      </body>
      
      </html>`;
  }
  