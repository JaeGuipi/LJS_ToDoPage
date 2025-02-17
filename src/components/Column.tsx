"use client";
import React, { useState, useEffect } from "react";
import Card from "./Card";
import { ColumnData } from "@/store/todoStore";
import { v4 as uuidv4 } from "uuid";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ColumnProps {
  columnData: ColumnData;
  onUpdate: (updatedColumn: ColumnData) => void;
  onDelete: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ columnData, onUpdate, onDelete }) => {
  // 타이틀 편집 상태
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(columnData.title);

  useEffect(() => {
    setTempTitle(columnData.title);
  }, [columnData.title]);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onUpdate({ ...columnData, title: tempTitle });
      setIsEditingTitle(false);
    }
  };

  // 카드 추가 (스토어의 addCard 대신 onUpdate를 통해 컬럼 업데이트)
  const addCard = () => {
    const newCard = { id: uuidv4(), title: "새 카드" };
    onUpdate({ ...columnData, cards: [...columnData.cards, newCard] });
  };

  // 카드 업데이트
  const updateCard = (cardId: string, newTitle: string) => {
    const updatedCards = columnData.cards.map((card) =>
      card.id === cardId ? { ...card, title: newTitle } : card
    );
    onUpdate({ ...columnData, cards: updatedCards });
  };

  // 카드 삭제
  const deleteCard = (cardId: string) => {
    const updatedCards = columnData.cards.filter((card) => card.id !== cardId);
    onUpdate({ ...columnData, cards: updatedCards });
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md w-80">
      <div className="mb-4">
        {isEditingTitle ? (
          <div className="flex items-center">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={() => {
                onUpdate({ ...columnData, title: tempTitle });
                setIsEditingTitle(false);
              }}
              className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              저장
            </button>
          </div>
        ) : (
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {columnData.title}
          </h2>
        )}
      </div>
      <button
        onClick={() => onDelete(columnData.id)}
        className="mb-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        컬럼 삭제
      </button>
      <Droppable droppableId={columnData.id} type="card">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {columnData.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      cardData={card}
                      onUpdate={(newTitle) => updateCard(card.id, newTitle)}
                      onDelete={() => deleteCard(card.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        onClick={addCard}
        className="mt-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        카드 추가
      </button>
    </div>
  );
};

export default Column;
