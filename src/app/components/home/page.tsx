"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { CityInput } from "./city/CityInput";
import { ExchangeButton } from "./exchange/ExchangeButton";
import ActionButtons from "../commonComponent/TopActionBar/ActionButtons";
import TripDatePassenger from "./TripDatePassenger";
import TripTypeSelector from "./TripTypeSelector";
import TripSearchButton from "./TripSearchButton";
import { useHomePageState } from "./hooks/useHomePageState";

function HomePage() {
  //states
  const { status } = useGlobalState();
  const router = useRouter();
  const {
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
    setErrors,
    cityList,
    oneWayDate,
    setOneWayDate,
    roundDate,
    setRoundDate,
    searchedDepartureCities,
    searchedDestinationCities,
    favoriteCities,
    setFavoriteCities,
    favoriteCitiesTwo,
    setFavoriteCitiesTwo,
    providers,
    fromRef,
    toRef,
    controls,
    images,
  } = useHomePageState();

  const handlePhoneClick = () => {
    setPhoneOpen(!phoneOpen);
  };

  const handelFromFocus = () => {
    setIsOpen(true);
    setIsOpenTwo(false);
  };

  //city type
  type City = {
    en: string;
    am: string;
    option?: string; // ✅ optional now
  };

  const handelStar = () => setStar(!star);

  const toggleFavorite = (city: City) => {
    handelStar();
    setFavoriteCities((prev) => {
      if (prev.some((c) => c.en === city.en)) {
        return prev.filter((c) => c.en !== city.en); // remove
      } else {
        return [...prev, city]; // add
      }
    });
  };

  const toggleFavoriteTwo = (city: City) => {
    handelStarTwo();
    setFavoriteCitiesTwo((prev) => {
      if (prev.some((c) => c.en === city.en)) {
        return prev.filter((c) => c.en !== city.en);
      } else {
        return [...prev, city];
      }
    });
  };

  const handelAll = () => {
    setAllClick(true);
    setFav(false);
    setSearch(false);
  };

  const handelFav = () => {
    setAllClick(false);
    setFav(true);
    setSearch(false);
  };

  const handelSearch = () => {
    setAllClick(false);
    setFav(false);
    setSearch(true);
  };

  const handelStarTwo = () => setStarTwo(!starTwo);
  const handelAllTwo = () => {
    setAllClickTwo(true);
    setFavTwo(false);
    setSearchTwo(false);
  };

  const handelFavTwo = () => {
    setAllClickTwo(false);
    setFavTwo(true);
    setSearchTwo(false);
  };

  const handelSearchTwo = () => {
    setAllClickTwo(false);
    setFavTwo(false);
    setSearchTwo(true);
  };

  const handelExClick = () => {
    setExchnage(!exchange);
    if (exchange === true) {
      setSelectedCity(selectedCityTwo);
      setSelectedCityTwo(selectedCity);
    } else {
      setSelectedCity(selectedCityTwo);
      setSelectedCityTwo(selectedCity);
    }
  };
  const handelExHover = () => setExHover(!exHover);
  const handel_single_tript = () => setSingleTrip(!singleTrip);
  const handel_round_tript = () => setRoundTrip(!roundTrip);

  // ✅ Only take a city object
  const handelCity = (cityItem: City) => {
    if (cityItem.en === selectedCityTwo || cityItem.am === selectedCityTwoAmh) {
      alert(
        status.setting?.lang === "en"
          ? "Departure and Destination cannot be the same city"
          : "መነሻ እና መዳረሻ ተመሳሳይ ከተማ መሆን የለበትም"
      );
      return;
    }

    setSelectedCity(cityItem.en);
    setSelectedCityAmh(cityItem.am);
    setIsOpen(false);
  };

  const handelCityTwo = (cityItem: City) => {
    if (cityItem.en === selectedCity || cityItem.am === selectedCityAmh) {
      alert(
        status.setting?.lang === "en"
          ? "Departure and Destination cannot be the same city"
          : "መነሻ እና መዳረሻ ተመሳሳይ ከተማ መሆን የለበትም"
      );
      return;
    }

    setSelectedCityTwo(cityItem.en);
    setSelectedCityTwoAmh(cityItem.am);
    setIsOpenTwo(false);
  };

  const handelToFocus = () => {
    setIsOpen(false);
    setIsOpenTwo(true);
  };

  const handelOneWayDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOneWayDate(event.target.value);
    setRoundDate(event.target.value);
  };
  const handelRoundDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoundDate(event.target.value);
  };

  const handelNumberPassenger = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setNumberPassengerFirst(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("numberPassengerFirst", value.toString());
    }
  };

  const handelNumberPassengerRound = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setNumberPassengerRound(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("numberPassengerRound", value.toString());
    }
  };

  const handelOneWay = () => {
    setOneWay(true);
    setRoundTripClick(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("roundDate");
      localStorage.removeItem("numberPassengerRound");
      localStorage.removeItem("passengersRoundTrip"); // ✅ Clear round trip passenger info
      localStorage.setItem("roundTripClick", "false");
    }
  };

  const handelRoundTripClick = () => {
    setOneWay(false);
    setRoundTripClick(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("roundTripClick", "true");
    }
  };

  //validate
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (selectedCity.trim() === "") {
      newErrors.selectedCity =
        status.setting?.lang === "en"
          ? "Departure city can not be empty, "
          : "መነሻ ከተማ ባዶ መሆን የለበትም";
    }
    if (selectedCityTwo.trim() === "") {
      newErrors.selectedCityTwo =
        status.setting?.lang === "en"
          ? "Destination city can not be empty, "
          : "መዳረሻ ከተማ ባዶ መሆን የለበትም";
    }

    // today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse one-way and round dates safely
    const oneWay = oneWayDate ? new Date(oneWayDate) : null;
    const round = roundDate ? new Date(roundDate) : null;

    if (oneWay && oneWay < today) {
      newErrors.oneWayDate =
        status.setting?.lang === "en"
          ? "First trip date can not be before today, "
          : "የመጀመሪያው የመጓጓዣ ቀን ከዛሬ በፊት መሆን የለበትም";
    }

    if (numberPassengerFirst <= 0 || numberPassengerFirst > 65) {
      newErrors.numberPassengerFirst =
        status.setting?.lang === "en"
          ? "First trip number of passenger must be between 1–65, "
          : "የመጀመሪያ ጉዞ ተሳፋሪ ቁጥር ከ1–65 መሆን አለበት";
    }

    if (roundTripClick) {
      if (round && oneWay && round < oneWay) {
        newErrors.roundDate =
          status.setting?.lang === "en"
            ? "Round trip date can not be less than first trip date, "
            : "የመመለሻ ጉዞ ቀን ከመጀመሪያው ጉዞ ቀን ማነስ የለበትም";
      }

      if (numberPassengerRound <= 0 || numberPassengerRound > 65) {
        newErrors.numberPassengerRound =
          status.setting?.lang === "en"
            ? "Round trip number of passenger must be between 1–65, "
            : "የመመለሻ ጉዞ ተሳፋሪ ቁጥር ከ1–65 መሆን አለበት";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const errorMessage = Object.values(newErrors)
        .join(" ")
        .replace(/,\s*$/, "");
      alert(errorMessage);
      return false;
    }

    return true;
  };

  // In search page
  const handleSearchClick = async () => {
    const tripType = roundTripClick ? "two-way" : "one-way";

    if (!validate()) return;

    try {
      const bodyData: any = {
        sourceCityFirst: selectedCity,
        destinationCityFirst: selectedCityTwo,
        dateFirst: oneWayDate,
        passengerCountFirst: numberPassengerFirst,
      };

      // ✅ Only add round trip details if selected
      if (roundTripClick) {
        bodyData.sourceCityRound = selectedCityTwo;
        bodyData.destinationCityRound = selectedCity;
        bodyData.dateRound = roundDate;
        bodyData.passengerCountRound = numberPassengerRound;
      }

      const res = await fetch("/api/searchTrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message || status.setting?.lang === "en"
            ? "Something went wrong"
            : "የሆነ ችግር አጋጥሟል"
        );

      sessionStorage.setItem("searchResults", JSON.stringify(data));

      router.push(
        `/components/result?tripType=${tripType}&cityOne=${selectedCity}&cityTwo=${selectedCityTwo}&numPass=${numberPassengerFirst}&numPassTwo=${
          roundTripClick ? numberPassengerRound : 0
        }`
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4">
      {/**Top bar */}
      <div
        className={`fixed top-16 left-0 w-full p-4 shadow-md  ${
          status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
        } flex justify-between items-center `}
      >
        <ActionButtons status={status} />
      </div>

      {/**Menu */}
      <div
        className={`mt-11 p-2 border-1 border-gray-200 rounded-md shadow-md ${
          status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
        }`}
      >
        {/**From, To */}
        <div className="sm:flex space-x-4 pt-2">
          {/* From */}
          <div ref={fromRef}>
            <CityInput
              labelEn="From"
              labelAm="ከ"
              placeholderEn="Departure"
              placeholderAm="መነሻ"
              iconLight="/assets/icons/bus_from.svg"
              iconDark="/assets/icons/bus_from_white.svg"
              value={selectedCity}
              valueAmh={selectedCityAmh}
              isOpen={isOpen}
              theme={status.setting?.theme}
              onFocus={handelFromFocus}
              onChange={(val) => {
                if (status.setting?.lang === "en") setSelectedCity(val);
                else setSelectedCityAmh(val);
              }}
              cityList={cityList}
              favoriteCities={favoriteCities}
              searchedCities={searchedDepartureCities.map((d) => ({
                en: d.en,
                am: d.am,
              }))}
              allClick={allClick}
              fav={fav}
              search={search}
              toggleFavorite={toggleFavorite}
              handelCity={handelCity}
              handelAll={handelAll}
              handelFav={handelFav}
              handelSearch={handelSearch}
            />
          </div>

          {/* Exchange Button */}
          <ExchangeButton
            exHover={exHover}
            exchange={exchange}
            theme={status.setting?.theme}
            handelExClick={handelExClick} // <-- swap happens here
            handelExHover={handelExHover}
          />

          {/* To */}
          <div ref={toRef}>
            <CityInput
              labelEn="To"
              labelAm="እስከ"
              placeholderEn="Destination"
              placeholderAm="መዳረሻ"
              iconLight="/assets/icons/bus.svg"
              iconDark="/assets/icons/bus_white.svg"
              value={selectedCityTwo}
              valueAmh={selectedCityTwoAmh}
              isOpen={isOpenTwo}
              theme={status.setting?.theme}
              onFocus={handelToFocus}
              onChange={(val) => {
                if (status.setting?.lang === "en") setSelectedCityTwo(val);
                else setSelectedCityTwoAmh(val);
              }}
              cityList={cityList}
              favoriteCities={favoriteCitiesTwo}
              searchedCities={searchedDestinationCities.map((d) => ({
                en: d.en,
                am: d.am,
              }))}
              allClick={allClickTwo}
              fav={favTwo}
              search={searchTwo}
              toggleFavorite={toggleFavoriteTwo}
              handelCity={handelCityTwo}
              handelAll={handelAllTwo}
              handelFav={handelFavTwo}
              handelSearch={handelSearchTwo}
            />
          </div>
        </div>
        <TripDatePassenger
          status={status}
          oneWayDate={oneWayDate}
          handelOneWayDate={handelOneWayDate}
          numberPassengerFirst={numberPassengerFirst}
          handelNumberPassenger={handelNumberPassenger}
          roundTripClick={roundTripClick}
          roundDate={roundDate}
          handelRoundDate={handelRoundDate}
          numberPassengerRound={numberPassengerRound}
          handelNumberPassengerRound={handelNumberPassengerRound}
        />

        <TripTypeSelector
          status={status}
          singleTrip={singleTrip}
          oneWay={oneWay}
          roundTrip={roundTrip}
          roundTripClick={roundTripClick}
          handelOneWay={handelOneWay}
          handel_single_tript={handel_single_tript}
          handelRoundTripClick={handelRoundTripClick}
          handel_round_tript={handel_round_tript}
        />

        <TripSearchButton
          status={status}
          handleSearchClick={handleSearchClick}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return <HomePage />;
}
