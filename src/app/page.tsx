"use client";
import { useEffect, useRef, useState } from "react";
import Column from "@/components/Column";
import { useTodoStore } from "@/store/todoStore";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import add from "@/../public/ic_add.svg";
import Image from "next/image";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const todoData = useTodoStore((state) => state.todoData);
  const addColumn = useTodoStore((state) => state.addColumn);
  const updateColumn = useTodoStore((state) => state.updateColumn);
  const deleteColumn = useTodoStore((state) => state.deleteColumn);
  const moveColumn = useTodoStore((state) => state.moveColumn);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 새로운 컬럼이 추가되면 스크롤 컨테이너의 오른쪽 끝으로 스크롤
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [todoData.columns.length]);

  if (!isMounted) {
    return null;
  }

  // 드래그 종료 이벤트 처리
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // 컬럼 이동
    if (type === "column") {
      if (source.index !== destination.index) {
        moveColumn(source.index, destination.index);
      }
      return;
    }

    const sourceColIndex = todoData.columns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIndex = todoData.columns.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (sourceColIndex < 0 || destColIndex < 0) return;

    const newColumns = [...todoData.columns];
    const sourceCards = [...newColumns[sourceColIndex].cards];
    const destCards =
      sourceColIndex === destColIndex
        ? sourceCards
        : [...newColumns[destColIndex].cards];

    const [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);

    if (sourceColIndex === destColIndex) {
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        cards: sourceCards,
      };
    } else {
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        cards: sourceCards,
      };
      newColumns[destColIndex] = {
        ...newColumns[destColIndex],
        cards: destCards,
      };
    }

    useTodoStore.setState({ todoData: { ...todoData, columns: newColumns } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-[100px] bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold">To Do Board</h1>
      </header>

      <main className="bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          {/* 컬럼 리스트: 가로 스크롤 영역에 ref 지정 */}
          <div
            className="flex-1 overflow-x-auto overlay-scrollbar"
            ref={scrollContainerRef}
          >
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-4"
                  >
                    {todoData.columns.map((column, index) => (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Column
                              columnData={column}
                              onUpdate={updateColumn}
                              onDelete={deleteColumn}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          {/* 컬럼 추가 버튼: 항상 보임 */}
          <button
            onClick={addColumn}
            className="p-2 bg-white w-10 h-10 rounded hover:bg-gray-100 shadow-md"
          >
            <Image src={add} alt="add" width={25} />
          </button>
        </div>
      </main>
    </div>
  );
}
