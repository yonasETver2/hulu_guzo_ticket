"use client";
import { useState, useEffect, useRef } from "react";
import { useAnimation } from "framer-motion";
import { useGlobalState } from "@/app/globalContext/GlobalState";

export function useHomePageState() {
  const { status } = useGlobalState();

  /** ------------------ STATES ------------------ **/
  const [exchange, setExchnage] = useState(false);
  const [exHover, setExHover] = useState(false);
  const [singleTrip, setSingleTrip] = useState(false);
  const [roundTrip, setRoundTrip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCity") || "";
    }
    return "";
  });
  const [allClick, setAllClick] = useState(true);
  const [fav, setFav] = useState(false);
  const [search, setSearch] = useState(false);
  const [star, setStar] = useState(false);
  const [isOpenTwo, setIsOpenTwo] = useState(false);
  const [selectedCityTwo, setSelectedCityTwo] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCityTwo") || "";
    }
    return "";
  });
  const [selectedCityAmh, setSelectedCityAmh] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCityAmh") || "";
    }
    return "";
  });
  const [selectedCityTwoAmh, setSelectedCityTwoAmh] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCityTwoAmh") || "";
    }
    return "";
  });
  const [allClickTwo, setAllClickTwo] = useState(true);
  const [favTwo, setFavTwo] = useState(false);
  const [searchTwo, setSearchTwo] = useState(false);
  const [starTwo, setStarTwo] = useState(false);
  const [oneWay, setOneWay] = useState(true);
  const [roundTripClick, setRoundTripClick] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("roundTripClick") === "true" || false;
    }
    return false;
  });
  const [numberPassengerFirst, setNumberPassengerFirst] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("numberPassengerFirst")) || 1;
    }
    return 1;
  });
  const [numberPassengerRound, setNumberPassengerRound] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("numberPassengerRound")) || 1;
    }
    return 1;
  });
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [errors, setErrors] = useState({});
  type CityOption = {
    en: string;
    am: string;
    option: string;
  };
  const [cityList, setCityList] = useState<CityOption[]>([]);

  const [oneWayDate, setOneWayDate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("oneWayDate") ||
        new Date().toISOString().split("T")[0]
      );
    }
    return new Date().toISOString().split("T")[0];
  });
  const [roundDate, setRoundDate] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("roundDate") ||
        new Date().toISOString().split("T")[0]
      );
    }
    return new Date().toISOString().split("T")[0];
  });

  type City = { en: string; am: string };
  const [searchedDepartureCities, setSearchedDepartureCities] = useState<
    City[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("searchedDepartureCities");
      return saved
        ? (JSON.parse(saved) as City[]).filter((c) => c && c.en && c.am)
        : [];
    }
    return [];
  });

  const [searchedDestinationCities, setSearchedDestinationCities] = useState<
    City[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("searchedDestinationCities");
      return saved
        ? (JSON.parse(saved) as City[]).filter((c) => c && c.en && c.am)
        : [];
    }
    return [];
  });

  //favorite city for source
  const [favoriteCities, setFavoriteCities] = useState<City[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favoriteCities");
      return saved ? (JSON.parse(saved) as City[]) : [];
    }
    return [];
  });

  //favorite city for destination
  const [favoriteCitiesTwo, setFavoriteCitiesTwo] = useState<City[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favoriteCitiesTwo");
      return saved ? (JSON.parse(saved) as City[]) : [];
    }
    return [];
  });

  const [providers, setProviders] = useState<
    { transporter_name: string; transporter_name_amh: string; phone: string }[]
  >([]);

  /** ------------------ REFS ------------------ **/
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const phoneRef = useRef(null);
  const x = useRef(0);
  const hasMounted = useRef(false);

  /** ------------------ ANIMATION ------------------ **/
  const controls = useAnimation();
  const [direction, setDirection] = useState("left");

  //image for ad
  const images = [
    "/assets/images/ad1.jpg",
    "/assets/images/ad2.jpg",
    "/assets/images/ad3.jpg",
    "/assets/images/ad4.jpg",
    "/assets/images/ad5.jpg",
    "/assets/images/ad6.jpg",
    "/assets/images/ad7.jpg",
    "/assets/images/ad8.jpg",
  ];

  /** ------------------ EFFECTS ------------------ **/
  useEffect(() => {
    localStorage.setItem(
      "searchedDepartureCities",
      JSON.stringify(searchedDepartureCities)
    );
  }, [searchedDepartureCities]);

  useEffect(() => {
    localStorage.setItem(
      "searchedDestinationCities",
      JSON.stringify(searchedDestinationCities)
    );
  }, [searchedDestinationCities]);

  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCity);
    localStorage.setItem("selectedCityAmh", selectedCityAmh);
  }, [selectedCity, selectedCityAmh]);

  useEffect(() => {
    localStorage.setItem("selectedCityTwo", selectedCityTwo);
    localStorage.setItem("selectedCityTwoAmh", selectedCityTwoAmh);
  }, [selectedCityTwo, selectedCityTwoAmh]);

  useEffect(() => {
    localStorage.setItem("oneWayDate", oneWayDate);
  }, [oneWayDate]);

  useEffect(() => {
    localStorage.setItem("roundDate", roundDate);
  }, [roundDate]);

  useEffect(() => {
    localStorage.setItem(
      "numberPassengerFirst",
      numberPassengerFirst.toString()
    );
  }, [numberPassengerFirst]);

  useEffect(() => {
    localStorage.setItem(
      "numberPassengerRound",
      numberPassengerRound.toString()
    );
  }, [numberPassengerRound]);

  useEffect(() => {
    localStorage.setItem("roundTripClick", roundTripClick.toString());
  }, [roundTripClick]);

  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  useEffect(() => {
    localStorage.setItem(
      "favoriteCitiesTwo",
      JSON.stringify(favoriteCitiesTwo)
    );
  }, [favoriteCitiesTwo]);

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch("/api/getCities");
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const cityOptions = data.map((city: any) => ({
          en: city.city_name,
          am: city.city_name_amh,
          option:
            status.setting?.lang === "en" ? city.city_name : city.city_name_amh,
        }));
        setCityList(cityOptions);
      } catch (err) {
        console.error(err);
      }
    }
    loadCities();
  }, [status.setting?.lang]);

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/getProviderNamePhone");
        const data = await res.json();
        if (Array.isArray(data)) setProviders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProviders();
  }, []);

  return {
    // states
    exchange,
    setExchnage,
    exHover,
    setExHover,
    singleTrip,
    setSingleTrip,
    roundTrip,
    setRoundTrip,
    isOpen,
    setIsOpen,
    selectedCity,
    setSelectedCity,
    allClick,
    setAllClick,
    fav,
    setFav,
    search,
    setSearch,
    star,
    setStar,
    isOpenTwo,
    setIsOpenTwo,
    selectedCityTwo,
    setSelectedCityTwo,
    selectedCityAmh,
    setSelectedCityAmh,
    selectedCityTwoAmh,
    setSelectedCityTwoAmh,
    allClickTwo,
    setAllClickTwo,
    favTwo,
    setFavTwo,
    searchTwo,
    setSearchTwo,
    starTwo,
    setStarTwo,
    oneWay,
    setOneWay,
    roundTripClick,
    setRoundTripClick,
    numberPassengerFirst,
    setNumberPassengerFirst,
    numberPassengerRound,
    setNumberPassengerRound,
    phoneOpen,
    setPhoneOpen,
    errors,
    setErrors,
    cityList,
    setCityList,
    oneWayDate,
    setOneWayDate,
    roundDate,
    setRoundDate,
    searchedDepartureCities,
    setSearchedDepartureCities,
    searchedDestinationCities,
    setSearchedDestinationCities,
    favoriteCities,
    setFavoriteCities,
    favoriteCitiesTwo,
    setFavoriteCitiesTwo,
    providers,
    setProviders,
    // refs
    fromRef,
    toRef,
    phoneRef,
    x,
    hasMounted,
    // animation
    controls,
    direction,
    setDirection,
    images,
  };
}
