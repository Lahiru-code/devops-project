/*import React, { useEffect, useState } from "react";
import BookCard from "../../pages/books/BookCard";

import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useFetchAllBooksQuery } from "../../redux/features/books/bookApi";

const categories = [
  "Choose a genre",
  "Business",
  "Fiction",
  "Horror",
  "Adventure",
];

export const Topsellers = () => {
  const [selectedCategory, setselectedCategory] = useState("Choose a genre");

  const { data: books = [] } = useFetchAllBooksQuery();

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (book) =>
            book.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Topsellers </h2>
      {/*ctegory filtering*/ /*}
      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setselectedCategory(e.target.value)}
          name="category"
          id="category"
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {filteredBooks.length > 0 &&
          filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Topsellers;
*/
import React, { useMemo, useState, useEffect } from "react";
import BookCard from "../../pages/books/BookCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useFetchAllBooksQuery } from "../../redux/features/books/bookApi";

const categories = [
  { label: "All genres", value: "all" },
  { label: "Business", value: "business" },
  { label: "Fiction", value: "fiction" },
  { label: "Horror", value: "horror" },
  { label: "Adventure", value: "adventure" },
  { label: "Marketing", value: "marketing" },
];

const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

export const Topsellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // RTK Query
  const { data, isLoading, isError, error } = useFetchAllBooksQuery();

  // ✅ IMPORTANT: support both API shapes:
  // 1) backend returns []  => data is array
  // 2) backend returns { books: [] } => data.books
  const books = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.books && Array.isArray(data.books)) return data.books;
    return [];
  }, [data]);

  // Debug only when books loaded
  useEffect(() => {
    if (!isLoading) {
      console.log("BOOKS LENGTH:", books.length);
      console.log("CATEGORIES:", [...new Set(books.map((b) => b.category))]);
      console.log("RAW DATA:", data);
      if (error) console.log("ERROR:", error);
    }
  }, [isLoading, books, data, error]);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "all") return books;
    return books.filter(
      (b) => normalize(b.category) === normalize(selectedCategory),
    );
  }, [books, selectedCategory]);

  if (isLoading) return <div className="py-10">Loading...</div>;

  if (isError) {
    const msg =
      error?.data?.message ||
      error?.error ||
      "Failed to load books (check backend /api/books)";
    return <div className="py-10 text-red-600">{msg}</div>;
  }

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Topsellers</h2>

      {/* Category filter */}
      <div className="mb-8 flex items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-gray-500">
          No books found
          {selectedCategory !== "all" ? ` for "${selectedCategory}"` : ""}.
        </div>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 2, spaceBetween: 50 },
            1180: { slidesPerView: 2, spaceBetween: 40 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {filteredBooks.map((book) => (
            <SwiperSlide key={book._id || book.id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Topsellers;
