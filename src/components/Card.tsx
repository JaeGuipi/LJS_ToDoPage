"use client";
import React from "react";
import { CardData } from "@/store/todoStore";

interface CardProps {
  cardData: CardData;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
}

const Card: React.FC<CardProps> = ({ cardData, onUpdate, onDelete }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.value);
  };

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <input
        type="text"
        value={cardData.title}
        onChange={handleChange}
        className="w-full p-1 border border-gray-300 rounded"
      />
      <button
        onClick={onDelete}
        className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        카드 삭제
      </button>
    </div>
  );
};

export default Card;
