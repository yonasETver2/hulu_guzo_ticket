
export const HandleLanguageChange = (setStatus, lang) => {
  setStatus((prevStatus) => ({
    ...prevStatus,
    setting: {
      ...prevStatus.setting,
      lang: lang,
    },
  }));
};