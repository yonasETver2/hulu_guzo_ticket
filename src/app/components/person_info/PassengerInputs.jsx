const PassengerInputs = ({
  status,
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  sex,
  setSex,
  phone,
  setPhone,
  nationalID,
  setNationalID,
}) => {
  return (
    <div
      className={`w-full md:w-[70%] md:border-r-1 border-b-1 border-gray-300 py-4 ${
        status.setting?.theme === "light" ? "bg-white" : "bg-gray-500"
      } px-2 rounded-md space-y-2`}
    >
      {/* First Name */}
      <div>
        <label htmlFor="fName" className="cursor-pointer">
          {status.setting?.lang === "en" ? "First Name" : "የመጀመሪያ ስም"}
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder={
            status.setting?.lang === "en"
              ? "Enter first name"
              : "የመጀመሪያ ስም ያስገቡ"
          }
        />
      </div>

      {/* Middle Name */}
      <div>
        <label htmlFor="mName" className="cursor-pointer">
          {status.setting?.lang === "en" ? "Middle Name" : "የአባት ስም"}
        </label>
        <input
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          id="mName"
          className="w-full border p-2 rounded"
          placeholder={
            status.setting?.lang === "en"
              ? "Enter middle name"
              : "የአባት ስም ያስገቡ"
          }
        />
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lName" className="cursor-pointer">
          {status.setting?.lang === "en" ? "Last Name" : "የአያት ስም"}
        </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          id="lName"
          className="w-full border p-2 rounded"
          placeholder={
            status.setting?.lang === "en"
              ? "Enter last name"
              : "የአያት ስም ያስገቡ"
          }
        />
      </div>

      {/* Sex */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sex" className="cursor-pointer">
          {status.setting?.lang === "en" ? "Sex" : "ፃታ"}
        </label>
        <div className="flex space-x-4 mt-1">
          <label>
            <input
              id="sex"
              type="radio"
              value="male"
              checked={sex === "male"}
              onChange={() => setSex("male")}
              className="mr-1 cursor-pointer"
            />
            {status.setting?.lang === "en" ? "Male" : "ወንድ"}
          </label>
          <label>
            <input
              type="radio"
              value="female"
              checked={sex === "female"}
              onChange={() => setSex("female")}
              className="mr-1 cursor-pointer"
            />
            {status.setting?.lang === "en" ? "Female" : "ሴት"}
          </label>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="cursor-pointer">
          {status.setting?.lang === "en" ? "Phone" : "ስልክ"}
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          id="phone"
          className="w-full border p-2 rounded"
          type="number"
          placeholder={
            status.setting?.lang === "en"
              ? "Enter phone number"
              : "ስልክ ቁጥር ያስገቡ"
          }
        />
      </div>

      {/* National ID */}
      <div>
        <label htmlFor="nID" className="cursor-pointer">
          {status.setting?.lang === "en" ? "National ID" : "ብሄራዊ መለያ"}
        </label>
        <input
          value={nationalID}
          onChange={(e) => setNationalID(e.target.value)}
          id="nID"
          className="w-full border p-2 rounded"
          type="text"
          placeholder={
            status.setting?.lang === "en"
              ? "Enter FIN number"
              : "የፋይዳ ቁጥር ያስገቡ"
          }
        />
      </div>
    </div>
  );
};

export default PassengerInputs;
