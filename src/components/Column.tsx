import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import { ColumnData } from "@/store/todoStore";
import { v4 as uuidv4 } from "uuid";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import check from "@/../public/ic_check.svg";
import Image from "next/image";
import edit from "@/../public/ic_edit.svg";

interface ColumnProps {
  columnData: ColumnData;
  onUpdate: (updatedColumn: ColumnData) => void;
  onDelete: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ columnData, onUpdate, onDelete }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(columnData.title);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempTitle(columnData.title);
  }, [columnData.title]);

  // 영역 바깥 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setIsEditingTitle(false);
      }
    }
    if (isEditingTitle) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingTitle]);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onUpdate({ ...columnData, title: tempTitle });
      setIsEditingTitle(false);
    }
  };

  const addCard = () => {
    const newCard = { id: uuidv4(), title: "새 카드" };
    onUpdate({ ...columnData, cards: [...columnData.cards, newCard] });
  };

  const updateCard = (cardId: string, newTitle: string) => {
    const updatedCards = columnData.cards.map((card) =>
      card.id === cardId ? { ...card, title: newTitle } : card
    );
    onUpdate({ ...columnData, cards: updatedCards });
  };

  const deleteCard = (cardId: string) => {
    const updatedCards = columnData.cards.filter((card) => card.id !== cardId);
    onUpdate({ ...columnData, cards: updatedCards });
  };

  const handleDelete = () => {
    if (window.confirm("정말 이 컬럼을 삭제하시겠습니까?")) {
      onDelete(columnData.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-80 h-[calc(100vh-150px)] flex flex-col">
      <div className="mb-4">
        {isEditingTitle ? (
          <div className="flex items-center" ref={inputWrapperRef}>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              className="w-full text-xl font-semibold border border-gray-300 rounded py-0 px-2"
              autoFocus
            />
            <button
              onClick={() => {
                onUpdate({ ...columnData, title: tempTitle });
                setIsEditingTitle(false);
              }}
              className="ml-2 h-[33.5px] bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500"
            >
              <Image src={check} alt="check" />
            </button>
          </div>
        ) : (
          <div
            className="group relative hover:text-gray-500"
            onClick={() => setIsEditingTitle(true)}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold cursor-pointer">
                {columnData.title}
              </h2>
              <p className="bg-gray-100 w-5 h-5 text-center text-sm rounded-lg">
                {columnData.cards.length}
              </p>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Image src={edit} alt="Edit Icon" width={20} height={20} />
            </div>
          </div>
        )}
      </div>
      <button
        onClick={addCard}
        className="bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500"
      >
        카드 추가
      </button>
      <Droppable droppableId={columnData.id} type="card">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 flex-grow overflow-scroll [&::-webkit-scrollbar]:hidden"
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
      <div className="mt-auto flex justify-between items-center">
        <button
          onClick={handleDelete}
          className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
        >
          컬럼 삭제
        </button>
      </div>
    </div>
  );
};

export default Column;
