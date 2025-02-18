"use client";
import React, { useState, useEffect, useRef } from "react";
import { CardData } from "@/store/todoStore";
import menu from "@/../public/ic_menu.svg";
import Image from "next/image";
import checkCircle from "@/../public/ic_check_circle.svg";
import checkCircleFilled from "@/../public/ic_check_circle_filled.svg";
import inputcheck from "@/../public/ic_input_check.svg";

interface CardProps {
  cardData: CardData;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

/**
 * Card 컴포넌트: 개별 할일 카드를 표시하고 관리
 *
 * 주요 기능:
 * - 카드 내용 표시 및 수정
 * - 드롭다운 메뉴를 통한 수정/삭제 기능
 * - 클릭 외부 감지를 통한 드롭다운 자동 닫기
 */
const Card: React.FC<CardProps> = ({
  cardData,
  onUpdate,
  onDelete,
  onToggleComplete,
}) => {
  // 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(cardData.title);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 카드 제목이 외부에서 변경될 경우 동기화
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

  // 수정 완료 처리
  const finishEditing = () => {
    if (tempTitle.trim()) {
      // 빈 문자열 방지
      onUpdate(tempTitle);
    } else {
      setTempTitle(cardData.title); // 원래 제목으로 복구
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEditing();
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow-sm relative h-[110px] flex flex-col">
      {isEditing ? (
        <div className="relative w-full h-full">
          <input
            type="text"
            value={tempTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={finishEditing}
            className="w-full p-1 border-gray-300 rounded cursor-pointer h-full flex items-center border pr-10"
            autoFocus
          />
          <button
            onClick={finishEditing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
          >
            <Image src={inputcheck} alt="확인" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onToggleComplete}
              className="w-[35px] h-[35px] hover:bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Image
                src={cardData.completed ? checkCircleFilled : checkCircle}
                alt="complete"
                width={20}
                height={20}
              />
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-[35px] h-[35px] hover:bg-gray-100 rounded-full flex items-center justify-center"
              >
                <Image src={menu} alt="menu" width={20} height={20} />
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
          </div>
          <p
            className={`flex-1 p-1 border-gray-300 rounded cursor-pointer line-clamp-3 overflow-hidden ${
              cardData.completed ? "line-through text-gray-400" : ""
            }`}
            title={cardData.title}
          >
            {cardData.title}
          </p>
        </>
      )}
    </div>
  );
};

export default Card;
