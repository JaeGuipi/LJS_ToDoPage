"use client";
import React, { useState, useEffect, useRef } from "react";
import { CardData } from "@/store/todoStore";
import menu from "@/../public/ic_menu.svg";
import Image from "next/image";

interface CardProps {
  cardData: CardData;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
}

const Card: React.FC<CardProps> = ({ cardData, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(cardData.title);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempTitle(cardData.title);
  }, [cardData.title]);

  // 클릭이 드롭다운 외부에서 일어났을 때 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  };

  const finishEditing = () => {
    onUpdate(tempTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEditing();
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow-sm relative h-[110px]">
      {isEditing ? (
        <input
          type="text"
          value={tempTitle}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={finishEditing}
          className="w-full p-1 border-gray-300 rounded cursor-pointer h-full flex items-center border "
          autoFocus
        />
      ) : (
        <p className="w-full p-1 border-gray-300 rounded cursor-pointer h-full flex items-center">
          {cardData.title}
        </p>
      )}

      {isEditing ? null : (
        <div className="absolute top-1 right-1" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100"
          >
            <Image src={menu} alt="menu" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowDropdown(false);
                }}
                className="w-full text-center text-sm px-3 py-2 hover:bg-gray-100"
              >
                수정하기
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  if (window.confirm("정말 이 카드를 삭제하시겠습니까?")) {
                    onDelete();
                  }
                }}
                className="text-red-400 w-full text-sm text-center px-3 py-2 hover:bg-gray-100"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
