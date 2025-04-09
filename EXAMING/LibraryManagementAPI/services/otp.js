const sendOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP: ${otp}`); 
    return otp;
  };
  
  const verifyOtp = (sentOtp, receivedOtp) => sentOtp === receivedOtp;
  
  module.exports = { sendOtp, verifyOtp };