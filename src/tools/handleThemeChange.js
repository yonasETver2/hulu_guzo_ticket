
export const HandleThemeChange = (setStatus, theme) => {
  setStatus((prevStatus) => ({
    ...prevStatus,
    setting: {
      ...prevStatus.setting,
      theme: theme,
    },
  }));
};