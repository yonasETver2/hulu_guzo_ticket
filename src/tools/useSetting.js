import { useEffect } from "react";

const defaultSetting = {
  theme: "light",
  lang: "en",
};

const checkRetrivedSettings = (retrievedSettings) => {
  if (
    retrievedSettings.theme !== "light" &&
    retrievedSettings.theme !== "dark"
  ) {
    retrievedSettings.theme = defaultSetting.theme;
  }
  if (retrievedSettings.lang !== "en" && retrievedSettings.lang !== "am") {
    retrievedSettings.lang = defaultSetting.lang;
  }
  return retrievedSettings;
};

export function useSetting(status, setStatus) {
  useEffect(() => {
    if (status.setting.lang === null) {
      const storedData = localStorage.getItem("settings");
      let retrievedSettings;
      try {
        retrievedSettings = JSON.parse(storedData);
        if (retrievedSettings === null) {
          retrievedSettings = defaultSetting;
        }
      } catch (error) {
        retrievedSettings = defaultSetting;
      }
      retrievedSettings = checkRetrivedSettings(retrievedSettings);
      setStatus((prevStatus) => ({
        ...prevStatus,
        setting: retrievedSettings,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (status.setting.lang !== null) {
      const settingsString = JSON.stringify(status.setting);
      localStorage.setItem("settings", settingsString);
    }
  }, [status.setting]); // eslint-disable-line react-hooks/exhaustive-deps
}
