export function OtpSection({
  otp,
  setOtp,
  resendCountdown,
  sendOtp,
}: any) {
  return (
    <>
      <input
        className="block border border-gray-400 rounded-md w-full p-1"
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <div className="flex justify-center mt-1 mb-1">
        <button
          type="button"
          onClick={sendOtp}
          disabled={resendCountdown > 0}
          className={`text-[#5376f6] font-bold cursor-pointer hover:text-[#5376f6a0] ${
            resendCountdown > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {resendCountdown > 0
            ? `Resend OTP in ${resendCountdown}s`
            : "Resend OTP"}
        </button>
      </div>
    </>
  );
}
