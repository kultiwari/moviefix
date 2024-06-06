import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";

import "./eplorestyle.scss";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import ButtonSection from "../../components/buttonSection/ButtonSection";
import logo from "../../assets/movix-logo.png";

let filters = {};

const sortbyData = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    {
        value: "primary_release_date.desc",
        label: "Release Date Descending",
    },
    { value: "primary_release_date.asc", label: "Release Date Ascending" },
    { value: "original_title.asc", label: "Title (A-Z)" },
];

const Explore = () => {
    const [data, setData] = useState({});
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(null); // Change to a single genre
    const [sortby, setSortby] = useState(null);
    const { mediaType } = useParams();

    const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

    const fetchInitialData = async () => {
        setLoading(true);
        const moviesByYear = {};

        for (let year = 2012; year <= 2024; year++) {
            const response = await fetchDataFromApi(`/discover/${mediaType}`, {
                ...filters,
                primary_release_year: year,
                page: 1,
            });
            if (response?.results) {
                moviesByYear[year] = response.results.slice(0, 20);
            }
        }
        setData(moviesByYear);
        setLoading(false);
    };

    useEffect(() => {
        filters = {};
        setData({});
        setPageNum(1);
        setSortby(null);
        setGenre(null);
        fetchInitialData();
    }, [mediaType]);

    const onChange = (selectedItem, action) => {
        if (action.name === "sortby") {
            setSortby(selectedItem);
            if (selectedItem) {
                filters.sort_by = selectedItem.value;
            } else {
                delete filters.sort_by;
            }
        }

        if (action.name === "genres") {
            setGenre(selectedItem);
            if (selectedItem) {
                filters.with_genres = selectedItem.id.toString();
            } else {
                delete filters.with_genres;
            }
        }

        setPageNum(1);
        fetchInitialData();
    };

    return (
        <div>
            <div className="pageHeader">
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="" />
                </div>
                <div className="filters">
                    <ButtonSection
                        genresData={genresData}
                        selectedGenre={genre}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="explorePage">
                <ContentWrapper>
                    {loading && <Spinner initial={true} />}
                    {!loading && (
                        <>
                            {Object.keys(data).length > 0 ? (
                                Object.keys(data).map((year) => (
                                    <div key={year}>
                                        <h2>{year}</h2>
                                        <div className="yearMovies">
                                            {data[year].map((item, index) => (
                                                <MovieCard
                                                    key={index}
                                                    data={item}
                                                    mediaType={mediaType}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span className="resultNotFound">
                                    Sorry, Results not found!
                                </span>
                            )}
                        </>
                    )}
                </ContentWrapper>
            </div>
        </div>
    );
};

export default Explore;
